// Copyright (C) 2021 xuefa
// 
// This file is part of kilobyte.
// 
// kilobyte is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// kilobyte is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with kilobyte.  If not, see <http://www.gnu.org/licenses/>.

function columns<T>(grid: T[][]): T[][] {
	const result: T[][] = []
	const rows = grid.length;
	const columns = grid[0].length;
	for (let i = 0; i < columns; i++) {
		let row: T[] = []
		for (let j = 0; j < rows; j++) {
			row.push(grid[j][i]);
		}
		result.push(row);
	}
	return result;
}

enum Direction {
	Up,
	Down,
	Left,
	Right,
}

class Board {
	cells: (number | null)[][]

	constructor() {
		const cells = new Array(4);
		for (let i = 0; i < 4; i++) {
			cells[i] = new Array(4).fill(null);
		}
		this.cells = cells
	}

	toTable(cellColors: (cell: number | null) => string, cellToString: (cell: number | null) => string): string {
		const tableCells = this.cells.map(row => row.map(cell => `<td style="background-color: ${cellColors(cell)}">${cellToString(cell)}</td>`));
		const rows = tableCells.map(row => `<tr>${"".concat(...row)}</tr>`)
		return "".concat(...rows);
	}

	insert2() {
		let cell: [number, number] = [Math.floor(Math.random() * 4), Math.floor(Math.random() * 4)];
		if (this.cells[cell[0]][cell[1]] === null) {
			this.cells[cell[0]][cell[1]] = 1
		} else {
			this.insert2();
		}
	}

	move(direction: Direction) {
		switch (direction) {
			case Direction.Up:
				this.moveUp();
				break;
			case Direction.Down:
				this.moveDown();
				break;
			case Direction.Left:
				this.moveLeft();
				break;
			case Direction.Right:
				this.moveRight();
				break;
		}
	}

	private moveRight() {
		const filteredBoard = this.cells.map(row => row.filter(cell => cell !== null));
		filteredBoard.forEach((row, index) => {
			let missing = 4 - row.length;
			this.cells[index] = Array(missing).fill(null).concat(row);
		});
	}

	private moveLeft() {
		const filteredBoard = this.cells.map(row => row.filter(cell => cell !== null));
		filteredBoard.forEach((row, index) => {
			let missing = 4 - row.length;
			this.cells[index] = row.concat(Array(missing).fill(null));
		});
	}

	private moveDown() {
		const cellColumns = columns(this.cells);
		const filteredBoard = cellColumns.map(row => row.filter(cell => cell !== null));
		filteredBoard.forEach((row, index) => {
			let missing = 4 - row.length;
			cellColumns[index] = Array(missing).fill(null).concat(row);
		});
		this.cells = columns(cellColumns);
	}

	private moveUp() {
		const cellColumns = columns(this.cells);
		const filteredBoard = cellColumns.map(row => row.filter(cell => cell !== null));
		filteredBoard.forEach((row, index) => {
			let missing = 4 - row.length;
			cellColumns[index] = row.concat(Array(missing).fill(null));
		});
		this.cells = columns(cellColumns);
	}

	horizontalCombineNumbers() {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < (i === 3 ? 3 : 4); j++) {
				const nextCell = this.nextCellIndex(i, j);
				if (this.cells[i][j] === this.cells[nextCell[0]][nextCell[1]]) {
					const cell = this.cells[i][j]
					let total = cell === null ? null : cell + 1;
					this.cells[i][j] = total;
					this.cells[nextCell[0]][nextCell[1]] = null;
				}
			}
		}
	}

	verticalCombineNumbers() {
		const cellColumns = columns(this.cells);
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < (i === 3 ? 3 : 4); j++) {
				const nextCell = this.nextCellIndex(i, j);
				if (cellColumns[i][j] === cellColumns[nextCell[0]][nextCell[1]]) {
					const cell = cellColumns[i][j]
					let total = cell === null ? null : cell + 1;
					cellColumns[i][j] = total;
					cellColumns[nextCell[0]][nextCell[1]] = null;
				}
			}
		}
		this.cells = columns(cellColumns);
	}

	private nextCellIndex(row: number, column: number): [number, number] {
		return column === 3 ? [row + 1, 0] : [row, column + 1];
	}
}

function drawTable() {
	document.getElementById("board")!.innerHTML = board.toTable(cell => {
		switch (cell) {
			case 1:
				return "#eee4da";
			case 2:
				return "#ede0c8";
			case 3:
				return "#f2b179";
			case 4:
				return "#f59563";
			case 5:
				return "#f67c5f";
			case 6:
				return "#f65e3b";
			case 7:
				return "#edcf72";
		}
		return "white";
	}, cell => {
		switch (cell) {
			case null:
				return "";
			case 9:
				return "Bootloader";
			case 10:
				return "1KB";
			default:
				return `${(2 ** cell).toString()}B`;
		}
	});
}

function keyToDirection(key: string): Direction | null {
	switch (key) {
		case "Down":
		case "ArrowDown":
			return Direction.Down;
		case "Up":
		case "ArrowUp":
			return Direction.Up;
		case "Left":
		case "ArrowLeft":
			return Direction.Left;
		case "Right":
		case "ArrowRight":
			return Direction.Right;
	}
	return null;
}

const board = new Board();
board.insert2();
board.insert2();
drawTable();

document.onkeydown = e => {
	let direction = keyToDirection(e.key);
	switch (e.key) {
		case "Left":
		case "ArrowLeft":
		case "Right":
		case "ArrowRight":
			e.preventDefault();
			board.move(direction!!);
			board.horizontalCombineNumbers();
			board.move(direction!!);
			board.insert2();
			drawTable();
			break;
		case "Down":
		case "ArrowDown":
		case "Up":
		case "ArrowUp":
			e.preventDefault();
			board.move(direction!!);
			board.verticalCombineNumbers();
			board.move(direction!!);
			board.insert2();
			drawTable();
			break;
	}
}
