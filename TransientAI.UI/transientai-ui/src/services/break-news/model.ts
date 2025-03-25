export interface BreakNewsItem{
    id?: number | string;
    group_id?: number | string
    group_name?: string;
    sender?: string;
    sender_time?: string;
    attachment?: string | null;
    short_message?: string
}