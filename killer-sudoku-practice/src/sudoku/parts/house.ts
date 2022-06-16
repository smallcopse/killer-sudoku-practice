import { BitSet, BitSetArray } from '../../util/bitset'
import { Cell } from './cell'
import { SudokuPuzzle } from '../puzzle/sudoku_puzzle'

/**
 * House
 * @description
 * A group of cells, which must each contain a different digit in the solution
 * @see {@link https://www.sudocue.net/glossary.php#House SudoCue - Sudoku Glossary}
 */
export abstract class House {
  id: string = ""

  readonly puzzle: SudokuPuzzle
  readonly cells: Cell[]

  /**
   * Combinations of numbers that is allowed to place into this house.
   * (このHouseに置くことができる数字の組み合わせ)
   */
  combinations: BitSetArray;
  /**
   * Goal value of sum of cells in this house. If basic 9x9 sudoku, targetSum is 45.
   * (このHouse内の数字の合計値のあるべき値。9x9の数独であれば45になる)
   */
  readonly targetSum: number

  /**
   * @constructor
   * @param puzzle Instance of SudokuPuzzle that has this house
   * @param cells Cells in this house
   * @param id ID string
   * @param targetSum Goal value of sum of cells in this house. If not specified, calculate from cell length.
   */
  constructor(puzzle: SudokuPuzzle, cells: Cell[], id: string, targetSum?: number) {
    this.puzzle = puzzle
    this.cells = cells
    // If not specified, calculate from cell length
    // ex) cell.length = 9 => targetSum = 9 x (9 + 1) / 2 = 45
    this.targetSum = targetSum ?? (cells.length * (cells.length + 1) / 2) | 0
    this.id = id
    this.combinations = this.puzzle.combinations[this.cells.length][this.targetSum]
  }

  abstract name(): string

  abstract get type(): string;
  
  /**
   * Add a number to note of all cells
   * (このHouse内の全てのセルのメモに指定された数字を追加する)
   * @param value number to add
   */
  addNote(value: number) {
    this.cells.forEach(cell => cell.addNote(value))
  }

  /**
   * Remove a number from note of all cells
   * (このHouse内の全てのセルのメモから指定された数字を削除する)
   * @param value number to delete
   */
  publicdeleteNote(value: number) {
    this.cells.forEach(cell => cell.deleteNote(value))
  }

  public abstract str(): string;

  /**
   * このHouseで使用している数字の一覧をBitSetで返す
   * @returns このHouseで使用している数字の一覧
   */
  public getUsedNumbersBitSet(): BitSet {
    let bitset = new BitSet()
    this.cells.forEach(cell => {
      if (cell.value !== 0) {
        bitset.set(cell.value)
      }
    })
    return bitset
  }

  /**
   * このHouseの未確定Cellに置くことのできる数字の一覧をBitSetで返す
   * @returns 
   */
  public getAvailableNumbersBitSet(): BitSet {
    // 組み合わせの候補の中で1回でも出てくる数字の一覧
    // つまり候補のBitSetのunion (OR) を取ればよい
    let ret = this.combinations.union()
    ret.deleteAll(this.getUsedNumbersBitSet())
    return ret;
  }

  /**
   * 
   * このHouseの未確定のCellの一覧を返す
   */
  public getFreeCells(): Cell[] {
    return this.cells.filter(cell => cell.isEmpty())
  }

  public removeCandidates(candidate: BitSet): void {
    // 削除対象の数字にビットが立っているので、反転してandを取ることで削除する
    const bitsetForRemove = new BitSet(~candidate.data)
    this.cells.forEach(cell => {
      cell.candidates.intersectWith(bitsetForRemove)
    })
  }

  public isFilled(): boolean {
    return this.getFreeCells().length === 0;
  }
}