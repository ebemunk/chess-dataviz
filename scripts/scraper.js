/*eslint no-console: 0*/
/*eslint no-unused-vars: 0*/

'use strict';

var debug = require('debug')('scraper');

var phantom = require('phantom');
var Promise = require('bluebird');
var colors = require('colors');
var progress = require('progress');
var request = require('request');
var fs = Promise.promisifyAll(require('fs'));
var mkdirp = Promise.promisify(require('mkdirp'));

var args = require('commander');
args
	.version('1.0.0')
	.option('-t, --tournament <tournament>', 'Tournament Name (id)', 'shamkir-gashimov-memorial-2015')
	.option('-r, --rounds <rounds>', 'Number of rounds', 9, parseInt)
	.option('-m, --matches <matches>', 'Number of matches per round', 1, parseInt)
	.option('-g, --games <games>', 'Number of games per match', 5, parseInt)
	.option('-c, --concurrency <concurrency>', 'Concurrency', 5, parseInt)
	.option('-w, --wait <wait>', 'Wait before scraping (ms)', 15000, parseInt)
	.parse(process.argv)
;

var dataDir = 'data/';
var imgDir = 'data/img/players/';

console.log('  tournament'.cyan, args.tournament);
console.log('  rounds'.cyan, args.rounds);
console.log('  matches'.cyan, args.matches);
console.log('  games'.cyan, args.games);
console.log('  concurrency'.cyan, args.concurrency);
console.log('  wait'.cyan, args.wait);

console.log('  Starting scrape.'.cyan);

var bar = new progress('    scraping [:bar] :percent', {
	total: args.rounds * args.matches * args.games
});

var pages = [];

for(let r=1; r<=args.rounds; r++) {
	for(let m=1; m<=args.matches; m++) {
		for(let g=1; g<=args.games; g++) {
			pages.push({r: r, m:m, g:g});
		}
	}
}

Promise.map(pages, Promise.coroutine(function* (o) {
	var data = yield scrapePage(args.tournament, o.r, o.m, o.g);
	bar.tick();
	return data;
}), {concurrency: args.concurrency})
.then(function (scrapedData) {
	console.log('  Pages scraped, downloading player images.'.cyan);

	return Promise.map(scrapedData, Promise.coroutine(function* (scraped) {
		var game = scraped;
		console.log(scraped);
		game.whiteImg = yield requestPipeToFile(scraped.whiteImg, imgDir + scraped.white + '.jpg');
		game.blackImg = yield requestPipeToFile(scraped.blackImg, imgDir + scraped.black + '.jpg');

		return yield Promise.resolve(game);
	}));
})
.then(function (games) {
	console.log('  Scrape finished.'.green);

	return [games, mkdirp(dataDir)];
})
.spread(function (games) {
	var json = JSON.stringify(games, null, 4);
	return fs.writeFileAsync('data/' + args.tournament + '.json', json);
})
.then(function () {
	console.log('  All done.'.green);
});

function scrapePage(tournament, round, match, game) {
	return new Promise(function (resolve, reject) {
		var url = 'https://chess24.com/en/embed-tournament/' + tournament + '/' + round + '/' + match + '/' + game;

		debug(url);

		phantom.create(
			function (ph) {
				ph.createPage(function (page) {
					page.open(url, function (status) {
						setTimeout(function () {
							page.evaluate(function () {
								/*global $*/
								var notation = $('span[class^="notation-"]').map(function (i, notation) {
									return {
										move: $(notation).find('.move').text(),
										score: $(notation).find('.engine').text(),
										time: $(notation).find('.timeUsage').text() || '0s'
									};
								}).get();

								var winner = $('.playerInfo.white .score').text();
								if( winner == '1' ) {
									winner = 'white';
								} else if( winner == '0' ) {
									winner = 'black';
								} else {
									winner = 'draw';
								}

								var whiteImg =  $('.playerInfo.white img').attr('src');
								var blackImg = $('.playerInfo.black img').attr('src');

								return {
									notation: notation,
									black: $('.playerInfo.black .name').text(),
									blackElo: $('.playerInfo.black .elo').text(),
									white: $('.playerInfo.white .name').text(),
									whiteElo: $('.playerInfo.white .elo').text(),
									winner: winner,
									whiteImg: whiteImg,
									blackImg: blackImg
								};
							}, function (scraped) {
								scraped.tournament = tournament;
								scraped.round = round;
								scraped.match = match;
								scraped.game = game;

								ph.exit();
								resolve(scraped);
							});
						}, args.wait);
					});
				});
			},
			{
				dnodeOpts: {
					weak: false
				}
			}
		);
	});
}

function requestPipeToFile(url, filepath) {
	console.log('req', url, filepath);
	return fs.statAsync(filepath)
	.then(function () {
		return filepath;
	})
	.catch(function () {
		return mkdirp(imgDir)
		.then(function () {
			return new Promise(function (resolve, reject) {
				var stream = fs.createWriteStream(filepath)
				.on('finish', function () {
					return resolve(filepath);
				})
				.on('error', reject);

				request({
					url: url,
					gzip: true,
					encoding: null
				})
				.on('error', reject)
				.pipe(stream);
			});
		});
	})
	.finally(function () {
		return filepath;
	});
}