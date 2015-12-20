/*eslint no-console: 0*/
/*eslint no-unused-vars: 0*/

'use strict';

const debug = require('debug')('stats');

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const _ = require('lodash');
const highland = require('highland');

const minimist = require('minimist');
const colors = require('colors');

const argv = minimist(process.argv.slice(2), {
	alias: {
		file: 'f'
	},
	default: {
		file: 'data/new.pgn'
	}
});

const Openings = require('./lib/Openings.js');
const Heatmaps = require('./lib/Heatmaps.js');
const Moves = require('./lib/Moves.js');

console.log('  source file'.cyan, argv.file);

let heatmaps = new Heatmaps();
let openings = new Openings();
let moves = new Moves();

let start = new Date();
let numGames = 0;

debug(argv);

//precompile regexes for performance
//not sure if this makes that much difference, but seems to help
const splitBy = /\r?\n\r?\n(?=\[)/g;
const r1 = /\[SetUp|FEN\]/;
const r2 = /^(\[(.|\r?\n)*\])(\r?\n)*1.(\r?\n|.)*$/g;
const r3 = /\r?\n/g;
const r4 = /(\{[^}]+\})+?/g;
const r5 = /\d+\./g;
const r6 = /\.\.\./g;
const r7 = /\*/g;
const r8 = /(1\-0)?(0\-1)?(1\/2\-1\/2)?/g;
const r9 = /\s+/;
const r10 = /,,+/g;

highland(fs.createReadStream(argv.file, {encoding: 'utf8'}))
.splitBy(splitBy) //split pgns with multiple games by game
.map(file => {
	//dont bother with Set-up games
	if( r1.test(file) ) {
		return;
	}

	//regexes stolen from chess.js
	let gameMoves = file
	.replace(file.replace(r2, '$1'), '') //strip away header text
	.replace(r3, ' ') //join multiple lines
	.replace(r4, '') //remove comments
	.replace(r5, '') //remove move numbers
	.replace(r6, '') //remove ...
	.replace(r7, '') //remove *
	.replace(r8, '') //remove results
	.trim()
	.split(r9) //split by space
	//get rid of empty moves
	.join(',')
	.replace(r10, ',')
	.split(',');

	if( gameMoves.length < 2 ) {
		//ignore super short games
		return;
	}

	heatmaps.update(gameMoves);
	openings.update(_.take(gameMoves, 7));
	moves.update(gameMoves);
	numGames++;
})
.done(() => {
	fs.writeFileAsync(argv.file.split('.pgn')[0] + '_stats.json', JSON.stringify({
		heatmaps: heatmaps.data,
		openings: openings.data,
		moves: moves.survivalData
	}, null, 4))
	.then(() => {
		console.log('  done, took'.cyan, new Date().getTime() - start.getTime(), 'ms'.cyan);
		console.log('  processed games:', numGames);
	});
});