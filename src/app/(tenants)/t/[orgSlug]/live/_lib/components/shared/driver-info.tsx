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
                <div className="text-xs font-semibold text-foreground">
                    {name}
                </div>
                <div className="text-[11px] text-muted-foreground font-medium">
                    {carClass} #{number}
                </div>
                <div className="text-[11px] text-muted-foreground">
                    {car}
                </div>
                {color && (
                    <div className="text-[11px] text-muted-foreground">
                        {color}
                    </div>
                )}
            </div>
        </div>
    );
}

