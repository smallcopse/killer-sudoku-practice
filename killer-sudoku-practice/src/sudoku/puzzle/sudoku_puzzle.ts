import { range, shuffle, sumArray } from '../../util/util'
import { BasicSudokuPuzzle } from './basic_sudoku_puzzle';
import { Cell, House, Row, Column, } from '../parts';
import { BitSet, BitSetArray } from '../../util/bitset';
import { Move } from '../parts/move';
import { SolveTechnique } from '../solver';
import { Puzzle } from './puzzle';
import { ICloneable } from '../../util/interfaces';

export interface CageDict {
  sum: number
  cells: string[]
}

export interface SudokuDict {
  version: string
  author?: string
  date?: string
  name?: string
  description?: string
  comment?: string
  source?: string
  level?: string
  problemtype?: string
  shape?: string
  width: number
  height: number
  maxnumber?: number
  boxWidth: number
  boxHeight: number
  board?: number[][]
  cages: CageDict[]
}

export abstract class SudokuPuzzle extends Puzzle {
  problemType: string = ""
  shape: string = ""
  width: number = 9
  height: number = 9
  /**
   * Maximum numbers. ex) basic 9x9 sudoku, maxNumber=9.
   */
  maxNumber: number = 9
  boxWidth = 3
  boxHeight = 3

  readonly board: Cell[] = []
  readonly houses: House[] = []
  /**
   * combination lookup table
   * @example
   *   combinations[1][1] = {{1}}
   *   combinations[1][3] = {{3}}
   *   combinations[2][3] = {{1,2}}
   *   combinations[1][5] = {{5}}
   *   combinations[2][5] = {{1,4}, {2,3}}
   *   Actually, combination is stored as bitset.
   *   ex) combinations[2][5] = {b'0000001001', b'000000110'} = {9, 6}
   */
  readonly combinations: Array<Array<BitSetArray>> = []
  /**
   * Goal value of sum of cells in this house. Defaults to 45.
   * (このHouse内の数字の合計値のあるべき値。通常は9x9の数独を想定して45とする)
   */
  readonly targetSum: number = 45

  readonly solveTechniques: SolveTechnique[] = []

  constructor(width: number, height: number, maxnumber?: number) {
    super()
    this.width = width
    this.height = height
    // ex) (width, height) = (9, 9) => (boxWidth, boxHeight) = (3, 3)
    // ex) (width, height) = (6, 6) => (boxWidth, boxHeight) = (3, 2)
    this.boxHeight = Math.floor(Math.sqrt(height))
    this.boxWidth = this.width / this.boxHeight | 0
    if (maxnumber !== undefined) {
      this.maxNumber = maxnumber
    }
    this.setupCombinations()
  }

  public static fromDict(data: SudokuDict): SudokuPuzzle | null {
    const allowed_problemtypes: Set<any> = new Set([
      undefined, "basic"
    ])
    if (allowed_problemtypes.has(data.problemtype)) {
      throw new Error(`unkown problemtype: ${data.problemtype}`)
    }
    if (data.problemtype === undefined || data.problemtype === "basic") {
      return BasicSudokuPuzzle.fromDict(data)
    }
    return null
  }

  public toString(): string {
    return `Bar (${this.name})`;
  }

  /**
   * Returns cell object at specified coordinates
   * @param x column index (1 - width)
   * @param y row index (1 - height)
   * @returns Cell object
   */
  public cellAt(x: number, y: number): Cell {
    if (x < 1 || x > this.width) {
      throw new RangeError(`x must be between 1 and ${this.width}`)
    }
    if (y < 1 || x > this.height) {
      throw new RangeError(`y must be between 1 and ${this.height}`)
    }
    return this.board[(y - 1) * this.width + x - 1]
  }

  /**
   * Returns number at specified coordinates
   * @param x column index (1 - width)
   * @param y row index (1 - height)
   * @returns number at specified coordinates. 0 means empty.
   */
  public numberAt(x: number, y: number): number {
    return this.cellAt(x, y).filledNumber
  }

  public abstract boardString(): string

  public setupCombinations(): void {
    // 数字をN個使って合計がSになる組み合わせをcombinations[N][S]に追加していく
    // this.combinations.push(Array<BitSetArray>(1).fill(new BitSet()))

    for (var N = 0; N <= this.maxNumber; N++) {
      // 数字をN個使ったときに取り得る最も大きい値
      // 例えばN=2のとき、9と8を選んだ時が最も大きい（=9+8=17)
      const sumMaxN: number = ((2 * this.maxNumber - N + 1) * N) / 2 | 0
      // combinations[N] = cmbN
      // cmbN に 数字をN個使って合計がSになる組み合わせを追加していく
      const cmbN: Array<BitSetArray> = Array(sumMaxN+1).fill(null).map(e => (new BitSetArray()));
      this.combinations.push(cmbN)
    }

    // Generate Power set of {1, 2, ..., 9} as bitset
    // {1, 2, ..., 9} のべき集合を作成
    // （1 - maxnumber までの数字を各数字最大1回使用して作れるすべての組み合わせ）
    // nビット目:数字nを使う場合=1 使わない場合=0
    // ex) 18 = b'10010' -> {2, 5}

    let allCombinations = BitSetArray.generateCombinations(this.maxNumber);
    allCombinations.forEach(cmb => {
      // console.log(`${('000000000' + cmb.data.toString(2)).slice(-9)} ${cmb.size} ${cmb.sum()}`)
      this.combinations[cmb.size][cmb.sum()].push(cmb)
    })

    this.combinations.forEach(cmbN => {
      cmbN.forEach(cmbNS => {cmbNS.sort()})
    })
  }

  public isSolved(): boolean {
    for (let house of this.houses) {
      if (!house.isFilled()) {
        return false;
      }
    }

    return true;
  }

  public setupCandidates(): void {
    this.board.forEach(cell => {
      cell.filterCandidatesByHouse();
    });
  }

  /**
   * Get houses that has both cell(x1, y1) and cell(x2, y2)
   * @param x1 X coordinate of the first cell
   * @param y1 Y coordinate of the first cell
   * @param x2 X coordinate of the second cell
   * @param y2 y coordinate of the second cell
   * @returns {Array<House>} list of houses that has both cell(x1, y1) and cell(x2, y2)
   */
  public getIntersectionHouses(x1: number, y1: number, x2:number, y2: number): House[] {
    const house1 = this.cellAt(x1, y1).houses;
    const house2 = this.cellAt(x2, y2).houses;
    var ret: House[] = []
    house1.forEach(house => {
      if (house2.has(house)) {
        ret.push(house);
      }
    })
    return ret;
  }
}