import { create } from 'zustand';

interface GameState {
    numberOfMoves: number;
    setNumberOfMoves: (count: number) => void;
}

const useGameStore = create<GameState>((set) => ({
    numberOfMoves: 0,

    setNumberOfMoves: (count) => set({ numberOfMoves: count }),
}));

export default useGameStore;