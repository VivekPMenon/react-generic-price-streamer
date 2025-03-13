export enum MessageType {
    Text = 'text',
    Attachment = 'attachment'
}

export enum ReadStatus {
    Seen = 'seen',
    Unseen = 'unseen'
}

export interface Message {
    id?: number;
    group_id?: number;
    group_name?: string;
    sender?: string;
    sender_time_info?: string;
    message_type?: string;
    message?: string;
    read_status?: string;
}