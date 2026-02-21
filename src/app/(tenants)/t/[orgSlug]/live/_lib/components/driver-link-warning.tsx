/**
 * Callout shown above the driver link form reminding the user to select their
 * own name. Used on the Me page when the user is signed in but not yet linked.
 */
export function DriverLinkWarning() {
    return (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                You must select your own name from the list below. Selecting
                another driver will result in a broken experience and incorrect
                stats.
            </p>
        </div>
    );
}
