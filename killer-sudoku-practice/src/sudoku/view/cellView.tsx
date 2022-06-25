import { KonvaEventObject } from 'konva/lib/Node';
import React, { Component } from 'react';
import { Stage, Layer, Star, Text, Rect, Group } from 'react-konva';
import { range } from '../../util/util';
import { Cell } from '../parts';
import { SudokuPuzzle } from '../puzzle';
// import './FileDragDrop.css'
import { BasicSudokuPuzzle } from '../puzzle/basic_sudoku_puzzle';
import { SudokuSolver } from '../solver/sudoku_solver';

interface Props {
  cell: Cell,
  sudoku: BasicSudokuPuzzle,
  cellSize: number,
  clueColor: string,
  textColor: string,
  borderColor: string,
  cellColor: string,
  gridStrokeWidth: number,
  fontFamily: string,
  activeFunc: (x: number, y: number) => void
}
interface State {
  sudoku: BasicSudokuPuzzle,
  activeCellX: number,
  activeCellY: number
}

export class CellView extends Component<Props, State> {
  static defaultProps = {
    cellSize: 55,
    clueColor: '#663344',
    textColor: '#dd5577',
    borderColor: '#663344',
    cellColor: '#ffffff',
    gridStrokeWidth: 1,
    fontFamily: '',
  };
  constructor(props: any) {
    super(props);
    this.state = {
      sudoku: this.props.sudoku,
      activeCellX: 1,
      activeCellY: 1
    };
  }

  render() {
    const cell: Cell = this.props.cell;
    const cellSize: number = this.props.cellSize;
    const fontSize: number = cellSize * 0.65;
    const noteFontSize: number = cellSize * 0.2;
    const dy: number = fontSize * 0.05
    const noteHeight = Math.ceil(Math.sqrt(cell.maxNumber))
    const noteWidth = (cell.maxNumber / noteHeight) | 0;
    const noteCellSize = cellSize / noteWidth;

    var textElement = 
      <Text
        name={`CellText_${cell.x}_${cell.y}`}
        text={cell.str("")}
        fontSize={fontSize}
        fontFamily={this.props.fontFamily}
        fill={cell.hasClue() ? this.props.clueColor : this.props.textColor}
        y={dy}
        width={cellSize}
        height={cellSize - dy}
        align='center'
        verticalAlign='middle'
      />;

    var noteElement = range(1, cell.maxNumber + 1).map((n) => (
      <Text
        name={`CellNote_${cell.x}_${cell.y}_${n}`}
        text={cell.notes.has(n) ? `${n}`: ""}
        fontSize={noteFontSize}
        fontFamily={this.props.fontFamily}
        fill={this.props.textColor}
        x={(n%noteWidth) * noteCellSize}
        y={(n/noteWidth | 0) * noteCellSize}
        width={noteCellSize}
        height={noteCellSize}
        align='center'
        verticalAlign='middle'
        key={`CellNote_${cell.x}_${cell.y}_${n}`}
      />
      )
    )
      

    return (
      <Group
        name={`Cell_${cell.x}_${cell.y}`}
        x={(cell.x - 1) * cellSize}
        y={(cell.y - 1) * cellSize}
        width={cellSize}
        height={cellSize}
        onClick={(event) => {
          this.props.activeFunc(cell.x, cell.y);
        }}>
        <Rect
          name={`CellRect_${cell.x}_${cell.y}`}
          stroke={this.props.borderColor}
          strokeWidth={this.props.gridStrokeWidth}
          fill={this.props.cellColor}
          width={cellSize}
          height={cellSize}
        />
        {cell.isEmpty() ? noteElement: textElement}
      </Group>
    );
  }
}
