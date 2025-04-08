export interface ReportItem {
    manager: string;
    dayPnl: number;
    mtdPnl: number;
    ytdPnl: number;
    dayPnlNoFees: number;
    mtdPnlNoFees: number;
    ytdPnlNoFees: number;
}

export interface Report {
    data: ReportItem[];
    last_updated: string;
    filename: string;
}