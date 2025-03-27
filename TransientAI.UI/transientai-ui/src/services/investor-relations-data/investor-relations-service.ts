import { webApihandler } from "@/services/web-api-handler";
import {InquiryRequest, InquiryStatus} from "@/services/investor-relations-data/model";

class InvestorRelationsService {
    readonly serviceName = 'hurricane-api';

    async getTaskForm(): Promise<InquiryRequest> {
        try {
            return await webApihandler.get('task_form', {}, {
                serviceName: this.serviceName
            });
        } catch (e: any) {
            return {};
        }
    }

    async deleteTask(task_id: string): Promise<InquiryRequest> {
        try {
            return await webApihandler.delete(`delete_task/${task_id}`, {
                serviceName: this.serviceName
            });
        } catch (e: any) {
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
        } catch (e: any) {
            return false;
        }
    }

    async getSubmittedTasks(assignee: string): Promise<InquiryRequest[]> {
        return await webApihandler
            .get(
                'submitted_tasks', {
                    assignee_name: assignee
                }, {
                    serviceName: this.serviceName
                });
    }

    async changeStatus(id: string, status: InquiryStatus): Promise<boolean> {
        await webApihandler.post(
            'change_status', {
                update_task_id: id,
                new_status: status
            }, {
                serviceName: this.serviceName
            });
        return true;
    }

    async getAssignees(): Promise<string[]> {
        return await webApihandler.get('assignee_names', {}, {
            serviceName: this.serviceName
        });
    }
}

export const investorRelationsService = new InvestorRelationsService();