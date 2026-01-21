export type TrophyEntry = {
    position: number;
    name: string;
    number: string;
    car: string;
    class: string;
    rawTime: string;
    paxTime: string | null;
};

export type TrophyClassData = {
    className: string;
    classLongName: string;
    entries: TrophyEntry[];
    totalDrivers: number;
    trophyCount: number;
};

export type SpecialAwards = {
    coneKiller: {
        name: string;
        number: string;
        car: string;
        class: string;
        totalCones: number;
    } | null;
    hailMary: {
        name: string;
        number: string;
        car: string;
        class: string;
        fastestRun: number;
        outlierGap: number;
    } | null;
    consistencyKing: {
        name: string;
        number: string;
        car: string;
        class: string;
        variance: number;
        avgTime: number;
    } | null;
    speedDemon: {
        name: string;
        number: string;
        car: string;
        class: string;
        fastestTime: number;
    } | null;
    squeakyClean: Array<{
        name: string;
        number: string;
        car: string;
        class: string;
    }>;
};

export type ViewMode = "trophies" | "awards";

export type SpecialAwardType =
    | "coneKiller"
    | "hailMary"
    | "consistencyKing"
    | "speedDemon"
    | "squeakyClean";
