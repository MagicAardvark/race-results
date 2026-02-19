import { Badge } from "@/ui/badge";
import { Spinner } from "@/ui/spinner";

type LoadingProps = {
    loading: boolean;
    message: string;
};

export const Loading = ({ loading, message }: LoadingProps) => {
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out ${loading ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
            <div className="fixed inset-0 z-55 flex items-center justify-center bg-white opacity-80"></div>
            <Badge className="z-60">
                <Spinner data-icon="inline-start" />
                <span>{message}</span>
            </Badge>
        </div>
    );
};
