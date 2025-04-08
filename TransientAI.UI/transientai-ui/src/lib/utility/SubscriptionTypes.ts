export interface Subscription {
    topic: string;
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
    subscription: Subscription;
    data: Record<string, unknown>;
}