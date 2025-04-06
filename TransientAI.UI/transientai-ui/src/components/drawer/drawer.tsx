'use client';

import * as Dialog from "@radix-ui/react-dialog";
import React, {ReactNode, useState} from "react";
import styles from "./drawer.module.scss";

export interface DrawerProps {
    children: ReactNode;
}

const Drawer = ({children}: DrawerProps) => {
    const [open, setOpen] = useState(false);
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.drawerOverlay} />
                <Dialog.Content className={styles.drawerContent}>
                    <Dialog.Title className={styles.drawerTitle}>Drawer</Dialog.Title>
                    hello world
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}

export default Drawer;