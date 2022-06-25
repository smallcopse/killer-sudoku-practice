import React, { Component } from 'react';
import { Stage, Layer, Star, Text, Rect, Group, Line } from 'react-konva';
import { idText, isObjectBindingPattern } from 'typescript';
import { range } from '../../util/util';
import { SudokuPuzzle } from '../puzzle';
// import './FileDragDrop.css'
import { BasicSudokuPuzzle } from '../puzzle/basic_sudoku_puzzle';
import { SudokuSolver } from '../solver/sudoku_solver';
import { CellView } from './cellView';
import { SudokuController } from './sudokuController';
import './sudokuView.css'

// union型を使う場合
const SudokuEditTarget = {
  VALUE: 'VALUE',
  NOTE: 'NOTE'
} as const;
type SudokuEditTarget = typeof SudokuEditTarget[keyof typeof SudokuEditTarget];

interface Props {
  cellSize: number,
  clueColor: string,
  textColor: string,
  gridColor: string,
  boxStrokeColor: string,
  cellColor: string,
  activeCellColor: string,
  activeCellStrokeColor: string,
  activeCellStrokeWidth: number,
  neighborCellColor: string,
  sameNumberCellColor: string,
  gridStrokeWidth: number,
  boxStrokeWidth: number,
  fontFamily: string
}
interface State {
  files: File[],
  sudoku: BasicSudokuPuzzle,
  activeCellX: number,
  activeCellY: number,
  pickedNumber: number,
  editmode: SudokuEditTarget
}

