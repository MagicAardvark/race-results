"use client";

import { deleteUser } from "@/app/actions/user.actions";
import { ConfirmationDialog } from "@/app/components/confirmation-dialog";
import { Button } from "@/ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type DeleteUserButtonProps = {
    userId: string;
    userName: string | null;
};

export function DeleteUserButton({ userId, userName }: DeleteUserButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await deleteUser(userId);
            if (result.isError) {
                toast.error(result.message);
            }
            // On success, the action redirects, so no need for a success toast
        });
    };

    return (
        <ConfirmationDialog
            triggerButton={
                <Button variant="destructive" disabled={isPending}>
                    <Trash2 />
                    Delete User
                </Button>
            }
            actionButton={
                <Button
                    onClick={handleDelete}
                    disabled={isPending}
                    variant="destructive"
                >
                    {isPending ? "Deleting..." : "Delete User"}
                </Button>
            }
            title="Delete User"
            content={
                <div>
                    Are you sure you want to delete{" "}
                    <strong>{userName || "this user"}</strong>? This action
                    cannot be undone.
                </div>
            }
        />
    );
}
