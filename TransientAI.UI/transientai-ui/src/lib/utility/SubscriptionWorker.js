import {MessageType} from './SubscriptionTypes';

const subscriptions = new Map();

function parseSubscription(id) {
    const parts = id.split('_');
    return { topic: parts[0], id: parts[1] };
}

function handleMessage(event) {
    const data = event.data; // MessageLike
    switch (data.type) {
        case MessageType.SUBSCRIBE: {
            let subscription = subscriptions.get(data.id)
            if (!subscription) {
                subscription = parseSubscription(data.id);
                subscriptions.set(data.id, subscription);
            }
            postMessage(subscription);

        }
            break;
        case MessageType.UNSUBSCRIBE: {
            let subscription = subscriptions.get(data.id)
            if (subscription) {
                subscriptions.delete(data.id);
            } else {
                subscription = parseSubscription(data.id);
            }
            postMessage(subscription);
        }
            break;
        case MessageType.REMOVE_ALL: {
            const subscription = parseSubscription(data.id);
            for (const subscription_ of subscriptions.values()) {
                if (subscription_.topic === subscription.topic) {
                    subscriptions.delete(subscription_.id);
                }
            }
            if (subscription) {
                postMessage(subscription);
            } else {
                postMessage({id: '', topic: ''});
            }
        }
            break;
        case MessageType.DISPOSE: {
            subscriptions.clear();
            postMessage({id: '', topic: ''});
        }
            break;
    }
}

addEventListener('message', handleMessage);