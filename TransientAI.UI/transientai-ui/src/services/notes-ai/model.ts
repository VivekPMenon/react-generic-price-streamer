export interface ITranscriptsList{
    blob_name: string,
    meeting_date: string | null,
    created_at: string
}

export interface IOriginalTranscripts{
    speaker: string,
    time: string,
    text: string
}