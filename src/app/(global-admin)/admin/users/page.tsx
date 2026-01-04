import { LinkButton } from "@/ui/link-button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/ui/table";
import { userService } from "@/services/users/user.service";
import { PencilIcon } from "lucide-react";

export default async function Page() {
    const users = await userService.getAllUsers();

    return (
        <div className="flex w-full flex-col gap-4">
            <h1 className="text-2xl font-semibold">Users</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.userId}>
                            <TableCell>{user.displayName}</TableCell>
                            <TableCell>
                                {user.roles.map((r) => r).join(", ")}
                            </TableCell>
                            <TableCell className="flex justify-end">
                                <LinkButton
                                    variant={"outline"}
                                    href={`/admin/users/${user.userId}`}
                                >
                                    <PencilIcon />
                                </LinkButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
