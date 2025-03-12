'use client';

import { ReactNode } from 'react';
import { Cross1Icon } from "@radix-ui/react-icons";
import { Rnd } from 'react-rnd';
import * as Dialog from "@radix-ui/react-dialog";
import styles from './image-popup.module.scss';

export interface ImagePopupProps {
    url: string;
    description?: string;
    title?: string;
    children: ReactNode;
}

export function ImagePopup({children, url, title, description}: ImagePopupProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className={styles['dialog']}>
                    <Rnd
                        lockAspectRatio={true}
                        enableResizing={{bottomRight: true}}
                        enableUserSelectHack={true}
                        className={`${styles['dialog-content']}`}
                    >
                        <div className={`${styles['dialog-close']}`}>
                            <Dialog.DialogClose>
                                <Cross1Icon  />
                            </Dialog.DialogClose>
                        </div>
                        <div className={styles['content']}>
                            <Dialog.Title>
                                {title}
                            </Dialog.Title>
                            <img
                                src={url}
                                alt={description ?? ''}
                            />
                            <Dialog.Description className="DialogDescription" asChild={true}>
                                <div className={`${styles['img-description']} scrollable-div height-vh-10`}>
                                    {description}
                                </div>
                            </Dialog.Description>
                        </div>
                    </Rnd>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}