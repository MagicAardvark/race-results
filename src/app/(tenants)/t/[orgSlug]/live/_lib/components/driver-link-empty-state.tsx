/**
 * Shown when there are no event drivers available for the driver link flow.
 * Used on the Me page when the user is signed in but not linked and the
 * event has no results yet.
 */
export function DriverLinkEmptyState() {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground">
                No drivers in this event yet. Check back when results are
                available.
            </p>
        </div>
    );
}
