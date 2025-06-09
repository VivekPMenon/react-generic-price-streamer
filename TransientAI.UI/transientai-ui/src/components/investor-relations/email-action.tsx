import React, { useState } from 'react';
import { useUserContextStore } from '@/services/user-context';
import { investorRelationsService, IREmailMessage } from '@/services/investor-relations-data';
import { userService } from '@/services/user-context/user-service';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import { useInvestorRelationsStore } from '@/services/investor-relations-data/investor-relations-store';

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
    const [attachmentError, setAttachmentError] = useState<string>('');

    const { userContext } = useUserContextStore();
    const userEmail = userService.getPreviewUserEmail() || userContext?.userId;
    const {loadEmails} =useInvestorRelationsStore()

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
        setAttachmentError('');
    };

    const closeModal = () => {
        setActiveModal(null);
        setComposeData({ to: '', cc: '', body: '' });
        setAttachments([]);
        setReplyError('');
        setAttachmentError('');
    };

    // Convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data URL prefix (data:type;base64,)
                const base64 = reader.result?.toString().split(',')[1] || '';
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    // Convert files to Microsoft Graph attachment format
    const convertFilesToAttachments = async (files: File[]): Promise<AttachmentData[]> => {
        try {
            const attachments = await Promise.all(
                files.map(async (file) => {
                    const base64Content = await fileToBase64(file);
                    
                    return {
                        "@odata.type": "#microsoft.graph.fileAttachment",
                        name: file.name,
                        contentType: file.type || 'application/octet-stream',
                        contentBytes: base64Content,
                        size: file.size
                    };
                })
            );
            return attachments;
        } catch (error) {
            throw new Error('Failed to convert files to attachments');
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setAttachments(selectedFiles);
            setAttachmentError('');
        }
    };

    const removeAttachment = (index: number) => {
        const newAttachments = attachments.filter((_, i) => i !== index);
        setAttachments(newAttachments);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

            let response;

            switch (activeModal) {
                case 'replyAll':
                    response = await investorRelationsService.replyAllEmail(
                        userEmail!,
                        selectedIrEmail.id,
                        composeData.body,
                        attachments.length > 0 ? attachments : undefined
                    );
                    console.log('ReplyAll Response:', response);
                    if (response?.data?.status === 200) {
                        await investorRelationsService.deleteIrEmail(selectedIrEmail.id, userEmail!);
                    }
                    break;
                case 'forward':
                    response = await investorRelationsService.forwardEmail(
                        userEmail!,
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
                        attachments.length > 0 ? attachments : undefined
                    );
                    console.log('Reply Response:', response);
                    if (response?.data?.status === 200) {
                        await investorRelationsService.deleteIrEmail(selectedIrEmail.id, userEmail!);
                    }
                    break;
            }

            if (response?.data?.status === 200) {
                toast.success(response?.data?.message || 'Email sent successfully');
                await loadEmails()
            }   
            closeModal();
        } catch (error) {
            toast.error('Error sending email');
            console.error('Error sending email:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedIrEmail?.id) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await investorRelationsService.deleteIrEmail(selectedIrEmail.id, userEmail!);
            if (response.status === 200) {
                toast.success('Email deleted successfully');
                // You might want to refresh the email list here
            }
        } catch (error) {
            toast.error('Error deleting email');
            console.error('Error deleting email:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                    onClick={handleDelete}
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
                                        disabled={activeModal !== 'forward'}
                                        className={`text-gray-400 bg-transparent border-none outline-none ${activeModal === 'forward' ? 'cursor-text' : 'cursor-not-allowed'}`}
                                    />
                                </div>

                                {/* Attachments Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <label className="text-sm font-medium text-gray-300 w-16">Attach:</label>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="attachment-input"
                                        />
                                        <label
                                            htmlFor="attachment-input"
                                            className="cursor-pointer flex items-center space-x-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-sm"
                                        >
                                            <i className="fa-solid fa-paperclip"></i>
                                            <span>Choose Files</span>
                                        </label>
                                    </div>

                                    {/* Attachment Error */}
                                    {attachmentError && (
                                        <div className="text-red-400 text-sm ml-16">
                                            {attachmentError}
                                        </div>
                                    )}

                                    {/* Selected Attachments */}
                                    {attachments.length > 0 && (
                                        <div className="ml-16 space-y-1 grid md:grid-cols-3 items-center gap-2 max-h-[20vh] overflow-y-auto scrollable-div">
                                            {attachments.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded-md text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <i className="fa-solid fa-file text-gray-400"></i>
                                                        <div className='grid grid-cols-1'>
                                                            <span className="text-gray-300 truncate">{file.name}</span>
                                                            <span className="text-gray-500">({formatFileSize(file.size)})</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeAttachment(index)}
                                                        className="text-red-400 hover:text-red-300 p-1"
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
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
                                    {attachments.length > 0 && (
                                        <div className="text-sm text-gray-400">
                                            {attachments.length} file{attachments.length > 1 ? 's' : ''} attached
                                        </div>
                                    )}
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