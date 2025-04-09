import {Subscription, Message, MessageType} from './SubscriptionTypes';

class SubscriptionManager {
    private readonly subscriptions: Map<string, Map<string, (message: unknown) => void>>;
    private readonly pending: Map<string, [resolve: (subscription: Subscription) => void, reject: (reason?: unknown) => void]>

    constructor(private worker: Worker) {
        this.subscriptions = new Map();
        this.pending = new Map();

        worker.onmessage = (event) => {
            const message: Message = event.data;
            switch (message.type) {
                case MessageType.SUBSCRIBE:
                case MessageType.UNSUBSCRIBE:
                case MessageType.REMOVE_ALL:
                case MessageType.DISPOSE:
                    this.updatePending(message);
                    break;
                case MessageType.MESSAGE:
                    this.onMessage(message);
                    break;
            }
        };
    }

    public subscribe(topic: string, id: string, callback: (message: unknown) => void): Promise<Subscription|null> {
        const local_subscribers = this.subscriptions.get(topic);
        if (local_subscribers && local_subscribers.has(id)) {
            return Promise.resolve({topic, id} as Subscription);
        }

        return new Promise<Subscription | null>((resolve) => {
            this.send(topic, id, MessageType.SUBSCRIBE)
                .then(
                    subscription => {
                        let subscribers = this.subscriptions.get(subscription.topic);
                        if (subscribers) {
                            subscribers.set(subscription.id, callback);
                        } else {
                            subscribers = new Map();
                            subscribers.set(subscription.id, callback);
                            this.subscriptions.set(topic, subscribers);
                        }
                        resolve(subscription);
                    }
                )
                .catch(() => {
                    resolve(null);
                });
        });
    }

    public unsubscribe(subscription: Subscription): Promise<void> {
        const local_subscribers = this.subscriptions.get(subscription.topic);
        if (!local_subscribers || !local_subscribers.has(subscription.id)) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            this.send(subscription.topic, subscription.id, MessageType.UNSUBSCRIBE)
                .then(
                    subscription => {
                        const subscribers = this.subscriptions.get(subscription.topic);
                        if (subscribers) {
                            subscribers.delete(subscription.id);
                        }
                    }
                )
                .finally(() => {
                    resolve();
                });
        });
    }

    public dispose(): Promise<void> {
        return new Promise((resolve) => {
            this.sendDispose()
                .finally(() => {
                    for (const subscription of this.subscriptions.values()) {
                        subscription.clear();
                    }
                    this.subscriptions.clear();
                    this.worker.terminate();
                    resolve();
                });
        });
    }

    public disposeFor(topic: string): Promise<void> {
        return new Promise((resolve) => {
            this.send(topic, 'ALL', MessageType.REMOVE_ALL)
                .finally(() => {
                    const subscribers = this.subscriptions.get(topic);
                    if (subscribers) {
                        subscribers.clear();
                        this.subscriptions.delete(topic);
                    }
                    resolve();
                });
        });
    }

    private onMessage(message: Message) {
        const subscribers = this.subscriptions.get(message.subscription.topic);
        if (subscribers) {
            for (const callback of subscribers.values()) {
                callback(message);
            }
        }
    }

    private sendCore(id: string, messageType: MessageType): Promise<Subscription> {
        return new Promise((resolve, reject) => {
            this.pending.set(id, [resolve, reject]);
            this.worker.postMessage({ type: messageType, id });
        });
    }

    private send(topic: string, id: string, messageType: MessageType): Promise<Subscription> {
        return this.sendCore(`${topic}_${id}`, messageType);
    }

    private sendDispose(): Promise<Subscription> {
        const type = MessageType.DISPOSE;
        return this.sendCore(`${type}}`, type);
    }

    private updatePending(message: Message) {
        const request = this.pending.get(message.id);
        if (request) {
            this.pending.delete(message.id);
            const [resolve] = request;
            resolve(message.subscription as Subscription);
        }
    }
}

const worker = new Worker('./SubscriptionWorker.js')
export const subscriptionManager = new SubscriptionManager(worker);