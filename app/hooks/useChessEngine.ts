import { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';
import { analyzeBatchFens } from '../utils/chessEngine';
import { GameInfo, MovePair } from '../types/chess';

export function getGameInfo(rawPgn: string): GameInfo {
    if (!rawPgn) {
        return {
            white: "White", black: "Black",
            whiteElo: "?", blackElo: "?",
            result: "*", date: "", termination: "", site: ""
        };
    }

    const chess = new Chess();
    try {
        chess.loadPgn(rawPgn);
        const info = chess.header();

        return {
            white: info.White || "White",
            black: info.Black || "Black",
            whiteElo: info.WhiteElo || "?",
            blackElo: info.BlackElo || "?",
            result: info.Result || "*",
            date: info.Date || "",
            termination: info.Termination || "",
            site: info.Site || ""
        };
    } catch (e) {
        console.warn("Error parsing Game Info:", e);
        return {
            white: "White", black: "Black",
            whiteElo: "?", blackElo: "?",
            result: "*", date: "", termination: "", site: ""
        };
    }
}

export function getMovesArray(rawPgn: string): MovePair[] {
    if (!rawPgn) return [];

    const chess = new Chess();
    try {
        chess.loadPgn(rawPgn);
        const moves = chess.history();

        const paired: MovePair[] = [];
        for (let i = 0; i < moves.length; i += 2) {
            paired.push([moves[i], moves[i + 1] || ""]);
        }

        return paired;
    } catch (e: any) {
        console.error("PGN Error:", e.message);
        return [];
    }
}

export function useChessEngine() {
    const [rawPgn, setRawPgn] = useState("");
    const [analysisData, setAnalysisData] = useState<string[][]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const engine = useRef<Worker | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            engine.current = new Worker("/stockfish.js");
            engine.current.postMessage("uci");
            engine.current.postMessage("isready");
        }

        return () => {
            if (engine.current) {
                engine.current.terminate();
                engine.current = null;
            }
        };
    }, []);

    const reviewFen = async (worker: Worker, pgn: string): Promise<string[][]> => {
        const chess = new Chess();

        const movesText = pgn
            .replace(/\[.*?\]/g, '')
            .replace(/\{.*?\}/g, '')
            .replace(/\(.*? \)/g, '')
            .replace(/\n/g, ' ')
            .trim();

        const rawMoves = movesText.split(/\s+/);
        const cleanMoves = rawMoves.filter((m: string) =>
            m &&
            !m.includes('.') &&
            !['1-0', '0-1', '1/2-1/2', '*'].includes(m)
        );

        chess.reset();
        const fens: string[] = [chess.fen()];

        for (const move of cleanMoves) {
            try {
                const result = chess.move(move);
                if (result) {
                    fens.push(chess.fen());
                }
            } catch (e) {
                console.warn(`Skip invalid move: ${move}`);
            }
        }

        if (fens.length <= 1) {
            throw new Error("No valid moves found in the text.");
        }

        const fullAnalysis = await analyzeBatchFens(worker, fens);

        return fullAnalysis;
    };

    const startReview = useCallback(async (input: string) => {
        if (!input.trim()) {
            setError("Please enter a valid PGN.");
            return;
        }

        setError(null);
        setRawPgn(input);

        if (engine.current) {
            setIsAnalyzing(true);
            try {
                const results = await reviewFen(engine.current, input);
                setAnalysisData(results);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "An error occurred during analysis.");
                setAnalysisData([]);
            } finally {
                setIsAnalyzing(false);
            }
        } else {
            console.warn("Stockfish engine is not active.");
            setError("Engine not loaded, please refresh the page.");
        }
    }, []);

    const gameInfo = getGameInfo(rawPgn);
    const movesArray = getMovesArray(rawPgn);

    return {
        rawPgn,
        analysisData,
        isAnalyzing,
        error,
        gameInfo,
        movesArray,
        startReview
    };
}
