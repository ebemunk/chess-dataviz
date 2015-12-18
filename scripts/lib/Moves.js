'use strict';

const _ = require('lodash');

function parseMove(move, i) {
	let check = /\+/.test(move);

	move = move.replace(/\+/g, '').replace(/#/g, '');

	let piece = (/[NBRQK]/.test(move[0]) ? move[0] : 'P').toLowerCase();
	let fromName = move.split(/[x\-]/)[0];
	let castle = /(^e1\-g1)|(^e1\-c1)|(^e8\-g8)|(^e8\-c8)/.test(move);

	if( piece !== 'p' ) {
		move = move.substr(1);
	}

	let fromTo = move.split(/[x\-]/);

	let parsedMove = {
		fromName: fromName,
		from: fromTo[0],
		to: fromTo[1],
		piece: piece,
		capture: /x/.test(move),
		castle: castle,
		color: i % 2 === 0 ? 'w' : 'b',
	};

	if( parsedMove.castle ) {
		parsedMove.fromName = `K${parsedMove.fromName}`;
	}

	return parsedMove;
}

class Moves {
	constructor() {
		this.pieces = {};

		let files = 'abcdefgh'.split('');

		for( let file of files ) {
			for( let rank of [2, 7] ) {
				let pawn = `${file}${rank}`;
				this.pieces[pawn] = [pawn];
			}
		};

		let pieces = {
			N: ['b', 'g'],
			B: ['c', 'f'],
			R: ['a', 'h'],
			Q: ['d'],
			K: ['e']
		};

		_.forEach(pieces, (files, piece) => {
			for( let file of files ) {
				for( let rank of [1, 8] ) {
					this.pieces[`${piece}${file}${rank}`] = [`${file}${rank}`];
				}
			};
		});

		this.survivalData = {};

		// console.log(this.pieces);
	}

	update(moves) {
		// console.log('NEW GAME ---------------');
		let pieceLocations = _.cloneDeep(this.pieces);
		let currentSquareState = _.chain(pieceLocations).invert().mapValues(val => [val]).value();

		moves.forEach((move, i) => {
			// console.log('MOVE:', move);

			let parsedMove = parseMove(move, i);

			if( /[NBRQ]$/.test(parsedMove.to) ) {
				parsedMove.to = parsedMove.to.slice(0, - 1);
			}

			let originalPiece = _.last(_.get(currentSquareState, parsedMove.from) || [parsedMove.fromName]);
			let target = _.last(_.get(currentSquareState, parsedMove.to) || [parsedMove.to]);

			// console.log(parsedMove, originalPiece, target)

			pieceLocations[originalPiece].push(parsedMove.to);

			if( parsedMove.capture ) {
				if( target === 'empty' || ! currentSquareState[parsedMove.to] ) {
					let enPassantSquare;

					if( parsedMove.color === 'w' ) {
						enPassantSquare = parsedMove.to.charAt(0) + (parseInt(parsedMove.to.charAt(1))-1);
					} else {
						enPassantSquare = parsedMove.to.charAt(0) + (parseInt(parsedMove.to.charAt(1))+1);
					}

					target = _.last(_.get(currentSquareState, enPassantSquare) || [enPassantSquare]);
				}
			// console.log(target === 'empty',parsedMove, originalPiece, target)

				pieceLocations[target].push(`captured-${i}`);
			}

			currentSquareState[parsedMove.to] = _.toArray(currentSquareState[parsedMove.to]).concat([originalPiece]);
			currentSquareState[parsedMove.from] = _.toArray(currentSquareState[parsedMove.from]).concat(['empty']);

			if( parsedMove.castle ) {
				if( /(^e\d\-g\d)/.test(move) ) { //kingside
					pieceLocations['Rh' + move.charAt(1)].push('f' + move.charAt(1));
					currentSquareState['f' + move.charAt(1)] = _.toArray(currentSquareState['f' + move.charAt(1)]).concat(['Rh' + move.charAt(1)]);
				} else {
					pieceLocations['Ra' + move.charAt(1)].push('d' + move.charAt(1));
					currentSquareState['d' + move.charAt(1)] = _.toArray(currentSquareState['d' + move.charAt(1)]).concat(['Ra' + move.charAt(1)]);
				}
			}

			// console.log(pieceLocations);
			// console.log(currentSquareState);
		});

		_.forEach(pieceLocations, (moves, piece) => {
			let prev = moves.shift();

			moves.filter(move => ! /captured/.test(move)).forEach(move => {
				if( ! this.survivalData[piece] ) {
					this.survivalData[piece] = {};
				}

				if( this.survivalData[piece][`${prev}-${move}`] ) {
					this.survivalData[piece][`${prev}-${move}`]++
				} else {
					this.survivalData[piece][`${prev}-${move}`] = 1;
				}

				prev = move;
			});
		});

		// throw kek;
	}
}

module.exports = Moves;