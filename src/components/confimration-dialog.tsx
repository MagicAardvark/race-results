import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/library/ui/alert-dialog";
import React from "react";

type ConfirmationDialogProps = {
    triggerButton: React.ReactNode;
    actionButton: React.ReactNode;
    cancelText?: string;
    title: string;
    content: string | React.ReactNode;
};

export const ConfirmationDialog = ({
    triggerButton,
    actionButton,
    cancelText,
    title,
    content,
}: ConfirmationDialogProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>{content}</AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel variant="outline">
                        {cancelText ?? "Cancel"}
                    </AlertDialogCancel>
                    <AlertDialogAction asChild variant={"destructive"}>
                        {actionButton}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
