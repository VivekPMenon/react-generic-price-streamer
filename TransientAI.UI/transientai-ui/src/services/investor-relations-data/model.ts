export enum InquiryFlag {
    Regular = <any>'regtask',
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
    assignee_name?: string;
    owner_name?: string;
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
    subject: string;
    sender: string;
    received: string; // ISO timestamp
    has_attachments: boolean;
    concise_summary: string;
    complete: boolean;
    important: boolean;
}

