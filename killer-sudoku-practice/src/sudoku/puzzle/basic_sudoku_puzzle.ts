import { concatStringHorizontally, range, sumArray, zip } from '../../util/util'
import { SudokuPuzzle } from './sudoku_puzzle';
import { Cell, House, Row, Column, Box } from '../parts';

export class BasicSudokuPuzzle extends SudokuPuzzle {
  readonly rows: Row[] = []
  readonly cols: Column[] = []
  readonly boxes: Box[] = []

  // constructor(width: number, height: number, maxnumber?: number) {
  //   super(width, height, maxnumber)
  // }

  public toString(): string {
    return `Bar (${this.name})`;
  }

  public static fromArray(board: number[][]): BasicSudokuPuzzle {
    const height: number = board.length
    if (height < 1) {
      throw new Error("board must contain at least 1 rows.")
    }
    const widthArray = board.map(row => row.length)
    const width = board[0].length
    if (width < 1) {
      throw new Error("board must contain at least 1 columns.")
    }
    if (sumArray(widthArray) !== width * height) {
      throw new Error("multiple size of rows found.")
    }

    const maxNumber = width
    const puzzle = new BasicSudokuPuzzle(width, height, maxNumber)

    // create cells
    board.forEach((row, i) => {
      row.forEach((value, j) => {
        puzzle.board.push(new Cell(j + 1, i + 1, maxNumber, value))
      })
    })
    puzzle.setupHouse()
    puzzle.setupCandidates()

    return puzzle
  }

  /**
   * Setup Houses (rows, cols)
   */
  protected setupHouse(): void {
    const rowCells: Cell[][] = Array(this.height).fill(null).map(_ => ([]))
    const colCells: Cell[][] = Array(this.height).fill(null).map(_ => ([]))
    const boxCells: Cell[][] = Array(this.boxWidth * this.boxHeight).fill(null).map(_ => ([]))

    for (var y = 1; y <= this.height; y++) {
      for (var x = 1; x <= this.width; x++) {
        const cell = this.cellAt(x, y)
        rowCells[y-1].push(cell)
        colCells[x-1].push(cell)

        const bx = ((x - 1) / this.boxWidth) | 0
        const by = ((y - 1) / this.boxHeight) | 0
        boxCells[by * this.boxWidth + bx].push(cell)
      }
    }

    rowCells.forEach((cells, i) => {
      this.rows.push(new Row(this, cells, `${i + 1}`))
    })
    colCells.forEach((cells, i) => {
      this.cols.push(new Column(this, cells, `${i + 1}`))
    })
    boxCells.forEach((cells, i) => {

      const bx = (i % this.boxWidth) + 1
      const by = ((i / this.boxHeight) | 0) + 1
      this.boxes.push(new Box(this, cells, bx, by, `${by}-${bx}`))
    })

    // // setup rows
    // range(1, this.height + 1).forEach(y => {
    //   const rowcells = range(1, this.width + 1).map(x => { return this.cellAt(x, y) })
    //   this.cols.push(new Column(this, rowcells, y.toString()))
    // })
    // // setup cols
    // range(1, this.width + 1).forEach(x => {
    //   const colcells = range(1, this.height + 1).map(y => { return this.cellAt(x, y) })
    //   this.cols.push(new Column(this, colcells, x.toString()))
    // })
    // // setup box
    // range(1, this.boxHeight + 1).forEach(by => {
    //   range(1, this.boxWidth + 1).forEach(bx => {
    //     const boxcells: Cell[] = []
    //     range((by - 1) * this.boxHeight + 1, by * this.boxHeight + 1).forEach(y => {
    //       range((bx - 1) * this.boxWidth + 1, bx * this.boxWidth + 1).forEach(x => {
    //         boxcells.push(this.cellAt(x, y))
    //       })
    //     })
    //     this.boxes.push(new Box(this, boxcells, bx, by, `${by}-${bx}`))
    //   })
    // })

    // setup house
    this.rows.forEach(row => { this.houses.push(row) })
    this.cols.forEach(col => { this.houses.push(col) })
    this.boxes.forEach(box => { this.houses.push(box) })

    for (var house of this.houses) {
      for (var cell of house.cells) {
        cell.addHouse(house)
      }
    }
  }

