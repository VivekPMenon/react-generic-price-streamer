import {
    Connector,
    Message,
    MessageHandler,
    MessageLike,
    MessageType,
    parseSubscription,
    SubscriptionLike,
    EmptySubscription,
    createMessage,
    hasSubscriber
} from "@/lib/utility/SubscriptionTypes";
import { io, Socket } from "socket.io-client";

export class LocalConnector implements Connector {
    private readonly subscriptions: Map<string, SubscriptionLike> = new Map();

    private handler: MessageHandler|undefined;
    private socket: Socket|undefined;

    constructor(private readonly uri: string) {}

    public addHandler(handler: MessageHandler): void {
        this.handler = handler;
        this.checkConnection();
    }

    public send(message: Message): void {
        this.handleMessage(message);
    }

    public dispose(): void {
        this.handler = undefined;
        this.socket?.disconnect();
    }

    public connect(): void {
        if (this.socket) {
            return;
        }

        this.socket = io(this.uri);
        this.socket.on('group-message', (data) => {
            if (!this.handler) {
                throw new Error("Handler must be added");
            }

            if (hasSubscriber(data.message.data.topic, this.subscriptions.values())) {
                this.handler(createMessage(data.message.data.topic, data.message.data.data));
            }
        });

        this.socket.connect();
    }

    private handleMessage(message: MessageLike) {
        if (!this.handler) {
            throw new Error("Must call add handler first");
        }

        switch (message.type) {
            case MessageType.SUBSCRIBE: {
                let subscription = this.subscriptions.get(message.id);
                if (!subscription) {
                    subscription = parseSubscription(message.id);
                    this.subscriptions.set(message.id, subscription);
                }
                this.handler({ ...message, subscription});
            }
                break;
            case MessageType.UNSUBSCRIBE: {
                let subscription = this.subscriptions.get(message.id)
                if (subscription) {
                    this.subscriptions.delete(message.id);
                } else {
                    subscription = parseSubscription(message.id);
                }
                this.handler({ ...message, subscription});
            }
                break;
            case MessageType.REMOVE_ALL: {
                const subscription = parseSubscription(message.id);
                for (const [key, value] of this.subscriptions.entries()) {
                    if (value.topic === subscription.topic) {
                        this.subscriptions.delete(key);
                    }
                }
                if (subscription) {
                    this.handler({ ...message, subscription});
                } else {
                    this.handler({ ...message, subscription: EmptySubscription});
                }
            }
                break;
            case MessageType.DISPOSE: {
                this.subscriptions.clear();
                this.handler({ ...message, subscription: EmptySubscription});
            }
                break;
        }
    }

    private checkConnection() {
        if (!this.socket) {
            this.connect();
        }

        if (!this.socket) {
            throw new Error('Failed to connect');
        }
    }
}