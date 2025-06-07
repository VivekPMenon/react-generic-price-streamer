import React, { useState } from 'react';
import { useUserContextStore } from '@/services/user-context';
import { investorRelationsService, IREmailMessage } from '@/services/investor-relations-data';
import { userService } from '@/services/user-context/user-service';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

interface EmailActionProps {
    selectedIrEmail: IREmailMessage | null;
}

const EmailAction = ({ selectedIrEmail }: EmailActionProps) => {
    const [activeModal, setActiveModal] = useState<'reply' | 'replyAll' | 'forward' | null>(null);
    const [composeData, setComposeData] = useState({
        to: '',
        cc: '',
        body: ''
    });
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [replyError, setReplyError] = useState<string>('');

    const { userContext } = useUserContextStore();
    const userEmail = userService.getPreviewUserEmail() || userContext?.userId;

    const openModal = (modalType: 'reply' | 'replyAll' | 'forward') => {
        if (selectedIrEmail) {
        setComposeData({
            to: modalType === 'forward' ? '' : selectedIrEmail.sender,
            cc: '',
            body: ''
        });
    }
        setActiveModal(modalType);
        setReplyError('');
    };

    const closeModal = () => {
        setActiveModal(null);
        setComposeData({ to: '', cc: '', body: '' });
        setAttachments([]);
        setReplyError('');
    };

    const handleSendEmail = async () => {
        if (!selectedIrEmail?.id) {
            return;
        }

        if (!composeData.body.trim()) {
            setReplyError('Please enter a message');
            return;
        }

        try {
            setIsLoading(true);
            setReplyError('');

            const attachmentData = await Promise.all(
                attachments.map(async (file) => {
                    const base64 = await toBase64(file);
                    return {
                        filename: file.name,
                        content: base64.split(',')[1],
                    };
                })
            );

            let response;

            switch (activeModal) {
                case 'replyAll':
                    response = await investorRelationsService.replyAllEmail(
                        userEmail!,
                        selectedIrEmail.id,
                        composeData.body,
                    );
                    break;
                case 'forward':
                    response = await investorRelationsService.forwardEmail(
                        selectedIrEmail.sender,
                        selectedIrEmail.id,
                        composeData.to
                    );
                    break;
                case 'reply':
                default:
                    response = await investorRelationsService.replyEmail(
                        userEmail!,
                        selectedIrEmail.id,
                        composeData.body,
                    );
                    break;
            }

            if (response.status === 200) {
                toast.success(response.message || 'Email sent successfully');
            }
            closeModal();
        } catch (error) {
            toast.error('Error sending email');
            console.error('Error sending email:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(Array.from(e.target.files));
        }
    };

    const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    return (
        <div className='widget'>
            <div className='flex items-center justify-start gap-4 p-4 text-lg'>
                <i
                    className="fa-solid fa-share fa-flip-horizontal cursor-pointer"
                    onClick={() => openModal('reply')}
                    data-tooltip-id="action-tooltip"
                    data-tooltip-content="Reply"
                />
                 <i
                    className="fa-solid fa-reply-all cursor-pointer"
                    onClick={() => openModal('replyAll')}
                    data-tooltip-id="action-tooltip"
                    data-tooltip-content="Reply All"
                />
                <i
                    className="fa-solid fa-share cursor-pointer"
                    onClick={() => openModal('forward')}
                    data-tooltip-id="action-tooltip"
                    data-tooltip-content="Forward"
                />
                <i
                    className="fa-solid fa-trash cursor-pointer"
                    data-tooltip-id="action-tooltip"
                    data-tooltip-content="Delete"
                />
            </div>

            {/* Custom Modal */}
            {(activeModal === 'reply' || activeModal === 'replyAll' || activeModal === 'forward') && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col text-white">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <h3 className="text-lg font-semibold text-white">
                                {activeModal === 'reply' && 'Reply'}
                                {activeModal === 'replyAll' && 'Reply All'}
                                {activeModal === 'forward' && 'Forward'}
                            </h3>
                            <button 
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-700 rounded-md"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Compose Form */}
                        <div className="flex-1 flex flex-col">
                            <div className="p-4 space-y-3 border-b border-gray-700">
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-300 w-16">From:</label>
                                    <input
                                        type="email"
                                        value={userEmail}
                                        disabled
                                        className="text-gray-400 bg-transparent border-none outline-none cursor-not-allowed"
                                    />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm font-medium text-gray-300 w-16">To:</label>
                                    <input
                                        type="text"
                                        value={composeData.to}
                                        onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                                        className="flex-1 px-3 py-1 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter email addresses"
                                    />
                                </div>
                                
                                {activeModal === 'replyAll' && (
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-300 w-16">Cc:</label>
                                        <input
                                            type="text"
                                            value={composeData.cc}
                                            onChange={(e) => setComposeData({...composeData, cc: e.target.value})}
                                            className="flex-1 px-3 py-1 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter email addresses"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Message Body */}
                            <div className="flex-1 p-4">
                                <textarea
                                    value={composeData.body}
                                    onChange={(e) => {
                                        setComposeData({...composeData, body: e.target.value});
                                        setReplyError('');
                                    }}
                                    className="w-full h-full resize-none border-0 focus:ring-0 focus:outline-none text-white bg-transparent placeholder-gray-400"
                                    placeholder="Type your message here..."
                                />
                                {replyError && (
                                    <div className="text-red-400 text-sm mt-2">
                                        {replyError}
                                    </div>
                                )}
                            </div>

                            {/* Send Actions */}
                            <div className="p-4 border-t border-gray-700 bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <button 
                                            onClick={handleSendEmail}
                                            disabled={isLoading}
                                            className="button flex items-center gap-2"
                                        >
                                            <i className="fa-solid fa-paper-plane"></i>
                                            {isLoading ? 'Sending...' : 'Send'}
                                        </button>
                                        <button 
                                            onClick={closeModal}
                                            className="secondary-button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Tooltip
                id="action-tooltip"
                place="bottom"
                className="bg-slate-800 text-white px-2 py-1 text-sm rounded"
            />
        </div>
    );
};

export default EmailAction;