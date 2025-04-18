import { MessageType, parseSubscription, EmptySubscription, createMessage, hasSubscriber } from './SubscriptionTypes';
import { io } from "socket.io-client";

class SubscriptionWorker {
    subscriptions = new Map();

    constructor() {}

    handleMessage(event) {
        const data = event.data; // MessageLike
        switch (data.type) {
            case MessageType.SUBSCRIBE: {
                let subscription = this.subscriptions.get(data.id);
                if (!subscription) {
                    subscription = parseSubscription(data.id);
                    this.subscriptions.set(data.id, subscription);
                }
                self.postMessage({ ...data, subscription});
            }
                break;
            case MessageType.UNSUBSCRIBE: {
                let subscription = this.subscriptions.get(data.id)
                if (subscription) {
                    this.subscriptions.delete(data.id);
                } else {
                    subscription = parseSubscription(data.id);
                }
                self.postMessage({ ...data, subscription});
            }
                break;
            case MessageType.REMOVE_ALL: {
                const subscription = parseSubscription(data.id);
                for (const [key, value] of this.subscriptions.entries()) {
                    if (value.topic === subscription.topic) {
                        this.subscriptions.delete(key);
                    }
                }
                if (subscription) {
                    self.postMessage({ ...data, subscription});
                } else {
                    self.postMessage({ ...data, subscription: EmptySubscription});
                }
            }
                break;
            case MessageType.DISPOSE: {
                this.subscriptions.clear();
                self.postMessage({ ...data, subscription: EmptySubscription});
            }
                break;
        }
    }

    connect() {
        const socket = new io('');

        socket.on('group-message', data => {
            if (hasSubscriber(data.topic, this.subscriptions.values())) {
                self.postMessage(createMessage(data.topic, data.data));
            }
        });

        socket.connect();

        self.addEventListener('message', this.handleMessage);
    }
}

const worker = new SubscriptionWorker();
console.log(worker.connect);

// worker.connect();