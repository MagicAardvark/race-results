"use client";

import { Button } from "@/ui/button";

type FilterButtonsProps = {
    items: string[];
    selectedItems: string[];
    onToggle: (item: string) => void;
    onClear?: () => void;
    showClear?: boolean;
    className?: string;
};

/**
 * Reusable component for rendering filter buttons
 * Used for class filters and work/run filters
 */
export function FilterButtons({
    items,
    selectedItems,
    onToggle,
    onClear,
    showClear = false,
    className = "mt-2 flex flex-wrap items-center gap-2",
}: FilterButtonsProps) {
    const noSelected = selectedItems.length === 0;

    return (
        <div className={className}>
            {items.map((item) => {
                const isSelected = selectedItems.includes(item);
                return (
                    <Button
                        key={item}
                        variant={isSelected || noSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToggle(item)}
                    >
                        {item}
                    </Button>
                );
            })}
            {showClear && !noSelected && onClear && (
                <Button variant="destructive" size="sm" onClick={onClear}>
                    Clear
                </Button>
            )}
        </div>
    );
}

