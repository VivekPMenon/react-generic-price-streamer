import {bridge, SubscriptionBridge, MessageType} from './SubscriptionBridge';
import {Subscription} from './Subscription';

class SubscriptionManager {
    private subscriptions: Map<string, Map<string, (message: unknown) => void>> = new Map();

    constructor(private bridge: SubscriptionBridge) {
    }

    public subscribe(topic: string, callback: (message: unknown) => void): Promise<Subscription|null> {
        return new Promise<Subscription | null>((resolve) => {
            this.bridge.send(topic, MessageType.SUBSCRIBE)
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
        return new Promise((resolve) => {
            this.bridge.send(subscription.topic, MessageType.UNSUBSCRIBE)
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
            this.bridge.sendDispose()
                .finally(() => {
                    for (const subscription of this.subscriptions.values()) {
                        subscription.clear();
                    }
                    this.subscriptions.clear();
                    resolve();
                });
        });
    }

    public disposeFor(topic: string): Promise<void> {
        return new Promise((resolve) => {
            this.bridge.send(topic, MessageType.REMOVE_ALL)
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
}

export const subscriptionManager = new SubscriptionManager(bridge)