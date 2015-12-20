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

function boardSquares() {
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

export function drawBoard(svg, squareWidth) {
	//board squares
	let board = boardSquares();

	//create the g elements for squares
	let squares = svg.selectAll('.square').data(board).enter()
		.append('g')
			.attr('class', (d) => {
				let file = String.fromCharCode(97 + d.x);
				let rank = 8 - d.y;

				return 'square ' + file + rank;
			})
			.classed('white', (d) => isWhite(d))
			.classed('black', (d) => ! isWhite(d))
	;

	//create square elements for board squares
	squares.append('rect')
		.attr('x', (d) => d.x * squareWidth)
		.attr('y', (d) => d.y * squareWidth)
		.attr('width', squareWidth + 'px')
		.attr('height', squareWidth + 'px')
		.attr('class', 'sq')
	;

	//labels among the A file
	let fileLabels = d3.range(8).map((i) => '.a' + (i + 1));

	//file labels
	svg.selectAll(fileLabels)
		.append('text')
			.attr('x', (d) => d.x * squareWidth)
			.attr('y', (d) => d.y * squareWidth)
			.attr('dx', '0.2em')
			.attr('dy', '1em')
			.text((d) => 8 - d.y)
			.attr('class', 'label')
	;

	//a-h labels for files
	let files = d3.range(8).map((i) => String.fromCharCode(97 + i));
	let rankLabels = files.slice().map((file) => '.' + file + '1');

	//rank labels
	svg.selectAll(rankLabels)
		.append('text')
			.attr('x', (d) => (d.x + 1) * squareWidth)
			.attr('y', (d) => (d.y + 1) * squareWidth)
			.attr('dx', '-0.3em')
			.attr('dy', '-0.5em')
			.attr('text-anchor', 'end')
			.text((d) => files[d.x])
			.attr('class', 'label')
	;
}