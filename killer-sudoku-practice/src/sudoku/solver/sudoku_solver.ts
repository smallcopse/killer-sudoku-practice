import { Move, PutValueMove } from '../parts';
import { SudokuPuzzle } from '../puzzle/sudoku_puzzle';
import { LastFreeCell } from './last_free_cell';
import { NakedSingles } from './naked_singles';
import { SolveFunc, SolveTechnique } from './solve_technique';

export class SudokuSolver {
  
  public static solve(puzzle: SudokuPuzzle) {
    while (!puzzle.isSolved()) {
      let moves = SudokuSolver.next(puzzle);
      for (let move of moves) {
        console.log(move.getMessage())
        move.move(puzzle);
        const boardString: string = puzzle.boardString()
        console.log(boardString)
      }
      if (moves.length === 0) {
        break;
      }
    }
  }

  public static next(puzzle: SudokuPuzzle): Move[] {
    var techniques: Array<SolveFunc> = [
      NakedSingles,
      LastFreeCell
    ];

    var ret: Move[] = [];

    for (var technique of techniques) {
      ret = technique(puzzle);
      if (ret.length !== 0) break;
    }

    return ret;
  }
}