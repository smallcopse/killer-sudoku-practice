import { concatStringHorizontally, range } from '../../util/util'
import { Cell, House } from './'
import { SudokuPuzzle } from '../puzzle/sudoku_puzzle'


export class Box extends House {
    width = 3
    height = 3
    x = 0
    y = 0

    /**
     * 
     * @param puzzle Instance of SudokuPuzzle that has this house
     * @param cells Cells in this house
     * @param x X coordinate
     * @param y Y coordinate
     * @param id ID string
     */
    constructor(puzzle: SudokuPuzzle, cells: Cell[], x: number, y: number, id: string) {
        super(puzzle, cells, id)
        this.x = x
        this.y = y
        this.width = puzzle.boxWidth
        this.height = puzzle.boxHeight
    }

    name() {
        return `Box R${this.y}C${this.x}`
    }

    get type(): string {
        return "Box"
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
        return this.cells[(y - 1) * this.width + x - 1]
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

    /**
     * 
     * @param outsideBorder Add outside border or not. Defauls to true. (外枠をつけるか否か)
     * @param extraSpace Add extra space or not. Defauls to true. (スペースを入れるか否か)
     * @returns box string
     */
    public str(outsideBorder = true, extraSpace = true): string {
        const printWidth = (extraSpace ? this.width * 2 - 1 : this.width) + (outsideBorder && extraSpace ? 2 : 0)
        const horizontalBorder = "+" + "-".repeat(printWidth) + "+";
        const delim = extraSpace ? " " : ""

        var ret = ""
        // console.log(this.width, this.height, this.cells.length)
        if (outsideBorder) ret += horizontalBorder + "\n"
        ret += range(1, this.height + 1).map(y => {
            var line = outsideBorder ? "|" + delim : delim
            line += range(1, this.width + 1).map(x => {
                return this.cellAt(x, y).str()
            }).join(delim)
            if (outsideBorder) line += delim + "|"
            return line
        }).join("\n")
        if (outsideBorder) ret += "\n" + horizontalBorder
        return ret
    }

    public strWithCandidates(): string {
        let ret = ""
        for (let y = 0; y < this.height; y++) {
            const lineCells = this.cells.slice(y * this.width, (y + 1) * this.width)
            let lines = concatStringHorizontally(lineCells.map(cell => cell.strWithCandidates()))
            if (y !== 0) lines = lines.slice(1);
            ret += lines.join("\n").replaceAll("++", "+").replaceAll("||", "|")
            if (y !== this.height - 1) ret += "\n";
        }
        return ret;
    }
}