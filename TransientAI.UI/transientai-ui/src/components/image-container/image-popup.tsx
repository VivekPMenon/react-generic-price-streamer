import { ReactNode } from "react";
import styles from './image-popup.module.scss';
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";

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
                    <div className={styles['content']}>
                        <div className={styles['img-root']}>
                            <img src={url} className={styles['img-content']}/>
                        </div>
                    </div>
                    <Dialog.Description className="DialogDescription">
                        {description}
                    </Dialog.Description>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}