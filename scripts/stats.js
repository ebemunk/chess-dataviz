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
let movesz = new Moves();

let start = new Date();

debug(argv);

highland(fs.createReadStream(argv.file, {encoding: 'utf8'}))
.splitBy(/\r?\n\r?\n(?=\[)/g) //split pgns with multiple games by game
.map(file => {
	//regexes stolen from chess.js
	let moves = file
	.replace(file.replace(/^(\[(.|\r?\n)*\])(\r?\n)*1.(\r?\n|.)*$/g, '$1'), '') //strip away header text
	.replace(/\r?\n/g, ' ') //join multiple lines
	.replace(/(\{[^}]+\})+?/g, '') //remove comments
	.replace(/\d+\./g, '') //remove move numbers
	.replace(/\.\.\./g, '') //remove ...
	.replace(/(1\-0)?(0\-1)?(1\/2\-1\/2)?/g, '') //remove results
	.trim()
	.split(/\s+/) //split by space
	//get rid of empty moves
	.join(',')
	.replace(/,,+/g, ',')
	.split(',');

	heatmaps.update(moves);
	openings.update(_.take(moves, 10));
	movesz.update(moves);
})
.done(() => {
	fs.writeFileAsync(argv.file.split('.pgn')[0] + '_statistics.json', JSON.stringify({
		heatmaps: heatmaps.data,
		openings: openings.data,
		moves: movesz.survivalData
	}, null, 4))
	.then(() => {
		console.log('  done, took'.cyan, new Date().getTime() - start.getTime(), 'ms'.cyan);
	});
});