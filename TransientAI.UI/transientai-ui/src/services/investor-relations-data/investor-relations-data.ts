import {InquiryFlag, InquiryRequest, InquiryStatus} from "@/services/investor-relations-data/model";

export async function getInquiries(): Promise<InquiryRequest[]> {
    return [
        {
            date: '02/19/2025',
            assignee_name: 'Chris Napoli',
            owner_name: 'Chris Napoli',
            subject: 'Quarterly Distribution List',
            inquiry: 'If I am not already on your distribution list for your monthly/quarterly updates for your firm can you please make sure to send them to myself, Anna, and the IR email above.',
            status: InquiryStatus.Open,
            completed: true,
            flag: InquiryFlag.Regular,
            due_date: '02/19/2025',
            date_edited: '02/19/2025',
        }
    ];
}