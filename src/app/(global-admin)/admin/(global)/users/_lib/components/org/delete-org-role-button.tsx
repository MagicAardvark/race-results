"use client";

import { negateUserOrganizationRole } from "@/app/actions/user.actions";
import { ConfirmationDialog } from "@/app/components/confirmation-dialog";
import { Button } from "@/ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type DeleteOrgRoleButtonProps = {
    userId: string;
    orgId: string;
    orgName: string;
    roleId: string;
    roleName: string;
};

export function DeleteOrgRoleButton({
    userId,
    orgId,
    orgName,
    roleId,
    roleName,
}: DeleteOrgRoleButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        startTransition(async () => {
            const result = await negateUserOrganizationRole(
                userId,
                orgId,
                roleId
            );
            if (result.isError) {
                toast.error(result.message);
            }
        });
    };

    return (
        <ConfirmationDialog
            triggerButton={
                <Button variant="destructive" disabled={isPending}>
                    <Trash2 />
                </Button>
            }
            actionButton={
                <Button
                    onClick={handleDelete}
                    disabled={isPending}
                    variant="destructive"
                >
                    {isPending ? "Deleting..." : "Delete Role"}
                </Button>
            }
            title="Remove Role from Organization"
            content={
                <>
                    Are you sure you want to delete the role{" "}
                    <strong>{roleName}</strong> from organization{" "}
                    <strong>{orgName}</strong>?
                </>
            }
        />
    );
}
