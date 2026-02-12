import { CREATE_NEW_SEASON_VALUE } from "@/app/(global-admin)/admin/(organization)/calendar/_lib";
import { Stack } from "@/app/components/shared/stack";
import { Season } from "@/dto/events/seasons";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/ui/select";
import { Plus } from "lucide-react";

type SelectSeasonProps = {
    seasons: Season[];
    onChange: (seasonSlug: string) => void;
};

export const SelectSeason = ({ seasons, onChange }: SelectSeasonProps) => {
    return (
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
                            {season.name} {season.isCurrent ? "(Current)" : ""}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </Stack>
    );
};
