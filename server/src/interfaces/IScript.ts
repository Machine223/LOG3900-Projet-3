export interface IScript {
    gameStart: string[];
    goodGuess: string[];
    badGuess: string[];
    duringTurn: string[];
}

export interface IPersonalisedScript {
    goodGuess: {
        old: string;
        new: string;
    };
    badGuess: {
        old: string;
        new: string;
    };
}
