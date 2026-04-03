import { StockfishAnalysis } from "../types/chess";

export const analyzePosition = (
    worker: Worker,
    fen: string,
    depth: number = 20
): Promise<StockfishAnalysis> => {
    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            worker.removeEventListener("message", onMessage);
            resolve({ success: false, bestMove: "timeout", score: "0.00", depth: 0, pv: [], nps: 0, fen });
        }, 1000);

        worker.postMessage("stop");
        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go depth ${depth}`);

        let analysis: StockfishAnalysis = {
            success: false, bestMove: "", score: "0.00", depth: 0, pv: [], nps: 0, fen
        };

        function onMessage(e: MessageEvent) {
            const line: string = e.data;

            if (line.startsWith("info depth")) {
                const cpMatch = line.match(/score cp (-?\d+)/);
                const mateMatch = line.match(/score mate (-?\d+)/);
                if (cpMatch) analysis.score = (parseInt(cpMatch[1]) / 100).toFixed(2);
                else if (mateMatch) analysis.score = `M${mateMatch[1]}`;
            }

            if (line.startsWith("bestmove")) {
                clearTimeout(timer);
                analysis.bestMove = line.split(" ")[1];
                analysis.success = true;
                worker.removeEventListener("message", onMessage);
                resolve(analysis);
            }
        }

        worker.addEventListener("message", onMessage);
    });
};

export const analyzeBatchFens = async (
    worker: Worker,
    fens: string[]
): Promise<string[][]> => {
    const results: string[][] = [];

    for (const fen of fens) {
        try {
            const data = await analyzePosition(worker, fen, 4);
            results.push([fen, data.bestMove, data.score]);

            if (results.length % 10 === 0 || results.length === fens.length) {
                console.log(`Progress: ${results.length} / ${fens.length}`);
            }
        } catch (err) {
            results.push([fen, "error", "0.00"]);
        }
    }

    return results;
};