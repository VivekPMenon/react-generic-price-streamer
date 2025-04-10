export interface SubscriptionLike {
    topic: string;
}

export interface Subscription extends SubscriptionLike {
    id: string;
}

export enum MessageType {
    SUBSCRIBE = 'SUBSCRIBE',
    UNSUBSCRIBE = 'UNSUBSCRIBE',
    REMOVE_ALL = 'REMOVE_ALL',
    DISPOSE = 'DISPOSE',
    MESSAGE = 'MESSAGE'
}

export interface MessageLike {
    id: string;
    type: MessageType;
}

export interface Message extends MessageLike {
    subscription: Subscription|SubscriptionLike;
    data?: Record<string, unknown>;
}

export type MessageHandler = (message: Message) => void;
export type Callback = (message?: Message) => void;

export interface Connector {
    addHandler(handler: MessageHandler): void;
    connect() : void;
    send(message: MessageLike): void;
    dispose(): void;
}

export interface Messenger {
    subscribe(topic: string, id: string, callback: Callback): Promise<Subscription|null>;
    unsubscribe(subscription: Subscription): Promise<void>;
    clear(topic: string): Promise<void>;
    dispose(): Promise<void>;
}

export function parseSubscription(id: string) {
    const parts = id.split('_');
    return { topic: parts[0], id: parts[1] };
}

export function createMessage(topic: string, data: Record<string, unknown>): Message {
    return {
        id: '',
        type: MessageType.MESSAGE,
        subscription: {
            id: '',
            topic
        },
        data
    };
}

export function hasSubscriber(topic: string, subscriptions: MapIterator<SubscriptionLike>) {
    return subscriptions.some((value) =>
        value.topic === topic
    );
}

export const EmptySubscription: Subscription = {id: '', topic: ''};