'use client';

import { ReactNode } from "react";
import styles from './image-popup.module.scss';
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.min.css';

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
                        <div className={styles['img-root']}>
                            <InnerImageZoom src={url} imgAttributes={{
                                alt: description ?? ''
                            }}  />
                        </div>
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