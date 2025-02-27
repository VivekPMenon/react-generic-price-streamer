import {webApihandler} from "@/services/web-api-handler";
import {File} from "@/services/file-manager/model";

class FileManagerService {
    async getUploadedFiles(): Promise<Array<File>> {
        try {
            const result = await webApihandler.get('list-pdfs', {}, {
                serviceName: 'hurricane-api'
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
            serviceName: 'hurricane-api'
        });
    }

    async uploadFile(file: File): Promise<boolean> {
        const data = new FormData();
        data.append('file', file.native_file);

        await webApihandler
            .post(
                'upload-pdf',
                data, {},{
                    serviceName: 'hurricane-api'
                },
                {
                    'Content-Type': 'multipart/form-data',
                    'accept': 'application/json'
                });
        return true;
    }
}

export const fileManagerService = new FileManagerService();