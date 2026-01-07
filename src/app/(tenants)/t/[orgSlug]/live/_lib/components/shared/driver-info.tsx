type DriverInfoProps = {
    carClass: string;
    number: string | number;
    name: string;
    car: string;
    color: string;
};

export function DriverInfo({
    carClass,
    number,
    name,
    car,
    color,
}: DriverInfoProps) {
    return (
        <div className="col-span-6 flex flex-col justify-center">
            <div className="space-y-0.5">
                <div className="text-foreground text-xs font-semibold">
                    {name}
                </div>
                <div className="text-muted-foreground text-[11px] font-medium">
                    {carClass} #{number}
                </div>
                <div className="text-muted-foreground text-[11px]">{car}</div>
                {color && (
                    <div className="text-muted-foreground text-[11px]">
                        {color}
                    </div>
                )}
            </div>
        </div>
    );
}
