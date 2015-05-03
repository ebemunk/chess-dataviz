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
	parsedGame.notation.map((move, i) => move.score = parseScore(move));

	return parsedGame;
}

export function tournamentObjToArray(tournament, flatten = false) {
	let array = [];

	for( let round in tournament ) {
		let roundGames = [];

		for( let game in tournament[round][1] ) {
			let val = tournament[round][1][game];
			val.roundGame = round + ',' + game;

			roundGames.push(val);
		}

		if( flatten ) {
			array = array.concat(roundGames);
		} else {
			array.push(roundGames);
		}
	}

	return array;
}