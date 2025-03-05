import { webApihandler } from "@/services/web-api-handler";
import {InquiryRequest} from "@/services/investor-relations-data/model";

class InvestorRelationsService {
    readonly serviceName = 'hurricane-api';

    async getTaskForm(): Promise<InquiryRequest> {
        try {
            return await webApihandler.get('task_form', {}, {
                serviceName: this.serviceName
            });
        } catch (e) {
            return {};
        }
    }

    async submit(inquiry: InquiryRequest): Promise<boolean> {
        try {
            const newForm = await this.getTaskForm();
            const newInquiry = {
                ...newForm,
                ...inquiry
            };
            await webApihandler.post(
                'submit_form',
                newInquiry,
                {}, {
                    serviceName: this.serviceName
                });
            return true;
        } catch (e) {
            return false;
        }
    }

    async getSubmittedTasks(assignee: string): Promise<InquiryRequest[]> {
        return await webApihandler
            .get(
                'submitted_tasks',
                {
                    assignee
                }, {
                    serviceName: this.serviceName
                });
    }

    async changeStatus(assignee: string, id: string, status: string): Promise<boolean> {
        await webApihandler.get('change_status', {
            assignee,
            update_task_id: id,
            new_status: status
        }, {
            serviceName: this.serviceName
        });
        return true;
    }
}

export const investorRelationsService = new InvestorRelationsService();