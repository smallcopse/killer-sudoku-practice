import { Move, PutValueMove } from '../parts';
import { SudokuPuzzle } from '../puzzle/sudoku_puzzle';
import { SolveFunc, SolveTechnique } from './solve_technique';


export const LastFreeCell: SolveFunc = (puzzle: SudokuPuzzle) => {
  let moves: Move[] = [];
  puzzle.houses.forEach(house => {
    let freeCells = house.getFreeCells();
    if (freeCells.length === 1) {
      const lastCell = freeCells[0];
      const lastValue = house.getAvailableNumbersBitSet().toArray()[0]
      const reason = `Cell ${lastCell.coordinate} is the only undetermined cell in ${house.name()}`
      moves.push(new PutValueMove(lastCell, lastValue, "LastFreeCell", reason))
    }
  })

  return moves;
}