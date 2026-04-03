interface EvaluationBarProps {
  score?: string;
}

export default function EvaluationBar({ score }: EvaluationBarProps) {
  let whitePercentage = 50;

  if (score) {
    if (score.startsWith('M')) {
      const moves = parseInt(score.replace('M', ''), 10);
      if (moves > 0) {
        whitePercentage = 100;
      } else {
        whitePercentage = 0;
      }
    } else {
      const numericScore = parseFloat(score);
      const clampedScore = Math.max(-5, Math.min(5, numericScore));
      whitePercentage = 50 + (clampedScore * 10);
    }
  }

  return (
    <div className="w-[12px] md:w-[3%] h-full md:h-[87vh] bg-white ml-1 md:ml-2 rounded-sm overflow-hidden flex flex-col transition-all duration-500 shadow-md">
      <div
        className="bg-[#403d39] w-[100%] transition-all duration-500 flex items-end justify-center pb-2 text-xs font-bold text-white/50"
        style={{ height: `${100 - whitePercentage}%` }}
      >
        {score && !score.includes('-') && score !== '0.00' && parseFloat(score) < 0 ? score : ''}
      </div>

      <div
        className="bg-[#e6e6e6] w-[100%] transition-all duration-500 flex items-start justify-center pt-2 text-xs font-bold text-black/50"
        style={{ height: `${whitePercentage}%` }}
      >
        {score && parseFloat(score) > 0 ? (score.startsWith('M') ? score : `+${score}`) : ''}
      </div>
    </div>
  );
}
