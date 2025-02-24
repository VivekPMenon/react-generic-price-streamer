import {InquiryRequest} from "@/services/investor-relations-data/model";

export async function getInquiries(): Promise<InquiryRequest[]> {
    return [
        {
            date: '02/19/2025',
            inquiredBy: 'John Smith',
            subject: 'Quarterly Distribution List',
            request: 'If I am not already on your distribution list for your monthly/quarterly updates for your firm can you please make sure to send them to myself, Anna, and the IR email above.',
            statuses: ['Completed', 'Attached 2 items', 'Response'],
            edited: '02/19/2025',
        }
    ];
}