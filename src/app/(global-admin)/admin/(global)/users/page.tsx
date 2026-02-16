import { Card, CardContent } from "@/ui/card";
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
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Users</h1>
            <p className="text-muted-foreground text-sm">
                Manage platform users and their global roles. Editing a
                user&apos;s org-level roles (e.g. org owner, manager) is done
                from their profile. Changes to admin access take effect
                immediately.
            </p>
            <Card className="w-full">
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead className="w-0 text-right">
                                    Actions
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
                                    <TableCell className="w-0 whitespace-nowrap text-right">
                                        <div className="flex justify-end">
                                            <LinkButton
                                            variant="outline"
                                                href={`/admin/users/${user.userId}`}
                                            >
                                                <PencilIcon />
                                            </LinkButton>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
