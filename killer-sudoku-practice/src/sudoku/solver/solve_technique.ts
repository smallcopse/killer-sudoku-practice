import { Move } from '../parts';
import { SudokuPuzzle } from '../puzzle/sudoku_puzzle';

// export interface SolveTechnique {
//   get name(): string;
//   get level(): number;
//   solve(puzzle: SudokuPuzzle): Move[];
// }

export abstract class SolveTechnique {
  abstract get name(): string;
  abstract get level(): number;
  static solve(puzzle: SudokuPuzzle): Move[] {
    throw new Error("not impletemnted");
  }
}

const TECHNIQUE_LEVEL = {
  EASY: 10,
  MIDDIUM: 20,
  HARD: 30, 
  EXPERT: 40
} as const

export type TechniqueLevel = typeof TECHNIQUE_LEVEL[keyof typeof TECHNIQUE_LEVEL]


export type SolveFunc = (puzzle: SudokuPuzzle) => Array<Move>;