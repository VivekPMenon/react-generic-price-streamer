export interface InquiryRequest {
    date?: string;
    inquiredBy?: string;
    subject?: string;
    request?: string;
    statuses: Array<string>;
    edited?: string;
}