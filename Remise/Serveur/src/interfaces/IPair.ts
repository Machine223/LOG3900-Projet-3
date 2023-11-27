export interface IPair {
    word: string;
    hints: string[];
    difficulty: number;
    delay: number;
    isRandom: boolean;
    drawing: {
        background: string;
        backgroundOpacity: number;
        elements: {
            id: number;
            color: string;
            opacity: number;
            stringokeWidth: number;
            parts: string[];
        }[];
        coordinates: { id: number; parts: string[] }[];
    };
}
