import { MovePair } from '../app/types/chess';

interface MoveListProps {
  moves: MovePair[];
  onMoveClick: (plyIndex: number) => void;
  moveRating: string[][];
}

export default function MoveList({ moves, onMoveClick, moveRating }: MoveListProps) {

  if (!moves || moves.length === 0) {
    return (
      <div className="flex w-full h-full items-center justify-center text-gray-500 text-sm italic">
        No moves available. Enter PGN to start review.
      </div>
    );
  }

  const getRatingColor = (ratingLabel: string) => {
    switch (ratingLabel) {
      case "Brilliant": return "text-cyan-400";
      case "Best":
      case "Excellent":
      case "Good":
        return "text-green-300";
      case "Inaccuracy":
        return "text-yellow-500";
      case "Mistake":
        return "text-orange-500";
      case "Blunder":
        return "text-red-500";
      case "None":
        return "text-white";
      default:
        return "text-white";
    }
  };

  return (
    <>
      {moves.map((e, i) => {
        const moveNumber = i + 1;
        const backGroundColor = i % 2 === 0 ? "bg-[#262522]" : "bg-[#2b2927]";

        const whiteRating = moveRating[i * 2 + 1]?.[3] || "";
        const blackRating = moveRating[i * 2 + 2]?.[3] || "";

        return (
          <div
            key={i}
            className={`${backGroundColor} flex flex-row-reverse items-center h-8 text-white w-full px-2 text-sm border-b border-black/10`}
          >
            <span className="text-gray-500 ml-auto w-6 text-left">.{moveNumber}</span>

            <button
              onClick={() => onMoveClick(i * 2 + 1)}
              className={`flex-1 text-right font-bold ${getRatingColor(whiteRating)} hover:bg-white/10 rounded px-1 transition-colors outline-none`}
            >
              {e[0]}
            </button>

            <button
              onClick={() => e[1] && onMoveClick(i * 2 + 2)}
              className={`flex-1 text-right font-bold ${getRatingColor(blackRating)} hover:bg-white/10 rounded px-1 transition-colors outline-none`}
            >
              {e[1] || ""}
            </button>
          </div>
        );
      })}
    </>
  );
}