export class SudokuBoard extends Component<Props, State> {
  static defaultProps = {
    cellSize: 55,
    clueColor: '#663344',
    textColor: '#dd5577',
    gridColor: '#e0ccd3',
    boxStrokeColor: '#663344',
    cellColor: '#ffffff',
    activeCellColor: '#ffccdd',
    activeCellStrokeColor: '#dd5577',
    activeCellStrokeWidth: 3,
    neighborCellColor: '#ffeef9',
    // sameNumberCellColor: '#eebbcc',
    sameNumberCellColor: '#ffccdd',
    gridStrokeWidth: 1,
    boxStrokeWidth: 2,
    fontFamily: 'sans-serif'
  };
  constructor(props: any) {
    super(props);

    var sampleSudokuArray: number[][] = [
      [1, 3, 0, 2, 0, 0, 7, 4, 0],
      [0, 2, 5, 0, 1, 0, 0, 0, 0],
      [4, 8, 0, 0, 6, 0, 0, 5, 0],
      [0, 0, 0, 7, 8, 0, 2, 1, 0],
      [5, 0, 0, 0, 9, 0, 3, 7, 0],
      [9, 0, 0, 0, 3, 0, 0, 0, 5],
      [0, 4, 0, 0, 0, 6, 8, 9, 0],
      [0, 5, 3, 0, 0, 1, 4, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    this.state = {
      files: [],
      sudoku: BasicSudokuPuzzle.fromArray(sampleSudokuArray),
      activeCellX: 1,
      activeCellY: 1,
      pickedNumber: 0,
      editmode: SudokuEditTarget.VALUE
    };

    this.setActiveCell = this.setActiveCell.bind(this);
    this.setPickedNumber = this.setPickedNumber.bind(this);

    const boardString: string = this.state.sudoku.boardString()
    console.log(boardString)
    for (let y = 1; y <= 9; y++) {
      let a = ""
      for (let x = 1; x <= 9; x++) {
        a += this.state.sudoku.cellAt(x, y).str();
      }
      console.log(a);
    }
    console.log(this.state.sudoku.boardCandidateString())
    console.log("solve")
    // SudokuSolver.solve(this.state.sudoku);
    const boardString2: string = this.state.sudoku.boardString()
    console.log(boardString2)
  }

  getCellColor(x: number, y: number): string {
    const ax: number = this.state.activeCellX;
    const ay: number = this.state.activeCellY;
    if (x === ax && y === ay) {
      return this.props.activeCellColor;
    }
    const sudoku: SudokuPuzzle = this.state.sudoku;
    if (sudoku.getIntersectionHouses(x, y, ax, ay).length > 0) {
      return this.props.neighborCellColor;
    }
    const activeCellStr: string = sudoku.cellAt(ax, ay).str("")
    const cellStr: string = sudoku.cellAt(x, y).str()
    if (activeCellStr !== "" && activeCellStr === cellStr) {
      return this.props.sameNumberCellColor;
    }
    return this.props.cellColor;
  }

  getCellStrokeColor(x: number, y: number): string {
    const ax: number = this.state.activeCellX;
    const ay: number = this.state.activeCellY;
    if (x === ax && y === ay) {
      return this.props.activeCellStrokeColor;
    }
    return this.props.gridColor;
  }

  setActiveCell(x: number, y: number) {
    this.setState({
      activeCellX: x,
      activeCellY: y
    })
  }

  setPickedNumber(num: number) {
    const ax = this.state.activeCellX;
    const ay = this.state.activeCellY;
    const cell = this.state.sudoku.cellAt(ax, ay)
    if (!cell.hasClue()) {
      cell.value = num;
    }

    this.setState({
      pickedNumber: num
    })
  }

  render() {
    const sudoku: BasicSudokuPuzzle = this.state.sudoku;
    const cellSize: number = this.props.cellSize;
    const fontSize: number = cellSize * 0.65
    const boxWidth: number = cellSize * sudoku.boxWidth
    const boxHeight: number = cellSize * sudoku.boxHeight
    const boardWidth: number = cellSize * sudoku.width
    const boardHeight: number = cellSize * sudoku.height
    const padding = 10.5
    const stageWidth = 2 * padding + boardWidth;
    const stageHeight = 2 * padding + boardHeight;

    return (
      <Stage id="sudoku-board" x={padding} y={padding} width={stageWidth} height={stageHeight} >
        <Layer>
          <Group name='Cells'>
            {
              sudoku.board.map((cell, index) => (
                <CellView
                  cell={cell}
                  sudoku={this.state.sudoku}
                  cellSize={this.props.cellSize}
                  clueColor={this.props.clueColor}
                  textColor={this.props.textColor}
                  borderColor={this.props.gridColor}
                  cellColor={this.getCellColor(cell.x, cell.y)}
                  gridStrokeWidth={this.props.gridStrokeWidth}
                  fontFamily={this.props.fontFamily}
                  activeFunc={this.setActiveCell}
                  key={index}
                />
              ))
            }
          </Group>
          <Group name='Grid'>
            <Group name='VerticalLine'>
              {
                range(sudoku.boxWidth + 1).map((col) => (
                  <Line
                    points={[col * boxWidth, 0, col * boxWidth, boardHeight]}
                    stroke={this.props.boxStrokeColor}
                    strokeWidth={this.props.boxStrokeWidth}
                    lineCap="square"
                    key={`VerticalLine_${col}`}
                  />
                ))
              }
            </Group>
            <Group name='HorizontalLine'>
              {
                range(sudoku.boxHeight + 1).map((row) => (
                  <Line
                    points={[0, row * boxHeight, boardWidth, row * boxHeight]}
                    stroke={this.props.boxStrokeColor}
                    strokeWidth={this.props.boxStrokeWidth}
                    lineCap="square"
                    key={`HorizontalLine_${row}`}
                  />
                ))
              }
            </Group>
          </Group>
          {
            <Rect
              name={`ActiveCellRect`}
              stroke={this.props.activeCellStrokeColor}
              strokeWidth={this.props.activeCellStrokeWidth}
              x={(this.state.activeCellX - 1) * cellSize}
              y={(this.state.activeCellY - 1) * cellSize}
              width={cellSize}
              height={cellSize}
            />
          }
        </Layer>
      </Stage>
    );
  }
}
