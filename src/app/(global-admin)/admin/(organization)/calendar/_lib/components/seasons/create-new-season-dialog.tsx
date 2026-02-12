import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/dialog";
import { CreateNewSeasonForm } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/seasons/create-new-season-form";
import { useState } from "react";
import { Season } from "@/dto/events/seasons";
import { Button } from "@/ui/button-wrapper";
import { Plus } from "lucide-react";

type CreateNewSeasonDialogProps = {
    orgId: string;
    onChange: (seasonSlug: string) => void;
};

export const CreateNewSeasonDialog = ({
    orgId,
    onChange,
}: CreateNewSeasonDialogProps) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
            }}
        >
            <DialogTrigger asChild>
                <Button>
                    <Plus /> Create New Season
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Season</DialogTitle>
                    <DialogDescription>
                        Create a new season to organize your events.
                    </DialogDescription>
                </DialogHeader>
                <CreateNewSeasonForm
                    orgId={orgId}
                    onCreate={(season: Season) => {
                        setOpen(false);
                        onChange(season.slug);
                    }}
                    onCancel={() => {
                        setOpen(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};