  /**
   * Returns box object at specified coordinates
   * @param x column index (1 - boxWidth)
   * @param y row index (1 - boxHeight)
   * @returns Box object
   */
  public boxAt(x: number, y: number): Box {
    if (x < 1 || x > this.boxWidth) {
      throw new RangeError(`x must be between 1 and ${this.boxWidth}`)
    }
    if (y < 1 || x > this.boxHeight) {
      throw new RangeError(`y must be between 1 and ${this.boxHeight}`)
    }
    return this.boxes[(y - 1) * this.boxWidth + x - 1]
  }

  /**
   * Returns board string
   * @param outsideBorder Add outside border or not. Defauls to true. (外枠をつけるか否か)
   * @param extraSpace Add extra space or not. Defaults to true.
   * @returns Board string
   * @example boardString()
   * +-------+-------+-------+
   * | 1 . 4 | 3 2 8 | . 5 . |
   * | . 5 9 | . . . | . . . |
   * | . . 6 | 4 5 . | . 3 . |
   * +-------+-------+-------+
   * | 2 . . | . 1 6 | . . . |
   * | 7 . . | 8 9 3 | . . . |
   * | . . . | . . . | 6 1 . |
   * +-------+-------+-------+
   * | 7 . . | 4 . 5 | . . . |
   * | 2 3 . | 1 7 . | . . 5 |
   * | 8 4 . | 9 . . | . . . |
   * +-------+-------+-------+
   * 
   * boardString(true, false)
   * +---+---+---+
   * |1.4|328|.5.|
   * |.59|...|...|
   * |..6|45.|.3.|
   * +---+---+---+
   * |2..|.16|...|
   * |7..|893|...|
   * |...|...|61.|
   * +---+---+---+
   * |7..|4.5|...|
   * |23.|17.|..5|
   * |84.|9..|...|
   * +---+---+---+
   */
  boardString(outsideBorder = true, extraSpace = true): string {
    return range(1, this.boxHeight + 1).map(by => {
      // get box strings of this row
      const rowBoxStrs = range(1, this.boxWidth + 1).map(bx => {
        // console.log(this.boxAt(bx, by).str())
        return this.boxAt(bx, by).str(true, extraSpace)
      })
      // join box string horizontally
      // ex)
      // +-------++-------++-------+      +-------+-------+-------+
      // | . 3 . || 4 . . || . . . |      | . 3 . | 4 . . | . . . |
      // | 9 . 2 || 8 . 6 || 3 . 1 |  =>  | 9 . 2 | 8 . 6 | 3 . 1 |
      // | . . . || . . . || . 2 . |      | . . . | . . . | . 2 . |
      // +-------++-------++-------+      +-------+-------+-------+
      var lines = zip(...(rowBoxStrs.map(box => { return box.split("\n") }))).map(
        linezip => { return linezip.join("").replaceAll("++", "+").replaceAll("||", "|") }
      )
      // if this box is not bottom, remove bottom line
      if (by !== this.boxHeight) lines = lines.slice(0, -1)
      return lines.join("\n")
    }).join("\n")
  }

  boardCandidateString(outsideBorder = true, extraSpace = true): string {
    let ret = ""
    for (let by = 1; by < this.boxHeight + 1; by++){
      const rowBoxStrs = range(1, this.boxWidth + 1).map(bx => {
        return this.boxAt(bx, by).strWithCandidates();
      })

      ret += concatStringHorizontally(rowBoxStrs, " ").join("\n");
      if ( by !== this.boxHeight) ret += "\n";
    }

    return ret
  }
}