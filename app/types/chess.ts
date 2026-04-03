export interface StockfishAnalysis {
    success: boolean;
    bestMove: string;
    score: string;
    depth: number;
    pv: string[];
    nps: number;
    fen: string;
}

export interface GameInfo {
    white: string;
    black: string;
    whiteElo: string;
    blackElo: string;
    result: string;
    date: string;
    termination: string;
    site: string;
}

export type MovePair = [string, string];