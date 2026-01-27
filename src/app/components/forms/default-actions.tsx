import { FormActions } from "@/app/components/forms/form-actions";
import { Button } from "@/ui/button";
import { LinkButton } from "@/ui/link-button";

interface DefaultFormActionsProps {
    onCancel: (() => void) | string;
    onSubmit?: () => void;
    onSubmitDisabled?: boolean;
    onSubmitText?: string;
}

export function DefaultFormActions({
    onCancel,
    onSubmit,
    onSubmitDisabled = false,
    onSubmitText = "Submit",
}: DefaultFormActionsProps) {
    const cancelButton =
        typeof onCancel === "function" ? (
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
            </Button>
        ) : (
            <LinkButton variant={"outline"} href={onCancel}>
                Cancel
            </LinkButton>
        );

    return (
        <FormActions align="left">
            {cancelButton}
            <Button
                type="submit"
                disabled={onSubmitDisabled}
                onClick={onSubmit}
            >
                {onSubmitText}
            </Button>
        </FormActions>
    );
}
