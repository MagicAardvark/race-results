import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
} from "@/ui/empty";
import { LinkButton } from "@/ui/link-button";
import { TriangleAlert } from "lucide-react";

interface NothingToShowProps {
    icon?: React.ReactNode;
    title?: string;
    description: string;
    href: string;
    linkText?: string;
}

export const NothingToShow = ({
    icon = <TriangleAlert />,
    title = "Nothing to Show",
    description,
    href,
    linkText = "Go Back",
}: NothingToShowProps) => {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">{icon}</EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <LinkButton href={href}>{linkText}</LinkButton>
            </EmptyContent>
        </Empty>
    );
};
