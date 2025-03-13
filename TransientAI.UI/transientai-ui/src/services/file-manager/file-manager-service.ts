import { webApihandler } from "@/services/web-api-handler";
import { File } from "@/services/file-manager/model";

class FileManagerService {
    readonly serviceName = 'hurricane-api';

    async getUploadedFiles(): Promise<Array<File>> {
        try {
            const result = await webApihandler.get('list-pdfs', {}, {
                serviceName: this.serviceName
            });

            result.forEach((file: File) => {
                file.uploaded = file.upload_date ? new Date(file.upload_date) : new Date();
            })
            return result;
        } catch (e: any) {
            return [];
        }
    }

    getUploadedFileUrl(id: string): string {
        return webApihandler.getUrl(`get-pdf/${id}`, {
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
                serviceName: this.serviceName,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'accept': 'application/json'
                }
            });
        return true;
    }

    async deleteFile(id: string): Promise<boolean> {
        await webApihandler.delete('delete-pdf/' + id, { serviceName: this.serviceName });
        return true;
    }

    async emailFile(id: string, to: string, subject?: string, body?: string): Promise<boolean> {
        await webApihandler
            .post(
                'send-email',
                null, {
                    to_email: to,
                    subject: subject,
                    body: body,
                    pdf_id: id
                }, {
                    serviceName: this.serviceName,
                    headers: {
                        'accept': 'application/json'
                    }
                });
        return true;
    }
}

export const fileManagerService = new FileManagerService();