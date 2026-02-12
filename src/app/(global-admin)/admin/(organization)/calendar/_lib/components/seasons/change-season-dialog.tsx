import { CREATE_NEW_SEASON_VALUE } from "@/app/(global-admin)/admin/(organization)/calendar/_lib";
import { CreateNewSeasonForm } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/seasons/create-new-season-form";
import { SelectSeason } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/components/seasons/select-season";
import { Season } from "@/dto/events/seasons";
import { Button } from "@/ui/button-wrapper";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface SeasonSelectProps {
    orgId: string;
    seasons: Season[];
    onChange: (seasonSlug: string) => void;
}

export const ChangeSeasonDialog = ({
    orgId,
    seasons,
    onChange,
}: SeasonSelectProps) => {
    const [open, setOpen] = useState(false);
    const [createNewSeasonMode, setCreateNewSeasonMode] = useState(false);

    const handleSeasonChange = (value: string) => {
        if (value === CREATE_NEW_SEASON_VALUE) {
            setCreateNewSeasonMode(true);
            return;
        }

        setOpen(false);
        onChange(value);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
            }}
        >
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Change Season">
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {createNewSeasonMode
                            ? "Create New Season"
                            : "Change Season"}
                    </DialogTitle>
                    <DialogDescription>
                        {createNewSeasonMode
                            ? "Create a new season to organize your events into. You can have multiple active seasons at the same time."
                            : "Select a different season to view its events."}
                    </DialogDescription>
                </DialogHeader>
                {!createNewSeasonMode && (
                    <SelectSeason
                        seasons={seasons}
                        onChange={handleSeasonChange}
                    />
                )}
                {createNewSeasonMode && (
                    <CreateNewSeasonForm
                        orgId={orgId}
                        onCreate={(season: Season) => {
                            setCreateNewSeasonMode(false);
                            setOpen(false);
                            onChange(season.slug);
                        }}
                        onCancel={() => {
                            setCreateNewSeasonMode(false);
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
