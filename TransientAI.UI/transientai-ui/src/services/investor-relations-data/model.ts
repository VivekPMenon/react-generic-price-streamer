export enum InquiryFlag {
    Regular = <any>'Regular',
    Important = <any>'important',
    Urgent = <any>'urgent'
}

export enum InquiryStatus {
    Open = <any>'open',
    Completed = <any>'completed'
}

export interface InquiryRequest {
    id?: string;
    date?: string;
    assignee_email?: string;
    owner_name?: string;
    owner_email?: string;
    subject?: string;
    inquiry?: string;
    status?: InquiryStatus;
    completed?: boolean;
    flag?: InquiryFlag;
    due_date?: string;
    date_edited?: string;
}

export interface IREmailMessage {
    id: string;
    conversation_id: string;
    subject: string;
    sender: string;
    received: string; // ISO timestamp
    has_attachments: boolean;
    concise_summary: string;
    complete: boolean;
    important: boolean;
    threadflag: boolean;
    cc_addresses?: Recipient[]; // Array of CC recipients
}

export interface Recipient {
    name: string;
    email: string;
    type: 'person' | 'group';
    department?: string;
}

