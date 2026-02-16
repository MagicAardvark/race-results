import Image from "next/image";
import { cn } from "@/lib/utils";

const INNER_SIZE = "h-[90%] w-[90%]";
const IMAGE_CLASS = "object-contain object-center";

export interface ProfileIconImageProps {
    src: string;
    alt: string;
    /** Outer wrapper; include size (e.g. size-8, size-28 sm:size-32), rounded, overflow, and bg if desired. */
    className?: string;
}

/**
 * Displays an org profile icon at 90% of the container, contained and centered.
 * Use for consistent profile icon display in sidebar, cards, tenant header, and upload preview.
 */
export function ProfileIconImage({
    src,
    alt,
    className,
}: ProfileIconImageProps) {
    return (
        <span
            className={cn(
                "relative flex shrink-0 items-center justify-center overflow-hidden",
                className
            )}
        >
            <span className={cn("relative", INNER_SIZE)}>
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className={IMAGE_CLASS}
                    unoptimized
                />
            </span>
        </span>
    );
}
