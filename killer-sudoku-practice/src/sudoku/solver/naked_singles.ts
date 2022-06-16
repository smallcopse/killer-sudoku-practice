import { Move, PutValueMove } from '../parts';
import { SudokuPuzzle } from '../puzzle/sudoku_puzzle';
import { SolveFunc, SolveTechnique } from './solve_technique';


export const NakedSingles: SolveFunc = (puzzle: SudokuPuzzle) => {
  let moves: Move[] = [];
  puzzle.board.forEach(cell => {
    if (!cell.isDetermined && cell.candidates.size === 1) {
      const value = cell.candidates.toArray()[0]
      const reason = `Candidate of Cell ${cell.coordinate} is only ${value}`
      moves.push(new PutValueMove(cell, value, "NakedSingles", reason))
    }
  })
  return moves;
}