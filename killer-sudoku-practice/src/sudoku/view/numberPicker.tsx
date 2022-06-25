import { KonvaEventObject } from 'konva/lib/Node';
import React, { Component } from 'react';
import { range } from '../../util/util';
import { Cell } from '../parts';
import { SudokuPuzzle } from '../puzzle';
// import './FileDragDrop.css'
import { BasicSudokuPuzzle } from '../puzzle/basic_sudoku_puzzle';
import './numberPicker.css'

interface Props {
  sudoku: BasicSudokuPuzzle,
  itemSize: number,
  textColor: string,
  borderColor: string,
  cellColor: string,
  gridStrokeWidth: number,
  fontFamily: string,
  setPickedNumberFunc: (num: number) => void
}
interface State {
  sudoku: BasicSudokuPuzzle,
  activeCellX: number,
  activeCellY: number
}

export class NumberPicker extends Component<Props, State> {
  static defaultProps = {
    itemSize: 55,
    textColor: '#663344',
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
    const sudoku: BasicSudokuPuzzle = this.state.sudoku;
    const itemSize: number = this.props.itemSize;

    return (
      <div className="number-picker">
         {
           range(1, sudoku.maxNumber + 1).map((num) => 
             (<button className='number-picker-button'
                onClick={(event) => {
                  this.props.setPickedNumberFunc(num);
                }}
                key={`number-picker-button-${num}`}>{num}</button>)
           )
         }
      </div>
    );
  }
}
