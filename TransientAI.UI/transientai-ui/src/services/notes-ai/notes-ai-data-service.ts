import { webApihandler } from "../web-api-handler";


class NotesAIDataService {
    readonly serviceName = 'hurricane-api';

    async getTranscriptsList(){
        const result = await webApihandler.get(`api/transcripts`, {}, { serviceName: this.serviceName });
        return result
    }
    async getTranscriptDetails(blobName: string){
        const result = await webApihandler.get(`api/transcripts/${blobName}`, {}, { serviceName: this.serviceName });
        return result
    }
    async getTranscriptOriginalDetails(blobName?: string){
        const result = await webApihandler.get(`api/raw-transcripts`, {}, { serviceName: this.serviceName });
        return result
    }
}

export const notesAIDataService = new NotesAIDataService();