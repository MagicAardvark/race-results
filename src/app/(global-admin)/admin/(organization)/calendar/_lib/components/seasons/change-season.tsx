import { createSeason } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/actions/seasons/create-season";
import { createSeasonSchema } from "@/app/(global-admin)/admin/(organization)/calendar/_lib/schema/seasons";
import {
    DefaultFormActions,
    Form,
    FormError,
    FormInput,
} from "@/app/components/forms/form";
import { FormDatePicker } from "@/app/components/forms/form-date-picker";
import { Stack } from "@/app/components/shared/stack";
import { Season } from "@/dto/events/seasons";
import { FormResponse } from "@/types/forms";
import { Button } from "@/ui/button-wrapper";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/ui/dialog";
import { FieldGroup } from "@/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const CREATE_NEW_SEASON_VALUE = "{create_new}";

const SelectSeason = ({
    seasons,
    onChange,
}: {
    seasons: Season[];
    onChange: (seasonSlug: string) => void;
}) => {
    return (
        <>
            <DialogHeader>
                <DialogTitle>Change Season</DialogTitle>
            </DialogHeader>
            <Stack>
                <Select onValueChange={onChange}>
                    <SelectTrigger>
                        <SelectValue placeholder={"Select Season"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            value={CREATE_NEW_SEASON_VALUE}
                            className="font-bold text-green-700"
                        >
                            <Plus /> Create New Season
                        </SelectItem>
                        {seasons.map((season) => (
                            <SelectItem key={season.slug} value={season.slug}>
                                {season.name}{" "}
                                {season.isCurrent ? "(Current)" : ""}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Stack>
        </>
    );
};

const CreateNewSeason = ({
    orgId,
    onCreate,
    onCancel,
}: {
    orgId: string;
    onCreate: (season: Season) => void;
    onCancel: () => void;
}) => {
    const form = useForm<z.infer<typeof createSeasonSchema>>({
        // @hookform/resolvers v5.2.2 types don't fully support Zod v4 yet, but runtime works correctly
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(createSeasonSchema as any),
        defaultValues: {
            name: "",
            startAt: undefined,
            endAt: undefined,
        },
    });

    const [error, setError] = useState<FormResponse<Season> | null>(null);

    const onSubmit = async (data: z.infer<typeof createSeasonSchema>) => {
        const result = await createSeason(orgId, data);

        if (result.isError || !result.data) {
            setError(result);
            return;
        }

        toast.success(result.message);

        onCreate(result.data);
    };

    return (
        <div>
            <Form onSubmit={form.handleSubmit(onSubmit)}>
                <Stack>
                    <DialogHeader>
                        <DialogTitle>Create New Season</DialogTitle>
                        <DialogDescription asChild>
                            <p>
                                Please fill out the details for the new season.
                            </p>
                        </DialogDescription>
                    </DialogHeader>

                    {error?.isError && (
                        <FormError
                            isError={error.isError}
                            messages={error.errors}
                        />
                    )}

                    <FieldGroup>
                        <FormInput form={form} name="name" label="Name" />

                        <Stack orientation="horizontal">
                            <FormDatePicker
                                form={form}
                                name="startAt"
                                label="Start Date"
                            />
                            <FormDatePicker
                                form={form}
                                name="endAt"
                                label="End Date"
                            />
                        </Stack>
                    </FieldGroup>

                    <DefaultFormActions
                        onCancel={() => onCancel()}
                        onSubmitDisabled={form.formState.isSubmitting}
                        onSubmitText={
                            form.formState.isSubmitting ? "Saving…" : "Save"
                        }
                    />
                </Stack>
            </Form>
        </div>
    );
};

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
                {!createNewSeasonMode && (
                    <SelectSeason
                        seasons={seasons}
                        onChange={handleSeasonChange}
                    />
                )}
                {createNewSeasonMode && (
                    <CreateNewSeason
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
