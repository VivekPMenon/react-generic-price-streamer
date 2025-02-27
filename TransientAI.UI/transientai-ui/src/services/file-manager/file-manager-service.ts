import { webApihandler } from "@/services/web-api-handler";
import { File } from "@/services/file-manager/model";

class FileManagerService {
    readonly serviceName = 'hurricane-api';

    async getUploadedFiles(): Promise<Array<File>> {
        try {
            const result = await webApihandler.get('list-pdfs', {}, {
                serviceName: this.serviceName
            });

            return result.map((file: any) => ({
                ...file,
                uploaded: new Date()
            }));
        } catch (e) {
            return [];
        }
    }

    getUploadedFileUrl(fileName: string): string {
        return webApihandler.getUrl(`get-pdf/${fileName}`, {
            serviceName: this.serviceName
        });
    }

    async uploadFile(file: File): Promise<boolean> {
        const data = new FormData();
        data.append('file', file.native_file);

        await webApihandler
            .post(
                'upload-pdf',
                data, {}, {
                serviceName: this.serviceName
            },
                {
                    'Content-Type': 'multipart/form-data',
                    'accept': 'application/json'
                });
        return true;
    }

    async deleteFile(id: string): Promise<boolean> {
        await webApihandler.delete('delete-pdf/' + id, { serviceName: this.serviceName });
        return true;
    }
}

export const fileManagerService = new FileManagerService();