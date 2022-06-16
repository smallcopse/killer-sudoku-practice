import { BitSet } from '../../util/bitset'
import { range } from '../../util/util';
import { House } from './'


/**
 * Sudoku Cell
 */
export class Cell {
  public static readonly emptyValue = 0;

  /**
   * X coordinate (column number number started at 1)
   * (1から始まる列番号)
   */
  readonly x: number
  /**
   * Y coordinate (row number number started at 1)
   * (1から始まる行番号)
   */
  readonly y: number
  /**
   * Maximum numbers. ex) basic 9x9 sudoku, maxNumber=9.
   */
  readonly maxNumber: number
  /**
   * The initially defined values. 0 means empty.
   * (ゲームの最初に与えられた数字。0はこのセルが空欄であることを示す)
   */
  clue: number
  /**
   * Placed number. 0 means empty.
   * (このセルに置かれた数字。0はこのセルが空欄であることを示す)
   */
  value: number
  /**
   * Notes
   * (仮置きされた数字)
   */
  readonly notes: Set<number> = new Set<number>()
  /**
   * Houses that have this cell
   * (このセルを含むHouseのリスト)
   */
  readonly houses: Set<House> = new Set<House>()
  /**
   * Numbers that is allowed to place into this cell. ex) add odd or even numbers to this set in the case of odd-even sudoku
   * (このセルに置くことを許可された数字。例えば奇数偶数の数独の場合、このSetに奇数のみを設定したりする)
   */
  candidates: BitSet
  /**
   * Numbers that is allowed to place into this cell. ex) add odd or even numbers to this set in the case of odd-even sudoku
   * (このセルに置くことを許可された数字。例えば奇数偶数の数独の場合、このSetに奇数のみを設定したりする)
   */
  readonly initialCandidates: BitSet

  /**
   * @constructor
   * @param x X coordinate (column number number started at 1)
   * @param y Y coordinate (row number number started at 1)
   */
  constructor(x: number, y: number);
  /**
   * @constructor
   * @param x X coordinate (column number number started at 1)
   * @param y Y coordinate (row number number started at 1)
   * @param maxNumber 
   */
  constructor(x: number, y: number, maxNumber: number);
  /**
   * @constructor
   * @param x X coordinate (column number number started at 1)
   * @param y Y coordinate (row number number started at 1)
   * @param maxNumber 
   * @param clue The initially defined values. 0 means empty.
   */
  constructor(x: number, y: number, maxNumber: number, clue: number);

  /**
   * @constructor
   * @param x X coordinate (column number number started at 1)
   * @param y Y coordinate (row number number started at 1)
   * @param maxNumber 
   * @param clue The initially defined values. 0 means empty.
   * @param value Placed number. Defaults to 0.
   * @param notes Notes
   * @param houses Houses
   * @param initialCandidates Numbers that is allowed to place into this cell. Defaults to {1, 2, ..., 9}.
   */
  constructor(
    x: number, y: number, maxNumber?: number, clue?: number, value?: number, notes?: Set<number>, houses?: Set<House>, initialCandidates?: BitSet) {

    this.x = x
    this.y = y
    this.maxNumber = maxNumber ?? 9

    this.clue = clue ?? Cell.emptyValue;
    this.value = value ?? clue ?? Cell.emptyValue;
    this.notes = notes ?? new Set<number>()
    this.houses = houses ?? new Set<House>()
    // if allowedNumbers is unspecified, bitset {1, 2, ..., maxNumber} = b'111...111'
    let defaultCandidates = new BitSet()
    defaultCandidates.fill(this.maxNumber)
    this.initialCandidates = this.hasClue() ? new BitSet(1 << (this.clue - 1)) : (initialCandidates ?? defaultCandidates)
    this.candidates = this.initialCandidates
  }

  get filledNumber(): number {
    return this.isDetermined ? this.clue : this.value
  }

  get isDetermined(): boolean {
    return this.clue !== 0
  }

  /**
   * Add a number to note
   * @param value number to add
   */
  addNote(value: number): void {
    this.notes.add(value)
  }
  /**
   * Delete a number from note
   * @param value number to delete
   */
  deleteNote(value: number): void {
    this.notes.delete(value)
  }
  /**
   * Clear note
   */
  clearNote(): void {
    this.notes.clear()
  }
  /**
   * Add house
   * @param house
   */
  addHouse(house: House): void {
    this.houses.add(house)
  }

  public str(): string {
    return this.filledNumber !== 0 ? this.filledNumber.toString() : "."
  }

  public get coordinate(): string {
    return `R${this.y}C${this.x}`;
  }

  public static isEmptyValue(v: number): boolean {
    return v === Cell.emptyValue;
  }

  public isEmpty(): boolean {
    return Cell.isEmptyValue(this.clue) || Cell.isEmptyValue(this.value);
  }

  public hasClue(): boolean {
    return !Cell.isEmptyValue(this.clue);
  }

  /**
   * 
   */
  public filterCandidatesByHouse() {
    this.houses.forEach(house => {
      this.candidates.intersectWith(house.getAvailableNumbersBitSet())

    })
  }

  public putValue(value: number) {
    this.value = value;

    const candidatesForRemove = new BitSet()
    candidatesForRemove.set(value);
    this.houses.forEach(house => {
      house.removeCandidates(candidatesForRemove)
    })
  }

  public strWithCandidates(outsideBorder = true, extraSpace = true): string {
    const height = Math.ceil(Math.sqrt(this.maxNumber))
    const width = height;
    const printWidth = (extraSpace ? width * 2 - 1 : width) + (outsideBorder && extraSpace ? 2 : 0)
    const horizontalBorder = "+" + "-".repeat(printWidth) + "+";
    const delim = extraSpace ? " " : ""

    var ret = ""
    if (outsideBorder) ret += horizontalBorder + "\n"
    ret += range(1, height + 1).map(y => {
        var line = outsideBorder ? "|" + delim : delim
        line += range(1, width + 1).map(x => {
            let n = (y-1)*width + x
            return this.candidates.has(n) ? n.toString(): " ";
        }).join(delim)
        if (outsideBorder) line += delim + "|"
        return line
    }).join("\n")
    if(outsideBorder) ret += "\n" + horizontalBorder
    return ret
  }
}

export class BlankCell extends Cell {
  str(): string {
    return " "
  }
}