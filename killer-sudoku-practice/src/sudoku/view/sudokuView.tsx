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

interface Props {
  cellSize: number,
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
  pickedNumber: number
}

export class SudokuView extends Component<Props, State> {
  static defaultProps = {
    cellSize: 55,
    textColor: '#663344',
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
      pickedNumber: 0
    };

    this.setActiveCell = this.setActiveCell.bind(this);
    this.setPickedNumber = this.setPickedNumber.bind(this);

    const boardString: string = this.state.sudoku.boardString()
    console.log(boardString)
    for (let y=1; y<=9; y++) {
      let a = ""
      for (let x=1; x<=9; x++) {
        a += this.state.sudoku.cellAt(x, y).str();
      }
      console.log(a);
    }
    console.log(this.state.sudoku.boardCandidateString())
    console.log("solve")
    SudokuSolver.solve(this.state.sudoku);
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
    const activeCellStr: string = sudoku.cellAt(ax, ay).str()
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
      // <p>{boardString}</p>
      // <Dropzone onDrop={this.onDrop} multiple={false} >
      //   {({ getRootProps, getInputProps }) => (
      //     <section className="container">
      //       <div {...getRootProps({ className: 'dropzone' })}>
      //         <input {...getInputProps()} />
      //         <p>Drag 'n' drop some files here, or click to select files</p>
      //       </div>
      //       <aside>
      //         <h4>Files</h4>
      //         <ul>{files}</ul>
      //         {layers}
      //       </aside>
      //     </section>
      //   )}
      // </Dropzone>
      <div id="sudoku">
      <Stage x={padding} y={padding} width={stageWidth} height={stageHeight} >
      <Layer>
        {/* <Rect
          stroke={this.props.borderColor} strokeWidth={1}
          width={boardWidth} height={boardHeight} /> */}
        {
          sudoku.board.map((cell, index) => (
            <CellView 
              cell={cell}
              sudoku={this.state.sudoku} 
              cellSize={this.props.cellSize}
              textColor={this.props.textColor}
              borderColor={this.props.gridColor}
              cellColor={this.getCellColor(cell.x, cell.y)}
              gridStrokeWidth={this.props.gridStrokeWidth}
              fontFamily={this.props.fontFamily}
              activeFunc={this.setActiveCell}
              key={index}
            />
            // <Group
            //   name={`Cell_${cell.x}_${cell.y} `}
            //   cellX={cell.x}
            //   cellY={cell.y}
            //   x={(cell.x - 1) * cellSize} y={(cell.y - 1) * cellSize}
            //   width={cellSize} height={cellSize}
            //   onClick={ (event) => {
            //     console.log(event.target)
            //     console.log(event.target.parent)
            //   }}>
            //   <Rect
            //     name={`CellRect_${cell.x}_${cell.y} `}
            //     stroke={this.props.gridColor} strokeWidth={1} fill={this.getCellColor(cell.x, cell.y)}
            //     x={0.5} y={0.5} width={cellSize} height={cellSize} />
            //   <Text
            //     name={`CellText_${cell.x}_${cell.y} `}
            //     text={cell.str()} fontSize={fontSize} fontFamily='Roboto Mono'
            //     fill={this.props.textColor}
            //     y={fontSize * 0.02} width={cellSize} height={cellSize - fontSize * 0.02}
            //     align='center' verticalAlign='middle' />
            // </Group>
          ))
        }
        {
          range(sudoku.boxWidth + 1).map((col) => (
            <Line 
              points={[col*boxWidth, 0, col*boxWidth, boardHeight]}
              stroke={this.props.boxStrokeColor}
              strokeWidth={this.props.boxStrokeWidth}
              lineCap="square"
              key={`VerticalLine_${col}`}
            />
          ))
        }
        {
          range(sudoku.boxHeight + 1).map((row) => (
            <Line 
              points={[0, row*boxHeight, boardWidth, row*boxHeight]}
              stroke={this.props.boxStrokeColor}
              strokeWidth={this.props.boxStrokeWidth}
              lineCap="square"
              key={`HorizontalLine_${row}`}
            />
          ))
        }
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
    <SudokuController
      sudoku={this.state.sudoku}
      setPickedNumberFunc={this.setPickedNumber} />
    </div>
    );
  }
}
