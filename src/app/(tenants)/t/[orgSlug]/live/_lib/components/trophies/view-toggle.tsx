import { Button } from "@/ui/button";
import { Trophy, Award } from "lucide-react";
import type { ViewMode } from "./types";

type ViewToggleProps = {
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
};

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
    return (
        <div className="flex justify-center">
            <div className="inline-flex rounded-lg border p-1">
                <Button
                    variant={viewMode === "trophies" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewModeChange("trophies")}
                >
                    <Trophy className="mr-2 h-4 w-4" />
                    Class Trophies
                </Button>
                <Button
                    variant={viewMode === "awards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onViewModeChange("awards")}
                >
                    <Award className="mr-2 h-4 w-4" />
                    Shoutouts
                </Button>
            </div>
        </div>
    );
}
