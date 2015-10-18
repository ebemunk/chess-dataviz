'use strict';

var debug = require('debug')('statistics');

var Promise = require('bluebird');
var colors = require('colors');

var fs = require('fs');
Promise.promisifyAll(fs);

var chess = require('chessli.js');

var args = require('commander');
args
	.version('1.0.0')
	.option('-f, --file <filename>', 'Scraped JSON file', '../data/shamkir-gashimov-memorial-2015.json')
	.parse(process.argv)
;

debug('  source file'.cyan, args.file);

var file = require(args.file);

function squareToIndex(square) {
	square = square.toLowerCase();

	var file = square.charCodeAt(0) - 97;
	var rank = 8 - square[1];

	return [file, rank];
}

function heatmap(games, countFn) {
	var boardHeatmap = [];

	for( var i = 0; i < 64; i++ ) {
		boardHeatmap[i] = {
			p: {w: 0, b: 0},
			n: {w: 0, b: 0},
			b: {w: 0, b: 0},
			r: {w: 0, b: 0},
			q: {w: 0, b: 0},
			k: {w: 0, b: 0},
			all: {w: 0, b: 0}
		};
	}

	games.forEach(function (game) {
		countFn(game, boardHeatmap);
	});

	return boardHeatmap;
}

//moved to square
function squareUtilization (game, boardHeatmap) {
	var chessGame = new chess.Chess();

	game.notation.forEach(function (move) {
		var theMove = chessGame.move(move.move);
		var toIndex = squareToIndex(theMove.to);

		boardHeatmap[toIndex[1] * 8 + toIndex[0]][theMove.piece][theMove.color]++;
		boardHeatmap[toIndex[1] * 8 + toIndex[0]].all[theMove.color]++;
	});
}

//moved from square
function moveSquares (game, boardHeatmap) {
	var chessGame = new chess.Chess();

	game.notation.forEach(function (move) {
		var theMove = chessGame.move(move.move);
		var fromIndex = squareToIndex(theMove.from);

		boardHeatmap[fromIndex[1] * 8 + fromIndex[0]][theMove.piece][theMove.color]++;
		boardHeatmap[fromIndex[1] * 8 + fromIndex[0]].all[theMove.color]++;
	});
}

//stayed in square
function squareOccupancy (game, boardHeatmap) {
	var chessGame = new chess.Chess();
	var files = 'abcdefgh';

	game.notation.forEach(function (move) {
		var theMove = chessGame.move(move.move);
		for( let file = 0; file < 8; file++ ) {
			for( let rank = 1; rank < 9; rank++ ) {
				let squareName = files.charAt(file) + rank;

				if( theMove.from === squareName ) continue;

				let square = chessGame.get(squareName);

				if( ! square ) continue;

				var squareIndex = squareToIndex(squareName);
				boardHeatmap[squareIndex[1] * 8 + squareIndex[0]][square.type][square.color]++;
				boardHeatmap[squareIndex[1] * 8 + squareIndex[0]].all[square.color]++;
			}
		}
	});
}

function captureSquares (game, boardHeatmap) {
	var chessGame = new chess.Chess();

	game.notation.forEach(function (move) {
		var theMove = chessGame.move(move.move);

		if( /c/.test(theMove.flags) || /e/.test(theMove.flags) ) {
			var toIndex = squareToIndex(theMove.to);

			boardHeatmap[toIndex[1] * 8 + toIndex[0]][theMove.piece][theMove.color]++;
			boardHeatmap[toIndex[1] * 8 + toIndex[0]].all[theMove.color]++;
		}
	});
}

function checkSquares (game, boardHeatmap) {
	var chessGame = new chess.Chess();

	var prevMove;

	game.notation.forEach(function (move) {
		if( chessGame.in_check() ) {
			var toIndex = squareToIndex(prevMove.to);

			boardHeatmap[toIndex[1] * 8 + toIndex[0]][prevMove.piece][prevMove.color]++;
			boardHeatmap[toIndex[1] * 8 + toIndex[0]].all[prevMove.color]++;
		}

		prevMove = chessGame.move(move.move);
	});
}

// var hm = heatmap(file, squareUtilization);
// var hm = heatmap(file, moveSquares);
// var hm = heatmap(file, squareOccupancy);
// var hm = heatmap(file, captureSquares);
var hm = heatmap(file, checkSquares);

fs.writeFileAsync('data/' + args.file.split('.json')[0] + '_statistics.json', JSON.stringify(hm, null, 4))
.then(function () {
	console.log('all good'.green);
});