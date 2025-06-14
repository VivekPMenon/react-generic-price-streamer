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

    async getEmailContentAsHtml(emailGuid: string, emailId: string): Promise<{ html_content: string; cc_addresses?: string[] }> {
        const url = emailId ? `ir-email-html/${emailGuid}?research_email=${emailId}` : `ir-email-html/${emailGuid}`;
        const result = await webApihandler.get(url, {}, { serviceName: this.serviceName });
        return {
            html_content: result.html_content,
            cc_addresses: result.cc_addresses
        };
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
        return assignees;
    }

    async replyEmail(emailAddress: string, to_emails: string, cc_emails: string, id: string, comment: string, attachments?: File[]): Promise<any> {
        const formData = new FormData();
        formData.append('email_address', emailAddress);
        formData.append('to_emails', to_emails)
        formData.append('cc_emails', cc_emails)
        formData.append('id', id);
        formData.append('comment', comment);

        // Add attachments if they exist
        if (attachments && attachments.length > 0) {
            attachments.forEach((file) => {
                formData.append('attachments', file);
            });
        }

        return await webApihandler.post(
            'reply-email',
            formData,
            {
                'Content-Type': 'application/json'
            },
            { serviceName: this.serviceName }
        );
    }

    async replyAllEmail(emailAddress: string, to_emails: string, cc_emails: string, id: string, comment: string, attachments?: File[]): Promise<any> {
        const formData = new FormData();
        formData.append('email_address', emailAddress);
        formData.append('to_emails', to_emails)
        formData.append('cc_emails', cc_emails)
        formData.append('id', id);
        formData.append('comment', comment);

        // Add attachments if they exist
        if (attachments && attachments.length > 0) {
            attachments.forEach((file) => {
                formData.append('attachments', file);
            });
        }

        return await webApihandler.post(
            'reply-all-email',
            formData,
            {
                'Content-Type': 'application/json'
            },
            { serviceName: this.serviceName }
        );
    }

    async forwardEmail(emailAddress: string, to_emails:string, cc_emails:string, id: string): Promise<any> {
        return await webApihandler.post('forward-email',
            undefined,
            {email_address: emailAddress,
             id:id,
             to_emails: to_emails,
             cc_emails: cc_emails
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

     async getEmailThreads(conversation_id: string, emailId: string = ''): Promise<IREmailMessage[]> {
        return await webApihandler
            .get(
                'api/conversation/threads', {
                conversation_id : conversation_id,
                email_address : emailId
            }, {
                serviceName: this.serviceName
            });
    }
}

export const investorRelationsService = new InvestorRelationsService();