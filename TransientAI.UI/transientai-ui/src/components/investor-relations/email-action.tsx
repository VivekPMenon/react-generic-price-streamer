import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useUserContextStore } from '@/services/user-context';
import { investorRelationsService, IREmailMessage } from '@/services/investor-relations-data';
import { userService } from '@/services/user-context/user-service';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import { useInvestorRelationsStore } from '@/services/investor-relations-data/investor-relations-store';
import { Button } from '@radix-ui/themes';

interface EmailActionProps {
    selectedIrEmail: IREmailMessage | null;
    contacts?: Recipient[]
}

export interface Recipient {
    name: string;
    email: string;
    type: 'person' | 'group';
    department?: string;
}

const EmailAction = ({ selectedIrEmail,contacts = [] }: EmailActionProps) => {
    const [activeModal, setActiveModal] = useState<'reply' | 'replyAll' | 'forward' | null>(null);
    const [composeData, setComposeData] = useState({
        to: '',
        cc: '',
        body: ''
    });
    
    // New state for recipient management
    const [toRecipients, setToRecipients] = useState<Recipient[]>([]);
    const [ccRecipients, setCcRecipients] = useState<Recipient[]>([]);
    const [toInput, setToInput] = useState('');
    const [ccInput, setCcInput] = useState('');
    const [showToSuggestions, setShowToSuggestions] = useState(false);
    const [showCcSuggestions, setShowCcSuggestions] = useState(false);
    const [showCc, setShowCc] = useState(false);
    
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [replyError, setReplyError] = useState<string>('');
    const [attachmentError, setAttachmentError] = useState<string>('');

    const { userContext } = useUserContextStore();
    const userEmail = userService.getPreviewUserEmail() || userContext?.userId;
    const {loadEmails} = useInvestorRelationsStore();

    const toInputRef = useRef<HTMLInputElement>(null);
    const ccInputRef = useRef<HTMLInputElement>(null);

    // Mock contact directory - you can replace this with your actual contact service
    const Allcontacts: Recipient[] = useMemo(()=>{
        return contacts
    },[contacts])


    const filterContacts = (input: string, existingRecipients: Recipient[]) => {
        if (!input.trim()) return [];
        
        const existing = existingRecipients.map(r => r.email.toLowerCase());
        return Allcontacts.filter(contact => 
            !existing.includes(contact.email.toLowerCase()) &&
            (contact.name.toLowerCase().includes(input.toLowerCase()) ||
             contact.email.toLowerCase().includes(input.toLowerCase()) ||
             contact.department?.toLowerCase().includes(input.toLowerCase()))
        ).slice(0, 6);
    };

    const addRecipient = (contact: Recipient, type: 'to' | 'cc') => {
        if (type === 'to') {
            setToRecipients([...toRecipients, contact]);
            setToInput('');
            setShowToSuggestions(false);
        } else {
            setCcRecipients([...ccRecipients, contact]);
            setCcInput('');
            setShowCcSuggestions(false);
        }
    };

    const removeRecipient = (email: string, type: 'to' | 'cc') => {
        if (type === 'to') {
            setToRecipients(toRecipients.filter(r => r.email !== email));
        } else {
            setCcRecipients(ccRecipients.filter(r => r.email !== email));
        }
    };

    const handleInputChange = (value: string, type: 'to' | 'cc') => {
        if (type === 'to') {
            setToInput(value);
            setShowToSuggestions(value.length > 0);
        } else {
            setCcInput(value);
            setShowCcSuggestions(value.length > 0);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, type: 'to' | 'cc') => {
        if (e.key === 'Backspace' && (type === 'to' ? !toInput : !ccInput)) {
            if (type === 'to' && toRecipients.length > 0) {
                removeRecipient(toRecipients[toRecipients.length - 1].email, 'to');
            } else if (type === 'cc' && ccRecipients.length > 0) {
                removeRecipient(ccRecipients[ccRecipients.length - 1].email, 'cc');
            }
        }
    };

    const RecipientTag = ({ recipient, type }: { recipient: Recipient; type: 'to' | 'cc' }) => (
        <div className="inline-flex items-center bg-[#0b6157] rounded px-2 py-1 mr-1 mb-1 text-sm">
            <div className="flex items-center">
                {recipient.type === 'group' ? (
                    <i className="fa-solid fa-users w-3 h-3 mr-1 text-white" />
                ) : (
                    <i className="fa-solid fa-user w-3 h-3 mr-1 text-white" />
                )}
                <span className="text-blue-100">{recipient.name}</span>
            </div>
            <button
                onClick={() => removeRecipient(recipient.email, type)}
                className="ml-1 text-white hover:text-gray-300"
            >
                <i className="fa-solid fa-xmark w-3 h-3" />
            </button>
        </div>
    );

    const SuggestionItem = ({ contact, onClick }: { contact: Recipient; onClick: () => void }) => (
        <div
            className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-600 last:border-b-0"
            onClick={onClick}
        >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0b6157] text-white text-sm font-medium mr-3">
                {contact.type === 'group' ? (
                    <i className="fa-solid fa-users" />
                ) : (
                    contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-200 truncate">
                    {contact.name}
                </div>
                <div className="text-sm text-gray-400 truncate">
                    {contact.email}
                </div>
            </div>
            <div className="text-xs text-gray-500">
                {contact.department}
            </div>
        </div>
    );

    const openModal = (modalType: 'reply' | 'replyAll' | 'forward') => {
        if (selectedIrEmail) {
            if (modalType === 'forward') {
                setToRecipients([]);
                setToInput('');
            } else {
                // For reply/replyAll, parse sender email and add as recipient
                const senderEmail = selectedIrEmail.sender;
                const senderName = senderEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                setToRecipients([{
                    name: senderName,
                    email: senderEmail,
                    type: 'person'
                }]);
                setToInput('');
            }
            
            setComposeData({
                to: modalType === 'forward' ? '' : selectedIrEmail.sender,
                cc: '',
                body: ''
            });
        }
        setActiveModal(modalType);
        setCcRecipients([]);
        setCcInput('');
        setShowCc(modalType === 'replyAll');
        setReplyError('');
        setAttachmentError('');
    };

    const closeModal = () => {
        setActiveModal(null);
        setComposeData({ to: '', cc: '', body: '' });
        setToRecipients([]);
        setCcRecipients([]);
        setToInput('');
        setCcInput('');
        setShowCc(false);
        setShowToSuggestions(false);
        setShowCcSuggestions(false);
        setAttachments([]);
        setReplyError('');
        setAttachmentError('');
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            // Check file size limit (25MB per file for Graph API)
            const oversizedFiles = selectedFiles.filter(file => file.size > 25 * 1024 * 1024);
            if (oversizedFiles.length > 0) {
                setAttachmentError(`Files too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum size is 25MB per file.`);
                return;
            }

            setAttachments(prev => [...prev, ...selectedFiles]);
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

        // Update composeData with recipients
        const toEmails = toRecipients.map(r => r.email).join(',');
        const ccEmails = ccRecipients.map(r => r.email).join(',');
        
        const updatedComposeData = {
            ...composeData,
            to: toEmails || composeData.to,
            cc: ccEmails
        };

        try {
            setIsLoading(true);
            setReplyError('');

            let response;

            switch (activeModal) {
                case 'replyAll':
                    response = await investorRelationsService.replyAllEmail(
                        userEmail!,
                        updatedComposeData.to,
                        updatedComposeData.cc,
                        selectedIrEmail.id,
                        updatedComposeData.body,
                        attachments.length > 0 ? attachments : undefined
                    );
                    break;
                case 'forward':
                    response = await investorRelationsService.forwardEmail(
                        userEmail!,
                        updatedComposeData.to,
                        updatedComposeData.cc,
                        selectedIrEmail.id
                    );
                    break;
                case 'reply':
                default:
                    response = await investorRelationsService.replyEmail(
                        userEmail!,
                        updatedComposeData.to,
                        updatedComposeData.cc,
                        selectedIrEmail.id,
                        updatedComposeData.body,
                        attachments.length > 0 ? attachments : undefined
                    );
                    break;
            }

            if (response?.status == 200) {
                toast.success(response?.message || 'Email sent successfully');
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

    const toSuggestions = filterContacts(toInput, toRecipients);
    const ccSuggestions = filterContacts(ccInput, [...toRecipients, ...ccRecipients]);

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
                                
                                {/* TO Field with Recipients and Suggestions */}
                                <div className="flex items-start space-x-2">
                                    <label className="text-sm font-medium text-gray-300 w-16 pt-2">To:</label>
                                    <div className="flex-1 relative">
                                        <div className="min-h-[35px] p-2 border border-gray-600 rounded flex flex-wrap items-center focus-within:border-gray-400">
                                            {toRecipients.map((recipient) => (
                                                <RecipientTag key={recipient.email} recipient={recipient} type="to" />
                                            ))}
                                            <input
                                                ref={toInputRef}
                                                type="text"
                                                value={toInput}
                                                onChange={(e) => handleInputChange(e.target.value, 'to')}
                                                onKeyDown={(e) => handleKeyDown(e, 'to')}
                                                className="flex-1 min-w-[200px] outline-none text-sm bg-transparent text-white placeholder-gray-400"
                                                placeholder={toRecipients.length === 0 ? "Enter names or email addresses..." : ""}
                                            />
                                        </div>
                                        
                                        {showToSuggestions && toSuggestions.length > 0 && (
                                            <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                                                <div className="max-h-60 scrollable-div">
                                                    {toSuggestions.map((contact) => (
                                                        <SuggestionItem
                                                            key={contact.email}
                                                            contact={contact}
                                                            onClick={() => addRecipient(contact, 'to')}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        className="text-sm text-blue-400 hover:text-blue-300 underline"
                                        onClick={() => setShowCc(!showCc)}
                                    >
                                        Cc
                                    </button>
                                </div>

                                {/* CC Field */}
                                {showCc && (
                                    <div className="flex items-start space-x-2">
                                        <label className="text-sm font-medium text-gray-300 w-16 pt-2">Cc:</label>
                                        <div className="flex-1 relative">
                                            <div className="min-h-[35px] p-2 border border-gray-600 rounded flex flex-wrap items-center focus-within:border-gray-400">
                                                {ccRecipients.map((recipient) => (
                                                    <RecipientTag key={recipient.email} recipient={recipient} type="cc" />
                                                ))}
                                                <input
                                                    ref={ccInputRef}
                                                    type="text"
                                                    value={ccInput}
                                                    onChange={(e) => handleInputChange(e.target.value, 'cc')}
                                                    onKeyDown={(e) => handleKeyDown(e, 'cc')}
                                                    className="flex-1 min-w-[200px] outline-none text-sm bg-transparent text-white placeholder-gray-400"
                                                    placeholder={ccRecipients.length === 0 ? "Enter names or email addresses..." : ""}
                                                />
                                            </div>
                                            
                                            {showCcSuggestions && ccSuggestions.length > 0 && (
                                                <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
                                                    <div className="max-h-60 scrollable-div">
                                                        {ccSuggestions.map((contact) => (
                                                            <SuggestionItem
                                                                key={contact.email}
                                                                contact={contact}
                                                                onClick={() => addRecipient(contact, 'cc')}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

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
                                        <Button 
                                            onClick={handleSendEmail}
                                            disabled={isLoading}
                                             size="3" color="teal"
                                        >
                                            <i className="fa-solid fa-paper-plane"></i>
                                            {isLoading ? 'Sending...' : 'Send'}
                                        </Button>
                                        <Button 
                                            onClick={closeModal}
                                            size="3" color="gray"
                                        >
                                            Cancel
                                        </Button>
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