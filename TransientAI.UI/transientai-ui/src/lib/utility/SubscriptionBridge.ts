import {Subscription} from './Subscription';

export enum MessageType {
    SUBSCRIBE = 'SUBSCRIBE',
    UNSUBSCRIBE = 'UNSUBSCRIBE',
    REMOVE_ALL = 'REMOVE_ALL',
    DISPOSE = 'DISPOSE',
}

export class SubscriptionBridge {
    private pending: Map<string, [resolve: (subscription: Subscription) => void, reject: (reason?: any) => void]>

    constructor(private worker: Worker) {
        this.pending = new Map();
        worker.onmessage = (event) => {
            const message = event.data;
            switch (message.type) {
                case MessageType.SUBSCRIBE:
                {
                    const request = this.pending.get(message.id);
                    if (request) {
                        const [resolve] = request;
                        resolve(message.subscription);
                        this.pending.delete(message.id);
                    }
                }
                break;
                case MessageType.UNSUBSCRIBE:
                {
                    const request = this.pending.get(message.id);
                    if (request) {
                        const [resolve] = request;
                        resolve(message.subscription);
                        this.pending.delete(message.id);
                    }
                }
                    break;
            }
        };
    }

    public send(topic: string, messageType: MessageType): Promise<Subscription> {
        return new Promise((resolve, reject) => {
            const uuid = crypto.randomUUID();
            this.pending.set(`${topic}_${uuid}`, [resolve, reject]);
            this.worker.postMessage({ type: messageType, id: `${topic}_${uuid}` });
        });
    }

    public sendDispose(): Promise<Subscription> {
        return new Promise((resolve, reject) => {
            const uuid = crypto.randomUUID();
            this.pending.set(MessageType.DISPOSE, [resolve, reject]);
            this.worker.postMessage({ type: MessageType.DISPOSE, id: `${MessageType.DISPOSE}_${uuid}` });
        });
    }
}

export const bridge = new SubscriptionBridge({} as Worker)