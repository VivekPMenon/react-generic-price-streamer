import React, {ReactNode, useState} from "react";
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import styles from './request-form-popup.module.scss';
import {investorRelationsService} from "@/services/investor-relations-data";

export interface RequestPopupProps {
    children: ReactNode;
}

export function RequestFormPopup({children}: RequestPopupProps) {
    const [open, setOpen] = useState(false);
    const [subject, setSubject] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const [inquiry, setInquiry] = useState('');
    const [inquiryError, setInquiryError] = useState('');
    const [assignee, setAssignee] = useState('');
    const [assigneeError, setAssigneeError] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [dueDateError, setDueDateError] = useState('');
    const [flag, setFlag] = useState<string>('regular');
    const [flagError, setFlagError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubjectChange = (event:any) => {
        setSubject(event.target.value);
        setSubjectError('');
    }

    const handleInquiryChange = (event:any) => {
        setInquiry(event.target.value);
        setInquiryError('');
    }

    const handleAssigneeChange = (event:any) => {
        setAssignee(event.target.value);
        setAssigneeError('');
    }

    const handleDueDateChange = (event:any) => {
        setDueDate(event.target.value);
        setDueDateError('');
    }

    const handleFlagChange = (event: any) => {
        setFlag(event.target.value);
        setFlagError('');
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
        if (!assignee) {
            setAssigneeError('Assignee is required');
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

    const handleSubmit = (event:any) => {
        event.preventDefault();
        if (validate()) {
            setIsSaving(true);
            investorRelationsService.submit({
                subject: subject,
                inquiry: inquiry,
                assignee: assignee,
                due_date: dueDate,
                flag: flag,
                date_edited: new Date().toDateString(),
                status: 'open',
                completed: false
            })
                .then(() => resetAndClose())
                .finally(() => setIsSaving(false));
        }
    };

    const handleCancel = (event: any) => {
        resetAndClose();
    }

    const resetAndClose = () => {
        setSubject('');
        setSubjectError('');
        setInquiry('');
        setInquiryError('');
        setAssignee('');
        setAssigneeError('');
        setDueDateError('');
        setFlag('');
        setFlagError('');
        setOpen(false);
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Title />
                <Dialog.Description />
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className={styles['dialog-content']}>
                    <Form.Root className={styles['form-content']}>
                        <div className="space-y-3">
                            <Form.Field name="subject">
                                <Form.Control asChild>
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        value={subject}
                                        onChange={handleSubjectChange}
                                        aria-invalid={!!subjectError}
                                    />
                                </Form.Control>
                                {subjectError && <Form.Message className={styles['error']}>{subjectError}</Form.Message>}
                            </Form.Field>
                            <Form.Field name="inquiry">
                                <Form.Control asChild>
                                    <input
                                        type="text"
                                        placeholder="Inquiry"
                                        value={inquiry}
                                        onChange={handleInquiryChange}
                                        aria-invalid={!!inquiryError}
                                    />
                                </Form.Control>
                                {inquiryError && <Form.Message className={styles['error']}>{inquiryError}</Form.Message>}
                            </Form.Field>
                            <Form.Field name="assignee">
                                <Form.Control asChild>
                                    <input
                                        type="text"
                                        placeholder="Assignee"
                                        value={assignee}
                                        onChange={handleAssigneeChange}
                                    />
                                </Form.Control>
                                {assigneeError && <Form.Message className={styles['error']}>{assigneeError}</Form.Message>}
                            </Form.Field>
                            <Form.Field name="dueDate">
                                <Form.Control asChild>
                                    <input
                                        type="date"
                                        className={styles['date']}
                                        value={dueDate}
                                        onChange={handleDueDateChange}
                                    />
                                </Form.Control>
                                {dueDateError && <Form.Message className={styles['error']}>{dueDateError}</Form.Message>}
                            </Form.Field>
                            <Form.Field name="flag">
                                <div className="flex space-x-2 mt-4">
                                    <Form.Label>Flag</Form.Label>
                                    <Form.Control asChild>
                                        <select defaultValue={'regular'} onSelect={handleFlagChange}>
                                            <option value="regular">Regular</option>
                                            <option value="important">Important</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </Form.Control>
                                </div>
                                {flagError && <Form.Message className={styles['error']}>{flagError}</Form.Message>}
                            </Form.Field>
                        </div>
                        <div className="flex justify-center space-x-2 mt-4">
                            <Form.Submit disabled={isSaving}><button className="button px-4 py-2 rounded-md" type="button" onClick={handleSubmit}>Add Task</button></Form.Submit>
                            <Dialog.Close asChild><button className="secondary-button px-4 py-2 rounded-md" onClick={handleCancel}>Cancel</button></Dialog.Close>
                        </div>
                    </Form.Root>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
