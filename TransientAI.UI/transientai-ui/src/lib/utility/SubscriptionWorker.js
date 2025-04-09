import { MessageType } from './SubscriptionTypes';
import { io } from "socket.io-client";

const EMPTY = {id: '', topic: ''};
const subscriptions = new Map();

function parseSubscription(id) {
    const parts = id.split('_');
    return { topic: parts[0], id: parts[1] };
}

function handleMessage(event) {
    const data = event.data; // MessageLike
    switch (data.type) {
        case MessageType.SUBSCRIBE: {
            let subscription = subscriptions.get(data.id);
            if (!subscription) {
                subscription = parseSubscription(data.id);
                subscriptions.set(data.id, subscription);
            }
            self.postMessage({ ...data, subscription});
        }
            break;
        case MessageType.UNSUBSCRIBE: {
            let subscription = subscriptions.get(data.id)
            if (subscription) {
                subscriptions.delete(data.id);
            } else {
                subscription = parseSubscription(data.id);
            }
            self.postMessage({ ...data, subscription});
        }
            break;
        case MessageType.REMOVE_ALL: {
            const subscription = parseSubscription(data.id);
            for (const [key, value] of subscriptions.entries()) {
                if (value.topic === subscription.topic) {
                    subscriptions.delete(key);
                }
            }
            if (subscription) {
                self.postMessage({ ...data, subscription});
            } else {
                self.postMessage({ ...data, subscription: EMPTY});
            }
        }
            break;
        case MessageType.DISPOSE: {
            subscriptions.clear();
            self.postMessage({ ...data, subscription: EMPTY});
        }
            break;
    }
}

function connect() {
    const socket = io('');

    socket.on('data', (data) => {
        // find topic to attach to subscription
        // also check if there are any subscribers, otherwise, dont send
        self.postMessage({
            id: '',
            type: MessageType.MESSAGE,
            subscription: {
                id: '',
                topic: ''
            },
            data
        });
    })

    socket.connect();

    self.addEventListener('message', handleMessage);
}

console.log(connect);

// connect();