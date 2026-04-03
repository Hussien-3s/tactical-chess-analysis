"use client";

import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js'
import { useEffect } from 'react';
import useGameStore from '@/app/context/useGameStore';

export default function ChessBoard({ move, rawPgn }: { move: number, rawPgn: string }) {
    const setNumberOfMoves = useGameStore((state) => state.setNumberOfMoves);

    function pgnToFen() {

        var chess = new Chess();

        const lines = rawPgn.trim().split('\n');

        const pgn = lines.map(line => line.trim());

        chess.loadPgn(pgn.join('\n'))
        const moves = chess.history();
        chess.reset();
        const fens = [];
        fens.push(chess.fen());

        moves.forEach((move) => {
            chess.move(move);
            fens.push(chess.fen());
        });

        return fens
    }


    const fen = pgnToFen();
    useEffect(() => {
        if (fen.length > 0) {
            setNumberOfMoves(fen.length);
        }
    }, [fen.length, setNumberOfMoves]);
    const position = fen[move]


    // set the chessboard options
    const chessboardOptions = {
        allowDragOffBoard: true,
        allowDrawingArrows: true,
        showNotation: true,
        allowBoardFlip: true,
        showCoordinates: true,
        lightSquareStyle: { backgroundColor: "#EBEBD3" },
        lightSquareNotationStyle: { color: "#749454", fontWeight: "600" },
        darkSquareStyle: { backgroundColor: "#749454" },
        darkSquareNotationStyle: { color: "#EBEBD3", fontWeight: "600" },
        position: position,
        boardStyle: {
            width: '100%',
            height: '100%',
        },
        id: 'click-or-drag-to-move'
    };

    // render the chessboard
    return <Chessboard options={chessboardOptions} />;
}