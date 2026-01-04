export default async function Page() {
    return (
        <div className="flex w-full flex-col gap-4">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
                Manage organizations, users, and platform settings.
            </p>
        </div>
    );
}
