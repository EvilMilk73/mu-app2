import React, { Component } from 'react';
export class TicTacToe extends Component {
    static displayName = TicTacToe.name;

    constructor(props) {
        super(props);
          this.state = { Squares: Array(9).fill(null), Xnext: true, gameState: "nobody"};
          
      }

    render() {
        
        return (
            <>
            <p>Winner: {this.state.gameState}</p>
            {this.RenderFunc()}
            </>
            
        );
    }

    handleClick (i){
        if(this.state.Squares[i] != null){
            return;
        }
        
        let newSquares = this.state.Squares.slice();
        
        if(this.state.Xnext){
            newSquares[i] = "X";
            this.setState({Xnext: false});
        }else{
            newSquares[i] = "O";
            this.setState({Xnext: true});
        }      
         this.setState({Squares: newSquares});
         
         if(this.calculateWinner(newSquares)){
            console.log(this.calculateWinner(newSquares));
            this.setState({gameState: this.calculateWinner(newSquares)})
            return;
         }
     }
    RenderFunc  () {

         

        return <>
            <div className="board-row">
                <this.Square value={this.state.Squares[0]}  onSquareClick={() => this.handleClick(0)}/>
                <this.Square value={this.state.Squares[1]}  onSquareClick={() => this.handleClick(1)}/>
                <this.Square value={this.state.Squares[2]}  onSquareClick={() => this.handleClick(2)}/>
            </div>
            <div className="board-row">
                <this.Square value={this.state.Squares[3]} onSquareClick={() => this.handleClick(3)}/>
                <this.Square value={this.state.Squares[4]} onSquareClick={() => this.handleClick(4)}/>
                <this.Square value={this.state.Squares[5]} onSquareClick={() => this.handleClick(5)}/>
            </div>
            <div className="board-row">
                <this.Square value={this.state.Squares[6]} onSquareClick={() => this.handleClick(6)}/>
                <this.Square value={this.state.Squares[7]} onSquareClick={() => this.handleClick(7)}/>
                <this.Square value={this.state.Squares[8]} onSquareClick={() => this.handleClick(8)}/>
            </div>
        </>;
    }

    Square ({value,  onSquareClick }){
        
       

       return <button style={{width: 40, height: 40, verticalAlign: 'top'}}
       onClick={onSquareClick }
       className="square"
       >
        {value}
        </button>;
    }
    calculateWinner(squares) {
        
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
      }

}