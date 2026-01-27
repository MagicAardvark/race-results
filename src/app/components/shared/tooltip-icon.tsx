import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";

interface TooltipIconProps {
    icon: React.ReactNode;
    text: string;
}

export const TooltipIcon = ({ icon, text }: TooltipIconProps) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{icon}</TooltipTrigger>
            <TooltipContent>
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    );
};
