"use client";

import { useState } from 'react';
import { Settings, SearchCode, CircleStar, Loader } from 'lucide-react';

import ChessBoard from "@/components/chessBoard";
import PlayerInfo from "@/components/PlayerInfo";
import MoveList from "@/components/MoveList";
import EvaluationBar from "@/components/EvaluationBar";
import { useChessEngine } from "./hooks/useChessEngine";
import { getMoveClassification } from './utils/getMoveClassification';


export default function Home() {
  const [move, setMove] = useState(0);
  const [input, setInput] = useState("");

  const {
    rawPgn,
    analysisData,
    isAnalyzing,
    error,
    gameInfo,
    movesArray,
    startReview
  } = useChessEngine();

  console.log(analysisData);

  const classifiedData = analysisData.map((current, index) => {
    if (index === 0) return [...current, "Book"];

    const prevScore = parseFloat(analysisData[index - 1][2]);
    const currentScore = parseFloat(current[2]);

    const turn = index % 2 !== 0 ? 'w' : 'b';

    const classification = getMoveClassification(prevScore, currentScore, turn);

    return [...current, classification.label];
  });

  const currentScore = (analysisData && analysisData.length > move) ? analysisData[move][2] : "0.00";
  const currentBestMove = (analysisData && analysisData.length > move) ? analysisData[move][1] : "";

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex w-full flex-col lg:flex-row-reverse items-center justify-center gap-6 lg:gap-7 bg-[#2E2C2B] font-sans p-2 md:p-4 lg:p-0">
      
      {/* Board Layout */}
      <div className="flex w-full lg:w-[60%] xl:w-[60%] justify-center items-center">
        <div className="w-full max-w-[95vw] sm:max-w-[80vw] md:max-w-[600px] lg:max-w-[75vh] xl:max-w-[85vh] flex flex-col justify-center items-center">

          <PlayerInfo
            name={gameInfo.black}
            elo={gameInfo.blackElo}
            result={gameInfo.result === "0-1" ? "1" : (gameInfo.result === "1-0" ? "0" : gameInfo.result)}
          />

          <div className="w-full flex justify-center flex-row-reverse items-stretch relative my-1 md:my-2">
            <EvaluationBar score={currentScore} />
            <div className="flex-1 aspect-square">
              <ChessBoard move={move} rawPgn={rawPgn} />
            </div>
          </div>

          <PlayerInfo
            name={gameInfo.white}
            elo={gameInfo.whiteElo}
            result={gameInfo.result === "1-0" ? "1" : (gameInfo.result === "0-1" ? "0" : gameInfo.result)}
            isReversed={false}
          />
        </div>
      </div>

      {/* Sidebar Layout */}
      <div className="w-full lg:w-[35%] xl:w-[30%] lg:ml-10 bg-[#262522] h-[50vh] min-h-[400px] lg:min-h-0 lg:h-[96vh] flex flex-col shadow-xl rounded-md overflow-hidden">

        <div className="flex flex-row justify-between h-[6%] items-center p-5 bg-[#21201d] w-[100%] border-b border-black/20">
          <div><SearchCode className="text-[#91908f] hover:text-white cursor-pointer transition-colors" /></div>
          <div className="flex items-center text-[#c1c1c0] hover:text-white cursor-pointer transition-colors">
            <p className="font-semibold text-sm mr-2">Rate Game</p>
            <CircleStar size={18} />
          </div>
          <div><Settings className="text-[#91908f] hover:text-white cursor-pointer transition-colors" /></div>
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-[100%] h-[60%] bg-[#21201d]">
          <MoveList moveRating={classifiedData} moves={movesArray} onMoveClick={setMove} />
        </div>

        <div className="flex flex-col justify-between flex-grow bg-[#262522] p-4 gap-4">
          {error && (
            <div className="bg-red-500/10 text-red-500 p-2 text-sm rounded-md text-right border border-red-500/20">
              {error}
            </div>
          )}

          <div className="flex justify-between text-[#c1c1c0] text-sm bg-black/20 p-2 rounded-md">
            <div>
              <span className="text-[#91908f]">Best Move:</span>
              <span className="ml-2 font-bold text-white">{currentBestMove || "-"}</span>
            </div>
            <div>
              <span className="text-[#91908f]">Eval:</span>
              <span className="ml-2 font-bold text-white">{currentScore || "-"}</span>
            </div>
          </div>

          <textarea
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste PGN here..."
            className="bg-[#363432] p-3 w-[100%] h-24 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#71a94a] rounded-md resize-none shadow-inner"
            dir="ltr"
          />

          <button
            className="w-[100%] bg-[#71a94a] hover:bg-[#82b95b] transition-colors text-white font-bold h-12 rounded-md shadow-md flex justify-center items-center gap-2"
            onClick={() => startReview(input)}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader className="animate-spin" size={18} />
                Analyzing...
              </>
            ) : "Start Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
