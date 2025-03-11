'use client';

import React from 'react';
import { ToastClose, Root, ToastTitle, ToastDescription, ToastAction, ToastProps } from '@radix-ui/react-toast';
import { Cross1Icon } from '@radix-ui/react-icons';

export interface CustomToastProps {
    altText: string;
    content: string;
}

export function Toast(toastProps: ToastProps & CustomToastProps) {
    return (
        <Root {...toastProps}>
            {toastProps.title && <ToastTitle>{toastProps.title}</ToastTitle>}
            <ToastDescription>{toastProps.content}</ToastDescription>
            {toastProps.children && (
                <ToastAction asChild altText={toastProps.altText}>{toastProps.children}</ToastAction>
            )}
            <ToastClose aria-label="Close" asChild>
                <Cross1Icon />
            </ToastClose>
        </Root>
    );
}