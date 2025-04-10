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