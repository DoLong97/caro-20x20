import React, { Component } from 'react';
import Board from '../Board';
import Navigation from "../Navigation";
import { Radio,Button} from 'antd';
import { calculateWinner, includeArray, k, N, check_win_ai_1 } from '../../utils/index';
export let location_end;
export let location_end_ai = [];

let array_location;
let array = new Array(N);
for (let a = 0; a < N; a++)
	array[a] = new Array(N);
for (let i = 0; i < N; i++) {
	for (let j = 0; j < N; j++) {
		array[i][j] = 0;
	}
}
class Game extends Component {
	constructor() {
		super();
		this.state = {
			history: [{
				squares: array,
				checked: {
					x: 0,
					y: 0
				},
			}],
			highLights: [],
			stepNumber: 0,
			xIsNext: true,
			oIxNext: true,
			value: 0,
			tempArray: [],
			playerColor: 1,
			computerColor: 6,
			depth: 1,
		};
	}
	componentWillMount = () => {
		this.getDataArray();
	}

	getDataArray = ()=>{
		let array1 = new Array(N);
		for (let a = 0; a < N; a++)
			array1[a] = new Array(N);
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				array1[i][j] = 0;
			}
		}
		this.setState({ tempArray: array1 });
	}
	async handleClick(x, y) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const tempArray = this.state.tempArray;
		const current = history[history.length - 1];
		const squares = includeArray(current.squares.slice());
		const highLights = this.state.highLights;

		if (highLights.length > 0 || squares[x][y]) {
			return;
		}

		if (this.state.xIsNext) {
			squares[x][y] = "X";
			tempArray[x][y] = 1;
		}
		else {
			squares[x][y] = "O";
			tempArray[x][y] = 1 + k;
		}
		const checked = { x: x + 1, y: y + 1 };
		this.setState({
			history: history.concat([{
				squares,
				checked
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
			tempArray: tempArray,
		},()=>{
			console.log(this.state.history, "history",tempArray);
			let winner = calculateWinner(this.state.tempArray);
			console.log(winner, "winner");
			if (winner) {
				this.updateHighLights(winner);
			}
		});
	}
	async handleClickAi(x, y) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const tempArray = this.state.tempArray;
		const current = history[history.length - 1];
		const squares = includeArray(current.squares.slice());
		const highLights = this.state.highLights;
		const checked = { x: x + 1, y: y + 1 };
		if (highLights.length > 0 || squares[x][y]) {
			return;
		}
		if (this.state.xIsNext) {
			squares[x][y] = "X";
			tempArray[x][y] = 1;
		}
		if (this.state.oIxNext) {
			if (check_win_ai_1) {
				let arr_ai = this.getBestMove(tempArray);
				x = arr_ai[0];
				y = arr_ai[1];
				squares[x][y] = "O";
				tempArray[x][y] = 1 + k;
			}
		}
		location_end_ai.push(x, y);
		if (location_end_ai.length > 2) {
			location_end_ai.splice(0, 2)
		}
		this.setState({
			history: history.concat([{
				squares,
				checked,
			}]),
			stepNumber: history.length,
			xIsNext: this.state.xIsNext,
			tempArray: tempArray,
			oIxNext: this.state.oIxNext
		},()=>{
			let winner = calculateWinner(this.state.tempArray);
			if (winner) {
				this.updateHighLights(winner);
			}
		});

		
	}
	
	jumpTo = (step) => {
		const history = this.state.history.slice(0, step + 1);
		const current = history[history.length - 1];
		const tempArray = this.state.tempArray;
		const highlights = calculateWinner(current.squares) || [];
		this.updateHighLights(highlights);
		this.setState({
			history,
			highLights: [],
			stepNumber: step,
			xIsNext: (step % 2) ? false : true,
			tempArray: tempArray
		});
	}
	handleCheck = (e) => {
		this.setState({
			value: e.target.value
		});
	}
	handleCheckDepth = (e) => {
		this.setState({
			depth: e.target.value
		});
	}
	toggleClear = () => {
		window.location.reload();
		// this.setState({
		// 	history: [{
		// 		squares: array,
		// 		checked: {
		// 			x: 0,
		// 			y: 0
		// 		},
		// 	}],
		// 	highLights: [],
		// 	stepNumber: 0,
		// 	xIsNext: true,
		// 	oIxNext: true,
		// 	value: 0,
		// 	tempArray: [],
		// 	playerColor: 1,
		// 	computerColor: 6,
		// 	depth: 1,
		// },()=>{
		// 	this.getDataArray();
		// 	JSON.parse(JSON.stringify(this.state.history));
		// })
	}
	updateHighLights = (highLights) => {
		this.setState({ highLights });
	}
	getBestMove=(board)=> {
		let node = this.getMatrixCopy(board);
		let bestMove = this.minimax(node, this.state.depth, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, true);
		return bestMove;
	}
	getMatrixCopy=(board)=>{

		return JSON.parse(JSON.stringify(board));
	}

	getEmptySlots=(matrix)=> {
		let emptySlots = [];
		for (let x = 0; x < matrix.length; x++) {
			for (let y = 0; y < matrix[x].length; y++) {
				if (this.itsGoodToPlay(matrix, x, y)) {
					emptySlots.push([x, y]);
				}
			}
		}
		if (emptySlots.length === 0) {
			emptySlots.push([10, 10]);
		}
		return emptySlots;
	}

	itsGoodToPlay=(matrix, x, y)=> {
		if (matrix[x][y] !== 0) {
			return false;
		}
		if ((x + 1 < N && matrix[x + 1][y] !== 0) ||
			(x - 1 > 0 && matrix[x - 1][y] !== 0) ||
			(y + 1 < N && matrix[x][y + 1] !== 0) ||
			(y - 1 > 0 && matrix[x][y - 1] !== 0) ||
			(x + 1 < N && y + 1 < N && matrix[x + 1][y + 1] !== 0) ||
			(x - 1 > 0 && y + 1 < N && matrix[x - 1][y + 1] !== 0) ||
			(x + 1 < N && y - 1 > 0 && matrix[x + 1][y - 1] !== 0) ||
			(x - 1 > 0 && y - 1 > 0 && matrix[x - 1][y - 1] !== 0)) {
			return true;
		}
		return false;
	}

	heuristic=(matrix, iaColor)=> {
		let hValue = 0;
		hValue += this.getVerticalValue(matrix, iaColor);
		hValue += this.getHorizontallValue(matrix, iaColor);
		hValue += this.getFirstDiagonalValue(matrix, iaColor);
		hValue += this.getSecundDiagonalValue(matrix, iaColor);
		return hValue;
	}

	getVerticalValue=(matrix, iaColor)=> {
		let hValue = 0;
		for (let y = 0; y < matrix.length; y++) {
			let xCount = 0;
			let xLength = 0;
			let xSpace = 0;
			let xColor = 0;
			let xBlocked = 0;
			let xSpaceAfter = 0;
			for (let x = 0; x < matrix[y].length; x++) {
				if (xLength === 0 && x > N-5) {
					break;
				}
				if (matrix[x][y] === 0) {
					if (xLength === 0) {
						continue;
					} else {
						xCount++;
						xSpace++;
						xSpaceAfter++;
					}
				} else {
					if (xLength === 0) {
						xCount = 1;
						xLength = 1;
						xColor = matrix[x][y];
					} else {
						if (matrix[x][y] === xColor) {
							xCount++;
							xLength++;
							xSpaceAfter = 0;
							if (x < 5) {
								xBlocked = 1;
							}
						} else {
							if (xBlocked === 0) {
								xBlocked = 1;
								hValue += this.getTupleValue(xLength, xSpace - xSpaceAfter, xBlocked, xColor, iaColor);
							}
							xCount = 1;
							xLength = 1;
							xBlocked = 1;
							xSpace = 0;
							xColor = matrix[x][y];
							xSpaceAfter = 0;
						}
					}
				}
				if (xCount === 5) {
					hValue += this.getTupleValue(xLength, xSpace - xSpaceAfter, xBlocked, xColor, iaColor);
					xCount = 0;
					xLength = 0;
					xColor = 0;
					xBlocked = 0;
					xSpace = 0;
					xSpaceAfter = 0;
				}
			}
		}
		return hValue;
	}

	getHorizontallValue=(matrix, iaColor)=> {
		let hValue = 0;
		for (let x = 0; x < matrix.length; x++) {
			let xCount = 0;
			let xLength = 0;
			let xSpace = 0;
			let xColor = 0;
			let xBlocked = 0;
			let xSpaceAfter = 0;
			for (let y = 0; y < matrix[x].length; y++) {
				if (xLength === 0 && y > N-5) {
					break;
				}
				if (matrix[x][y] === 0) {
					if (xLength === 0) {
						continue;
					} else {
						xCount++;
						xSpace++;
						xSpaceAfter++;
					}
				} else {
					if (xLength === 0) {
						xCount = 1;
						xLength = 1;
						xColor = matrix[x][y];
					} else {
						if (matrix[x][y] === xColor) {
							xCount++;
							xLength++;
							xSpaceAfter = 0;
							if (x < 5) {
								xBlocked = 1;
							}
						} else {
							if (xBlocked === 0) {
								xBlocked = 1;
								hValue += this.getTupleValue(xLength, xSpace - xSpaceAfter, xBlocked, xColor, iaColor);
							}
							xCount = 1;
							xLength = 1;
							xBlocked = 1;
							xSpace = 0;
							xColor = matrix[x][y];
							xSpaceAfter = 0;
						}
					}
				}
				if (xCount === 5) {
					hValue += this.getTupleValue(xLength, xSpace - xSpaceAfter, xBlocked, xColor, iaColor);
					xCount = 0;
					xLength = 0;
					xColor = 0;
					xBlocked = 0;
					xSpace = 0;
					xSpaceAfter = 0;
				}
			}
		}
		return hValue;
	}

	getFirstDiagonalValue=(matrix, iaColor)=> {
		let hValue = 0;
		let coluna = 0;
		let counter = 0;
		for (let linha = 0; linha < N-5; linha++) {
			let dCount = 0;
			let dLength = 0;
			let dSpace = 0;
			let dColor = 0;
			let dBlocked = 0;
			let dSpaceAfter = 0;
			for (let i = 0; i < matrix.length; i++) {
				let x = coluna + i;
				let y = linha + i;
				if (x > N-1 || y > N-1) {
					break;
				}
				if (dLength === 0 && x > N-5) {
					break;
				}
				if (matrix[x][y] === 0) {
					if (dLength === 0) {
						continue;
					} else {
						dCount++;
						dSpace++;
						dSpaceAfter++;
					}
				} else {
					if (dLength === 0) {
						dCount = 1;
						dLength = 1;
						dColor = matrix[x][y];
					} else {
						if (matrix[x][y] === dColor) {
							dCount++;
							dLength++;
							dSpaceAfter = 0;
							if (x < 5) {
								dBlocked = 1;
							}
						} else {
							if (dBlocked === 0) {
								dBlocked = 1;
								hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
							}
							dCount = 1;
							dLength = 1;
							dBlocked = 1;
							dSpace = 0;
							dColor = matrix[x][y];
							dSpaceAfter = 0;
						}
					}
				}
				if (dCount === 5) {
					hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
					dCount = 0;
					dLength = 0;
					dColor = 0;
					dBlocked = 0;
					dSpace = 0;
					dSpaceAfter = 0;
				}
				if (matrix[coluna + i][linha + i] === 1) {
					counter++;
				}
			}
			if (dLength > 0) {
				hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
			}
		}
		let linha = 0;
		for (coluna = 1; coluna < N-5; coluna++) {
			let dCount = 0;
			let dLength = 0;
			let dSpace = 0;
			let dColor = 0;
			let dBlocked = 0;
			let dSpaceAfter = 0;
			for (let i = 0; i < matrix.length; i++) {
				let x = coluna + i;
				let y = linha + i;
				if (x > N-1 || y > N-1) {
					break;
				}
				if (dLength === 0 && x > N-5) {
					break;
				}
				if (matrix[x][y] === 0) {
					if (dLength === 0) {
						continue;
					} else {
						dCount++;
						dSpace++;
						dSpaceAfter++;
					}
				} else {
					if (dLength === 0) {
						dCount = 1;
						dLength = 1;
						dColor = matrix[x][y];
					} else {
						if (matrix[x][y] === dColor) {
							dCount++;
							dLength++;
							dSpaceAfter = 0;
							if (x < 5) {
								dBlocked = 1;
							}
						} else {
							if (dBlocked === 0) {
								dBlocked = 1;
								hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
							}
							dCount = 1;
							dLength = 1;
							dBlocked = 1;
							dSpace = 0;
							dColor = matrix[x][y];
							dSpaceAfter = 0;
						}
					}
				}
				if (dCount === 5) {
					hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
					dCount = 0;
					dLength = 0;
					dColor = 0;
					dBlocked = 0;
					dSpace = 0;
					dSpaceAfter = 0;
				}
				if (matrix[coluna + i][linha + i] === 1) {
					counter++;
				}
			}
			if (dLength > 0) {
				hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
			}
		}
		return hValue;
	}

	getSecundDiagonalValue=(matrix, iaColor)=> {
		let hValue = 0;
		let counter = 0;
		for (let linha = N-1; linha >= 4; linha--) {
			let dCount = 0;
			let dLength = 0;
			let dSpace = 0;
			let dColor = 0;
			let dBlocked = 0;
			let dSpaceAfter = 0;
			for (let i = 0; i < matrix.length; i++) {
				let x = linha - i;
				let y = i;
				if (x < 0) {
					break;
				}
				if (matrix[x][y] !== 0) {
					counter++;
				}
				if (matrix[x][y] === 0) {
					if (dLength === 0) {
						continue;
					} else {
						dCount++;
						dSpace++;
						dSpaceAfter++;
					}
				} else {
					if (dLength === 0) {
						dCount = 1;
						dLength = 1;
						dColor = matrix[x][y];
					} else {
						if (matrix[x][y] === dColor) {
							dCount++;
							dLength++;
							dSpaceAfter = 0;
						} else {
							if (dBlocked === 0) {
								dBlocked = 1;
								hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
							}
							dCount = 1;
							dLength = 1;
							dBlocked = 1;
							dSpace = 0;
							dColor = matrix[x][y];
							dSpaceAfter = 0;
						}
					}
				}
				if (dCount === 5) {
					hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
					dCount = 0;
					dLength = 0;
					dColor = 0;
					dBlocked = 0;
					dSpace = 0;
					dSpaceAfter = 0;
				}
				if (matrix[x][y] === 1) {
					counter++;
				}
			}
			if (dLength > 0) {
				hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
			}
		}
		for (let coluna = 1; coluna < N-4; coluna++) {
			let dCount = 0;
			let dLength = 0;
			let dSpace = 0;
			let dColor = 0;
			let dBlocked = 0;
			let dSpaceAfter = 0;
			for (let i = 0; i < matrix.length; i++) {
				let x = N-1 - i;
				let y = coluna + i;
				if (x < 0 || y > N-1) {
					break;
				}
				if (matrix[x][y] === 0) {
					if (dLength === 0) {
						continue;
					} else {
						dCount++;
						dSpace++;
						dSpaceAfter++;
					}
				} else {
					if (dLength === 0) {
						dCount = 1;
						dLength = 1;
						dColor = matrix[x][y];
					} else {
						if (matrix[x][y] === dColor) {
							dCount++;
							dLength++;
							dSpaceAfter = 0;
						} else {
							if (dBlocked === 0) {
								dBlocked = 1;
								hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
							}
							dCount = 1;
							dLength = 1;
							dBlocked = 1;
							dSpace = 0;
							dColor = matrix[x][y];
							dSpaceAfter = 0;
						}
					}
				}
				if (dCount === 5) {
					hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
					dCount = 0;
					dLength = 0;
					dColor = 0;
					dBlocked = 0;
					dSpace = 0;
					dSpaceAfter = 0;
				}
			}
			if (dLength > 0) {
				hValue += this.getTupleValue(dLength, dSpace - dSpaceAfter, dBlocked, dColor, iaColor);
			}
		}
		return hValue;
	}


	getTupleValue=(length, spaces, blocked, color, iaColor)=> {
		let value = 0;
		if (color === iaColor) {
			if (length > 1) {
				value += this.group(length) * this.modifier(spaces, blocked);
			} else {
				value++;
			}
		} else {
			if (length > 1) {
				value -= this.group(length) * this.modifier(spaces, blocked);
			} else {
				value--;
			}
		}
		return value;
	}

	group=(length)=> {
		let value = 0;
		switch (length) {
			case 2:
				value = 600;
				break;
			case 3:
				value = 600 * 300;
				break;
			case 4:
				value = 600 * 300 * 150;
				break;
			case 5:
				value = 600 * 300 * 150 * 150;
		}
		return value;
	}

	modifier=(spaces, blocked)=> {
		return 10 - spaces - (blocked * 4);
	}

	minimax=(node, depth, alpha, beta, maximizing)=> {
		let v = Number.MIN_SAFE_INTEGER;
		let children = this.getEmptySlots(node);
		let bestPlay = [];
		let bestValue = Number.MIN_SAFE_INTEGER;

		for (let i = 0; i < children.length; i++) {

			let x = children[i][0];
			let y = children[i][1];

			node[x][y] = this.state.computerColor;
			v = this.minimaxNext(node, depth - 1, alpha, beta, false);
			node[x][y] = 0;

			if (bestValue < v) {
				bestPlay = [];
				bestValue = v;
				bestPlay.push(x);
				bestPlay.push(y);
			}

			alpha = Math.max(alpha, v);

			if (beta <= alpha) {
				break;
			}
		}
		return bestPlay;
	}

	minimaxNext=(node, depth, alpha, beta, maximizing)=> {


		if (depth === 0) {
			let totalHeuristic = this.heuristic(node, this.state.computerColor);
			return totalHeuristic;
		}

		if (maximizing) {
			let v = Number.MIN_SAFE_INTEGER;
			let children = this.getEmptySlots(node);

			for (let i = 0; i < children.length; i++) {
				let x = children[i][0];
				let y = children[i][1];
				node[x][y] = this.state.computerColor;

				v = Math.max(v, this.minimaxNext(node, depth - 1, alpha, beta, false));
				alpha = Math.max(alpha, v);
				node[x][y] = 0;

				if (beta <= alpha) {
					break;
				}
			}
			return v;
		} else {	// minimizing
			let v = Number.MAX_SAFE_INTEGER;
			let children = this.getEmptySlots(node);

			for (let i = 0; i < children.length; i++) {
				let x = children[i][0];
				let y = children[i][1];

				node[x][y] = this.state.playerColor;


				v = Math.min(v, this.minimaxNext(node, depth - 1, alpha, beta, true));
				beta = Math.min(beta, v);
				node[x][y] = 0;

				if (beta <= alpha) {
					break;
				}
			}
			return v;
		}
	}
	
	render() {
		const { highLights, history, stepNumber, xIsNext, value } = this.state;
		const current = history[stepNumber];
		let history_copy = JSON.parse(JSON.stringify(history));
		if (history_copy.length > 1) {
			array_location = history_copy.pop();
			location_end = (`${array_location.checked.x},${array_location.checked.y}`);
		}
		let status;
		if (highLights.length > 0) {
			const { x, y } = highLights[0];
			let winnerSymbol = current.squares[x - 1][y - 1];
			status = `Winner: ${winnerSymbol}`;
		} else if (highLights.length === 0 && history.length < N * N) {
			status = `Next Player: ${(xIsNext) ? "X" : "O"}`;
		} else status = `Nobody Win!`

		const radioStyle = {
			display: 'block',
			height: '20px',
			lineHeight: '20px',
			color: "#EC1414",
			fontSize: "20px",
			marginTop: "30px"
		};
		const radioStyle1 = {
			color: "#FF00FF",
			lineHeight: '20px',
			fontSize: "20px",
			marginTop: "30px",
			textAlign: "center",
			paddingRight: "20px"
		};
		const radioStyle2 = {
			background: "#3366ff",
			color: "#ffffb3",
			width: "120px",
			height: "40px",
			marginTop: "70px", 
			marginLeft: "40px",
			borderRadius: "10px",
			fontSize: "20px",
			cursor: 'pointer' 
		};
		return (
			<div className="game">
				<div className="game-board">
					<h1 style={{ textAlign: "center", color: "#ffffb3", fontSize: "35px" }}>Caro Game</h1>
					<div className="game-board-box">
					<Board
						highLights={highLights}
						squares={current.squares}
						onClick={(x, y) => (value === 1) ? this.handleClick(x, y) : (value === 2) ? this.handleClickAi(x, y) : alert("Bạn Vui Lòng Chọn Đối Thủ!")} />
					</div>
				</div>
				<div className="game-info">
					<div style={{ color: "#7FFFD4", fontSize: "25px",marginLeft: "20px" }}><span>{status}</span></div>
					<Radio.Group onChange={(e) => this.handleCheckDepth(e)} value={this.state.depth}>
						<h1 style={{ textAlign: "center", color: "#ffffb3", fontSize: "30px" }}>Level</h1>
						<Radio style={radioStyle1} value={1}>1</Radio>
						<Radio style={radioStyle1} value={2}>2</Radio>
						<Radio style={radioStyle1} value={3}>3</Radio>
						<Radio style={radioStyle1} value={4}>4</Radio>
					</Radio.Group>
					<Radio.Group onChange={(e) => this.handleCheck(e)} value={this.state.value} >
						<Radio style={radioStyle} value={1}>
						Players
      				  </Radio>
						<Radio style={radioStyle} value={2}>
						Player-Machine
       				 </Radio>
					</Radio.Group>

					<Navigation stepNumber={this.state.stepNumber}
						historyLength={history.length}
						onClick={() =>this.jumpTo()} />

					<Button  style={radioStyle2} onClick={() => this.toggleClear()} >
						New Game
       			   </Button><br />

				</div>
			</div>

		);
	}
}

export default Game;
