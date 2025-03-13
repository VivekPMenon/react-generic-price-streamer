export interface BreakNewsItem{
    id?: number | string;
    group_id?: number | string
    group_name?: string;
    sender?: string;
    sender_time_info?: Date | string;
    message_type?: string
    message?: string
    read_status?: string
}