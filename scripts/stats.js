/*eslint no-console: 0*/
/*eslint no-unused-vars: 0*/

'use strict';

let debug = require('debug')('stats');

let Promise = require('bluebird');
let fs = Promise.promisifyAll(require('fs'));
let Chess = require('chess.js').Chess;
let _ = require('lodash');

let minimist = require('minimist');
let colors = require('colors');
let pace = require('pace');

let argv = minimist(process.argv.slice(2), {
	alias: {
		file: 'f'
	},
	default: {
		file: 'data/games.pgn'
	}
});

debug('  source file'.cyan, argv.file);

Promise.coroutine(processPGNFile)(argv.file)
.then(function (heatmap) {
	return fs.writeFileAsync(argv.file.split('.pgn')[0] + '_statistics.json', JSON.stringify(heatmap.data, null, 4));
})
.then(function () {
	console.log('  all good'.green);
});

function* processPGNFile(filename) {
	let file = yield fs.readFileAsync(filename, {encoding: 'utf8'});

	let games = file.split(/\r?\n\r?\n(?=\[)/g);
	let bar = pace(games.length);
	let chessGame = new Chess();
	var heatmap = new Heatmap();

	games.map(part => {
		chessGame.reset();
		chessGame.load_pgn(part);
		let moves = chessGame.history({verbose: true});

		heatmap.update(moves);

		bar.op();
	});

	return heatmap;
}

class Heatmap {
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
		moves.forEach(move => {
			move.toIndex = this.squareToIndex(move.to);
			move.fromIndex = this.squareToIndex(move.from);

			this.counters.forEach(counter => {
				this[counter](move);
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
		this.data.squareUtilization[move.toIndex][move.piece][move.color]++;
		this.data.squareUtilization[move.toIndex].all[move.color]++;
	}

	moveSquares(move) {
		this.data.moveSquares[move.fromIndex][move.piece][move.color]++;
		this.data.moveSquares[move.fromIndex].all[move.color]++;
	}

	captureSquares(move) {
		if( /c/.test(move.flags) || /e/.test(move.flags) ) {
			this.data.captureSquares[move.toIndex][move.piece][move.color]++;
			this.data.captureSquares[move.toIndex].all[move.color]++;
		}
	}

	checkSquares(move) {
		if( /\+$/.test(move.san) ) {
			this.data.checkSquares[move.toIndex][move.piece][move.color]++;
			this.data.checkSquares[move.toIndex].all[move.color]++;
		}
	}
}