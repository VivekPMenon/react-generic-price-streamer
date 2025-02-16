import { ReactNode } from "react";
import styles from './image-popup.module.scss';
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";

export interface ImagePopupProps {
    image: string;
    description?: string;
    title?: string;
    children: ReactNode;
}

export function ImagePopup({children, image, title, description}: ImagePopupProps) {
    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContentSmall">
                    <Dialog.DialogClose>
                        <Cross1Icon />
                    </Dialog.DialogClose>
                    <Dialog.Title>
                        {title}
                    </Dialog.Title>
                    <div className={styles['content']}>
                        <div style={{ padding: '20px 50px' }}>
                            <img src={image} style={{height: '350px', width: '650px'}}/>
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