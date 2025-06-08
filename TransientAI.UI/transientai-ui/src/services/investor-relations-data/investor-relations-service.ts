import { webApihandler } from "@/services/web-api-handler";
import { InquiryRequest, InquiryStatus, IREmailMessage } from "@/services/investor-relations-data/model";
import {endpointFinder} from "@/services/web-api-handler/endpoint-finder-service";
import { userService } from "@/services/user-context/user-service";

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

    async getIREmails(emailId: string): Promise<IREmailMessage[]> {
        try {
            return await webApihandler.get(`ir-emails?email_address=${emailId}`, {}, {
                serviceName: this.serviceName
            });
        } catch (e: any) {
            return [];
        }
    }

    async getEmailContentAsHtml(emailGuid: string, emailId: string): Promise<string> {
        const url = emailId ? `ir-email-html/${emailGuid}?research_email=${emailId}` : `ir-email-html/${emailGuid}`;
        const result = await webApihandler.get(url, {}, { serviceName: this.serviceName });
        return result.html_content;
    }

    async getIRSummary(emailGuid: string, emailId: string): Promise<any> {
        try {
            return await webApihandler.post(`ir-summary/${emailGuid}?email_address=${emailId}`, {}, {}, {
                serviceName: this.serviceName
            });
        } catch (e: any) {
            return '';
        }
    }

    async markIrEmailAsComplete(emailGuid: string, emailId: string): Promise<any> {
        return await webApihandler.post(`update-ir-status?email_address=${emailId}`, [emailGuid], {}, {
            serviceName: this.serviceName
        });
    }

    async deleteIrEmail(emailGuid: string, emailId: string): Promise<any> {
        return await webApihandler.post(`update-ir-status?email_address=${emailId}`, [emailGuid], {}, {
            serviceName: this.serviceName
        });
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

    async getSubmittedTasks(assigneeEmail: string): Promise<InquiryRequest[]> {
        return await webApihandler
            .get(
                'submitted_tasks', {
                assignee_email: assigneeEmail
            }, {
                serviceName: this.serviceName
            });
    }

    async changeStatus(id: string, status: InquiryStatus): Promise<boolean> {
        await webApihandler.post(
            'change_status', {
            update_task_id: id,
            new_status: status
        }, {}, {
            serviceName: this.serviceName
        });
        return true;
    }

    async getAssignees(): Promise<string[]> {
        // return await webApihandler.get('assignee_emails', {}, {
        //     serviceName: this.serviceName
        // });
        const userListResponse = await userService.getUserList();
        const assignees = userListResponse.map((user: any) => user.email);
        console.log("assignee: ", assignees)
        return assignees;
    }

    async replyEmail(emailAddress: string, id: string, comment: string, pdfIds?: string[]): Promise<any> {
        const formData = new FormData();
        formData.append('email_address', emailAddress);
        formData.append('id', id);
        formData.append('comment', comment);
        if (pdfIds && pdfIds.length > 0) {
            pdfIds.forEach(pdfId => formData.append('pdf_ids', pdfId));
        }

        return await webApihandler.post(
            'reply-email',
            formData,
            undefined,
            { serviceName: this.serviceName }
        );
    }

    async replyAllEmail(emailAddress: string, id: string, comment: string, pdfIds?: string[]): Promise<any> {
        const formData = new FormData();
        formData.append('email_address', emailAddress);
        formData.append('id', id);
        formData.append('comment', comment);
        if (pdfIds && pdfIds.length > 0) {
            pdfIds.forEach(pdfId => formData.append('pdf_ids', pdfId));
        }

        return await webApihandler.post(
            'reply-all-email',
            formData,
            undefined,
            { serviceName: this.serviceName }
        );
    }

    async forwardEmail(emailAddress: string, id: string, toEmail: string): Promise<any> {
        return await webApihandler.post('forward-email',
            undefined,
            {email_address: emailAddress,
             id:id,
             to_email: toEmail
            },
            {
                serviceName: this.serviceName
            });
    }

    async getIrRequestForm() {
        const query = `
    {
      getAddIrTaskStatus {
        add_ir_task
        }
    }`;
        const serviceName = 'hurricane-api-2-0';
        return await webApihandler.post(
            'graphql',
            { query },
            undefined,
            { serviceName }
        );
    }
}

export const investorRelationsService = new InvestorRelationsService();