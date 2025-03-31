import {ReactNode, useState} from "react";
import {File} from "@/services/file-manager";
import * as Dialog from "@radix-ui/react-dialog";
import * as Form from '@radix-ui/react-form';
import { TextArea } from "@radix-ui/themes";
import styles from './email-form-popup.module.scss';

export interface EmailPopupProps {
    file: File;
    sendEmail: (file: File, to: string, subject?: string, body?: string) => void;
    children: ReactNode;
}

export function EmailFormPopup({children, file, sendEmail}: EmailPopupProps) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleEmailChange = (event:any) => {
        setEmail(event.target.value);
        setEmailError('');
    };

    const handleBodyChange = (event:any) => {
        setBody(event.target.value);
    }

    const handleSubjectChange = (event:any) => {
        setSubject(event.target.value);
    }

    const validateEmail = () => {
        if (!email) {
            setEmailError('Email is required');
            return false;
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            setEmailError('Invalid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = (event:any) => {
        event.preventDefault();
        if (validateEmail()) {
            sendEmail(file, email, subject, body);
            resetAndClose();
        }
    };

    const handleCancel = (event:any) => {
        resetAndClose();
    }

    const resetAndClose = () => {
        setEmail('');
        setSubject('');
        setBody('');
        setEmailError('');
        setOpen(false);
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Description />
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content
                    className={styles['dialog-content']}
                    onPointerDownOutside={(e: any) => e.preventDefault()}
                >
                    <Form.Root className={styles['form-content']}>
                        <div className="space-y-3">
                            <Form.Field name="email">
                                <Form.Control asChild>
                                    <input
                                        type="text"
                                        placeholder="To"
                                        value={email}
                                        onChange={handleEmailChange}
                                        aria-invalid={!!emailError}
                                    />
                                </Form.Control>
                                {emailError && <Form.Message className={styles['error']}>{emailError}</Form.Message>}
                            </Form.Field>
                            <Form.Field name="subject">
                                <Form.Control asChild>
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        value={subject}
                                        onChange={handleSubjectChange}
                                    />
                                </Form.Control>
                            </Form.Field>
                            <Form.Field name="message">
                                <Form.Control asChild>
                                    <TextArea
                                        placeholder="Message"
                                        value={body}
                                        onChange={handleBodyChange}
                                        className={`w-full rounded-md h-32`}
                                    />
                                </Form.Control>
                            </Form.Field>
                        </div>
                        <div>
                            <Dialog.Title>
                                {`File: ${file.filename}`}
                            </Dialog.Title>
                        </div>
                        <div className="flex justify-center space-x-2 mt-4">
                            <Form.Submit><button className="button px-4 py-2 rounded-md" type="button" onClick={handleSubmit}>Send</button></Form.Submit>
                            <Dialog.Close asChild><button className="secondary-button px-4 py-2 rounded-md" onClick={handleCancel}>Cancel</button></Dialog.Close>
                        </div>
                    </Form.Root>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
