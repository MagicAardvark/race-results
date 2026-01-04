const dateAndTimeFormatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
});

export function formatWithDateAndTime(date: Date): string {
    return dateAndTimeFormatter.format(date);
}
