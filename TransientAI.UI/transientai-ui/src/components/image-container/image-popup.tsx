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
                <Dialog.Content>
                    <Rnd
                        lockAspectRatio={true}
                        enableResizing={true}
                        disableDragging={true}
                        className={`${styles['dialog']}`}
                    >
                        <div className={styles['dialog-close']}>
                            <Dialog.DialogClose>
                                <Cross1Icon  />
                            </Dialog.DialogClose>
                        </div>
                        <div className={`${styles['dialog-content']} `}>
                            <Dialog.Title className={`DialogTitle ${styles['dialog-title']} `} >
                                {title ?? ''}
                            </Dialog.Title>
                            <img
                                src={url}
                                alt={url ?? ''}
                            />
                            <Dialog.Description asChild={true}>
                                <div className={`${styles['img-description']} scrollable-div`}>
                                    {description ?? ''}
                                </div>
                            </Dialog.Description>
                        </div>
                    </Rnd>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}