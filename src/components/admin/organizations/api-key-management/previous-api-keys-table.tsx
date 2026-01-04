import { OrgApiKey } from "@/dto/organizations";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/library/ui/table";
import { API_KEY_PREFIX } from "@/lib/auth/generate-api-key";
import { formatWithDateAndTime } from "@/lib/date-format";
import { mask } from "@/lib/mask";

type PreviousApiKeysTableProps = {
    keys: OrgApiKey[];
};

export const PreviousApiKeysTable = ({ keys }: PreviousApiKeysTableProps) => {
    if (keys.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Previous API Keys</h3>
            <p>API keys below will no longer provide access.</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Key</TableHead>
                        <TableHead>Generated At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {keys.map((key) => (
                        <TableRow key={key.apiKeyId}>
                            <TableCell>
                                {mask(key.apiKey, API_KEY_PREFIX.length, 4)}
                            </TableCell>
                            <TableCell>
                                {formatWithDateAndTime(key.effectiveAt)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
