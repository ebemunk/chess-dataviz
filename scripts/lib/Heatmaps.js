'use strict';

let _ = require('lodash');

class Heatmaps {
	constructor() {
		this.counters = [
			'squareUtilization',
			'moveSquares',
			'captureSquares',
			'checkSquares'
		];

		this.data = {};

		this.counters.forEach(counter => {
			this.data[counter] = [];

			for( let i of _.range(64) ) {
				this.data[counter][i] = {
					p: {w: 0, b: 0},
					n: {w: 0, b: 0},
					b: {w: 0, b: 0},
					r: {w: 0, b: 0},
					q: {w: 0, b: 0},
					k: {w: 0, b: 0},
					all: {w: 0, b: 0}
				};
			}
		});
	}

	update(moves) {
		moves.forEach((move, i) => {
			let piece = (/[NBRQK]/.test(move[0]) ? move[0] : 'P').toLowerCase();

			if( piece !== 'p' ) {
				move = move.substr(1);
			}

			let fromTo = move.split(/[x\-]/);

			//an array in case of castling its K and R move
			let parsedMoves = [];


			//O-O white
			if( /e1-g1/.test(move) ) {
				parsedMoves.push({
					from: this.squareToIndex('e1'),
					to: this.squareToIndex('g1'),
					piece: 'k',
					color: 'w',
					capture: false,
					check: /\+/.test(move)
				});

				parsedMoves.push({
					from: this.squareToIndex('h1'),
					to: this.squareToIndex('f1'),
					piece: 'r',
					color: 'w',
					capture: false,
					check: /\+/.test(move)
				});
			}

			//O-O-O white
			else if( /e1-c1/.test(move) ) {
				parsedMoves.push({
					from: this.squareToIndex('e1'),
					to: this.squareToIndex('c1'),
					piece: 'k',
					color: 'w',
					capture: false,
					check: /\+/.test(move)
				});

				parsedMoves.push({
					from: this.squareToIndex('a1'),
					to: this.squareToIndex('d1'),
					piece: 'r',
					color: 'w',
					capture: false,
					check: /\+/.test(move)
				});
			}

			//O-O black
			else if( /e8-g8/.test(move) ) {
				parsedMoves.push({
					from: this.squareToIndex('e8'),
					to: this.squareToIndex('g8'),
					piece: 'k',
					color: 'b',
					capture: false,
					check: /\+/.test(move)
				});

				parsedMoves.push({
					from: this.squareToIndex('h8'),
					to: this.squareToIndex('f8'),
					piece: 'r',
					color: 'b',
					capture: false,
					check: /\+/.test(move)
				});
			}

			//O-O-O black
			else if( /e8-c8/.test(move) ) {
				parsedMoves.push({
					from: this.squareToIndex('e8'),
					to: this.squareToIndex('c8'),
					piece: 'k',
					color: 'b',
					capture: false,
					check: /\+/.test(move)
				});

				parsedMoves.push({
					from: this.squareToIndex('a8'),
					to: this.squareToIndex('d8'),
					piece: 'r',
					color: 'b',
					capture: false,
					check: /\+/.test(move)
				});
			}

			else {
				parsedMoves.push({
					from: this.squareToIndex(fromTo[0]),
					to: this.squareToIndex(fromTo[1]),
					piece: piece,
					color: i % 2 === 0 ? 'w' : 'b',
					capture: /x/.test(move),
					check: /\+/.test(move)
				});
			}

			this.counters.forEach(counter => {
				parsedMoves.forEach(parsedMove => {
					this[counter](parsedMove);
				});
			});
		});
	}

	squareToIndex(square) {
		square = square.toLowerCase();

		let file = square.charCodeAt(0) - 97;
		let rank = 8 - square[1];
		let index = rank * 8 + file;

		return index;
	}

	squareUtilization(move) {
		this.data.squareUtilization[move.to][move.piece][move.color]++;
		this.data.squareUtilization[move.to].all[move.color]++;
	}

	moveSquares(move) {
		this.data.moveSquares[move.from][move.piece][move.color]++;
		this.data.moveSquares[move.from].all[move.color]++;
	}

	captureSquares(move) {
		if( move.capture ) {
			this.data.captureSquares[move.to][move.piece][move.color]++;
			this.data.captureSquares[move.to].all[move.color]++;
		}
	}

	checkSquares(move) {
		if( move.check ) {
			this.data.checkSquares[move.to][move.piece][move.color]++;
			this.data.checkSquares[move.to].all[move.color]++;
		}
	}
}

module.exports = Heatmaps;