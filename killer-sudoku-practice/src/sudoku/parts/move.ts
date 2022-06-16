import { Cell, House } from '.';
import { BitSet } from '../../util/bitset';
import { SudokuPuzzle } from '../puzzle/sudoku_puzzle';

export abstract class Move {

  readonly technique: string;
  readonly reason: string;

  constructor(technique: string, reason: string) {
    this.technique = technique;
    this.reason = reason
  }

  abstract getMessage(): string;

  abstract move(puzzle: SudokuPuzzle): void;
}

export class PutValueMove extends Move {
  readonly cell: Cell;
  readonly value: number;

  constructor(cell: Cell, value: number, technique: string, reason: string) {
    super(technique, reason);
    this.cell = cell;
    this.value = value;

    if (value === 0) {
      throw new Error("value is empty");
    }
  }

  getMessage(): string {
    return `Put ${this.value} into Cell ${this.cell.coordinate} by ${this.technique} (reason: ${this.reason})`
  }

  move(puzzle: SudokuPuzzle): void {
    // this.cell.value = this.value;
    this.cell.putValue(this.value);
  }
}

export class RemoveCandidateFromHouseMove extends Move {
  readonly house: House;
  readonly candidate: BitSet;

  constructor(house: House, candidate: BitSet, technique: string, reason: string) {
    super(technique, reason);
    this.house = house;
    this.candidate = candidate;

    if (candidate.data === 0) {
      throw new Error("candidate is empty");
    }
  }

  getMessage(): string {
    const removeCandidates: string = this.candidate.toArray().toString()
    return `Remove candidate ${removeCandidates} from ${this.house.str()} by ${this.technique} (reason: ${this.reason})`
  }

  move(puzzle: SudokuPuzzle): void {
    this.house.removeCandidates(this.candidate);
  }
}

export class RemoveCandidateFromCellsMove extends Move {
  readonly cells: Cell[];
  readonly candidate: BitSet;

  constructor(cells: Cell[], candidate: BitSet, technique: string, reason: string) {
    super(technique, reason);
    this.cells = cells;
    this.candidate = candidate;

    if (candidate.data === 0) {
      throw new Error("candidate is empty");
    }
  }

  getMessage(): string {
    const removeCandidates: string = this.candidate.toArray().toString()
    const cells = this.cells.map(cell => (cell.coordinate)).toString()
    return `Remove candidate ${removeCandidates} from ${cells} by ${this.technique} (reason: ${this.reason})`
  }

  move(puzzle: SudokuPuzzle): void {
    // 削除対象の数字にビットが立っているので、反転してandを取ることで削除する
    const bitsetForRemove = new BitSet(~this.candidate.data)

    this.cells.forEach(cell => {
      cell.candidates.intersectWith(bitsetForRemove);
    })
  }
}