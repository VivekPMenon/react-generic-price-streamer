import React, { ReactNode, useEffect, useState } from "react";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { TextArea } from "@radix-ui/themes";
import styles from './request-form-popup.module.scss';
import { useInvestorRelationsStore } from "@/services/investor-relations-data/investor-relations-store";
import { InquiryFlag, InquiryStatus } from "@/services/investor-relations-data/model";
import { enumToKeyValuePair } from "@/lib/utility-functions/enum-operations";

export interface RequestPopupProps {
    open?: boolean;
    children?: ReactNode;
    onSubmitted?: (message: string) => void;
    onClose?: () => void;
    isReadOnly?: boolean;
    subject?: string;
    inquiry?: string;
    dueDate?: string;
    flag?: InquiryFlag;
    assignee?: string;
}

const Flags = enumToKeyValuePair(InquiryFlag);

const AssignTo: string = 'Assign to';

export function RequestFormPopup(props: RequestPopupProps) {
    const [subject, setSubject] = useState(props.subject || '');
    const [subjectError, setSubjectError] = useState('');
    const [inquiry, setInquiry] = useState(props.inquiry || '');
    const [inquiryError, setInquiryError] = useState('');
    const [dueDate, setDueDate] = useState(props.dueDate || '');
    const [dueDateError, setDueDateError] = useState('');
    const [flag, setFlag] = useState<InquiryFlag>(props.flag || InquiryFlag.Regular);
    const [flagError, setFlagError] = useState('');
    const [assignee, setAssignee] = useState<string>(props.assignee || '');
    const [assigneeError, setAssigneeError] = useState('');

    const {isSaving, save, assignees} = useInvestorRelationsStore();
    
    const [selectableAssignees, setSelectableAssignees] = useState<string[]>([]);

    const handleSubjectChange = (event: any) => {
        setSubject(event.target.value);
        setSubjectError('');
    }

    const handleInquiryChange = (event: any) => {
        setInquiry(event.target.value);
        setInquiryError('');
    }

    const handleDueDateChange = (event: any) => {
        setDueDate(event.target.value);
        setDueDateError('');
    }

    const handleFlagChange = (event: any) => {
        setFlag(event.target.value);
        setFlagError('');
    }

    const handleAssigneeChange = (event: any) => {
        const selectedValue = event.target.value;
        setAssignee(selectedValue);
        setAssigneeError(selectedValue === AssignTo ? 'Assign to is required' : '');
    }

    const validate = () => {
        if (!subject) {
            setSubjectError('Subject is required');
            return false;
        }
        if (!inquiry) {
            setInquiryError('Inquiry is required');
            return false;
        }
        if (!assignee || assignee === AssignTo) {
            setAssigneeError('Assign to is required');
            return false;
        }
        if (!dueDate) {
            setDueDateError('Due date is required');
            return false;
        }
        if (!flag) {
            setFlagError('Flag is required');
            return false;
        }
        return true;
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (validate()) {
            save({
                subject: subject,
                inquiry: inquiry,
                due_date: new Date(dueDate).toISOString(),
                flag: flag,
                assignee_name: assignee,
                date_edited: new Date().toISOString(),
                status: InquiryStatus.Open,
                completed: false
            })
                .then(() => {
                    resetAndClose();
                    if (props.onSubmitted) {
                        props.onSubmitted('Saved successfully');
                    }
                });
        }
    };

    const handleCancel = () => {
        resetAndClose();
    }

    const resetAndClose = () => {
        props.onClose!();
        setSubject('');
        setSubjectError('');
        setInquiry('');
        setInquiryError('');
        setDueDate('');
        setDueDateError('');
        setFlag(InquiryFlag.Regular);
        setFlagError('');
        setAssignee('');
        setAssigneeError('')
    }

    useEffect(() => {
        setSelectableAssignees(['Assign to', ...assignees])
    }, [assignees]);

    return (
        <Dialog.Root open={true}>
            {/* <Dialog.Trigger >
                {props.children}
            </Dialog.Trigger> */}
            <Dialog.Portal>
                <Dialog.Title />
                <Dialog.Description />
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content
                    className={styles['dialog-content']}
                    onPointerDownOutside={(e: any) => e.preventDefault()}
                >
                    <Form.Root className={styles['form-content']}>
                        <div className="space-y-3">
                            <Form.Field name="subject">
                                <div className="flex space-x-2 mt-4">
                                    <Form.Control asChild>
                                        <input
                                            disabled={isSaving || props?.isReadOnly}
                                            type="text"
                                            placeholder='Subject'
                                            required={true}
                                            value={subject}
                                            onChange={handleSubjectChange}
                                            aria-invalid={!!subjectError}
                                        />
                                    </Form.Control>
                                </div>
                                {subjectError && <Form.Message className={styles['error']}>{subjectError}</Form.Message>}
                            </Form.Field>
                            <Form.Field name="inquiry">
                                <div className="flex space-x-2 mt-4">
                                    <Form.Control asChild>
                                        <TextArea
                                            disabled={isSaving || props?.isReadOnly}
                                            placeholder='Inquiry'
                                            required={true}
                                            value={inquiry}
                                            onChange={handleInquiryChange}
                                            className={`w-full rounded-md h-32 `}
                                            aria-invalid={!!inquiryError}
                                        />
                                    </Form.Control>
                                </div>
                                {inquiryError && <Form.Message className={styles['error']}>{inquiryError}</Form.Message>}
                            </Form.Field>
                            <Form.Field name="assignee">
                                <div className="flex mt-4" style={{ flexDirection: 'column' }}>
                                    <Form.Label>Assign To</Form.Label>

                                    <select
                                        name="assignee-ddl"
                                        value={assignee}
                                        disabled={isSaving || props?.isReadOnly}
                                        onChange={(event) => handleAssigneeChange(event)}
                                        required={true}
                                        className={`${styles['assignees']} rounded-md `}
                                        style={{ display: 'flex', flex: '1 1 50%' }}>
                                        {
                                            selectableAssignees.map(assignee => (
                                                <option key={assignee} value={assignee}>{assignee}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                {assigneeError && <Form.Message className={styles['error']}>{assigneeError}</Form.Message>}
                            </Form.Field>
                            <Form.Field name="dueDate">
                                <div className="flex mt-4" style={{ flexDirection: 'column' }}>
                                    <Form.Label>Due</Form.Label>
                                    <Form.Control asChild>
                                        <input
                                            disabled={isSaving || props?.isReadOnly}
                                            type="date"
                                            required={true}
                                            value={dueDate}
                                            className={`${styles['date']} rounded-md `}
                                            onChange={handleDueDateChange}
                                        />
                                    </Form.Control>
                                </div>
                                {dueDateError && <Form.Message className={styles['error']}>{dueDateError}</Form.Message>}
                            </Form.Field>
                            <Form.Field name="flag">
                                <div className="flex mt-4" style={{ flexDirection: 'column' }}>
                                    <Form.Label>Flag</Form.Label>

                                    <select
                                        name="flag-ddl"
                                        value={flag}
                                        disabled={isSaving || props?.isReadOnly}
                                        required={true}
                                        onChange={handleFlagChange}
                                        style={{ display: 'flex', flex: '1 1 50%', maxHeight: '150px', overflowY: 'auto' }}>
                                        {
                                            Flags.map(flag => (
                                                <option key={flag.value} value={flag.value}>{flag.key}</option>)
                                            )
                                        }
                                    </select>
                                </div>
                                {flagError && <Form.Message className={styles['error']}>{flagError}</Form.Message>}
                            </Form.Field>
                        </div>

                        <div className="flex justify-center space-x-2 mt-4">
                            {
                                <Form.Submit
                                    disabled={isSaving || props?.isReadOnly}
                                    className='button px-4 py-2 rounded-md'
                                    onClick={handleSubmit}
                                >Add Task</Form.Submit>
                            }

                            <button disabled={isSaving}
                                className="secondary-button px-4 py-2 rounded-md" onClick={() => {
                                    handleCancel();
                                }}>Cancel</button>
                        </div>
                    </Form.Root>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
