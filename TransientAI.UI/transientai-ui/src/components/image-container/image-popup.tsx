'use client';

import { ReactNode } from "react";
import styles from './image-popup.module.scss';
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
// @ts-expect-error no dt file was provided
import ImageZoom from 'react-image-zooom';

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
                <Dialog.Content className={styles['dialog-content']}>
                    <Dialog.DialogClose>
                        <Cross1Icon />
                    </Dialog.DialogClose>
                    <Dialog.Title>
                        {title}
                    </Dialog.Title>
                    <div className={`${styles['content']}`}>
                        <ImageZoom
                            src={url}
                            alt={description ?? ''}
                            fullWidth={true}
                            className={styles['img-root']}
                            />
                    </div>
                </Dialog.Content>
                <Dialog.Description className="DialogDescription">
                    <div className={`${styles['img-description']} scrollable-div height-vh-10`}>
                        {description}
                    </div>
                </Dialog.Description>
            </Dialog.Portal>
        </Dialog.Root>
    );
}