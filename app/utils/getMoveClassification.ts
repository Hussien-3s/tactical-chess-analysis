export const getMoveClassification = (prevScore: number, currentScore: number, turn: 'w' | 'b') => {
    let loss = 0;
    if (turn === 'w') {
        loss = prevScore - currentScore;
    } else {
        loss = currentScore - prevScore;
    }

    if (loss <= 0) return { label: "Best" };
    if (loss <= 0.15) return { label: "Excellent" };
    if (loss <= 0.40) return { label: "Good" };
    if (loss <= 0.90) return { label: "Inaccuracy" };
    if (loss <= 1.80) return { label: "Mistake" };
    if (loss <= 3.00) return { label: "Blunder" };
    return { label: "None" };
};