function parseMinutes(move, i) {
	let min = move.time.match(/(\d+)m/);
	min = min ? +min[1] : 0;

	let sec = move.time.match(/(\d+)s/);
	sec = sec ? +sec[1] : 0;

	let minutes = min + sec / 60;

	if( i % 2 ) {
		minutes = -minutes;
	}

	return minutes;
}

function parseScore(move) {
	let score = move.score;

	//mate notation
	if( score.match(/#/g) ) {
		score = score.replace('#', '');
		//just make it a big number
		score = +score * 10;
	} else {
		score = +score;
	}

	return score;
}

export function parseGameNotation(game) {
	let parsedGame = JSON.parse(JSON.stringify(game));

	parsedGame.notation.map((move, i) => move.time = parseMinutes(move, i));
	parsedGame.notation.map((move) => move.score = parseScore(move));

	// let winner = parsedGame.winner == 'draw' ? 'draw' : parsedGame.winner + ' wins';

	return parsedGame;
}

export function boardSquares() {
	var squares = [];

	for( let i = 0; i < 64; i++ ) {
		squares.push({
			x: i % 8,
			y: Math.floor(i / 8)
		});
	}

	return squares;
}

export function isWhite(d) {
	return (! (d.x % 2) && ! (d.y % 2)) || (d.x % 2 && d.y % 2);
}