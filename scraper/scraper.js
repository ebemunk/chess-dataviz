var debug = require('debug')('scraper');

var phantom = require('phantom');

var Promise = require('bluebird');
var throat = require('throat')(Promise);
var colors = require('colors');

var request = require('request');

var fs = require('fs');
Promise.promisifyAll(fs);

var program = require('commander');
program
	.version('1.0.0')
	.option('-t, --tournament <tournament>', 'Tournament Name (id)', 'shamkir-gashimov-memorial-2015')
	.option('-r, --rounds <rounds>', 'Number of rounds', 9, parseInt)
	.option('-m, --matches <matches>', 'Number of matches per round', 1, parseInt)
	.option('-g, --games <games>', 'Number of games per match', 5, parseInt)
	.option('-c, --concurrency <concurrency>', 'Concurrency', 5, parseInt)
	.parse(process.argv)
;

debug('rounds'.cyan, program.rounds);
debug('matches'.cyan, program.matches);
debug('games'.cyan, program.games);
debug('conc'.cyan, program.concurrency);

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
								var notation = $('span[class^="notation-"]').map(function (i, notation) {
									return {
										move: $(notation).find('.move').text(),
										score: $(notation).find('.engine').text(),
										time: $(notation).find('.timeUsage').text() || '0s'
									}
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

								resolve(scraped);
							});
						}, 15000);
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

var pages = [];

for(var r=1; r<=program.rounds; r++) {
	for(var m=1; m<=program.matches; m++) {
		for(var g=1; g<=program.games; g++) {
			pages.push({r: r, m:m, g:g});
		}
	}
}

var tournament = {};

var gamePromises = [];

Promise.all(pages.map(throat(program.concurrency, function (o) {
	return scrapePage(program.tournament, o.r, o.m, o.g);
})))
.then(function (scrapedData) {
	scrapedData.forEach(function (scraped) {
		if( ! tournament[scraped.round] ) tournament[scraped.round] = {};
		if( ! tournament[scraped.round][scraped.match] ) tournament[scraped.round][scraped.match] = {};

		var whiteImgPromise = fs.statAsync('img/players/' + scraped.white + '.jpg')
		.catch(function () {
			request('https://chess24.com' + scraped.whiteImg)
				.pipe(fs.createWriteStream('img/players/' + scraped.white + '.jpg'));
		});

		var blackImgPromise = fs.statAsync('img/players/' + scraped.black + '.jpg')
		.catch(function () {
			request('https://chess24.com' + scraped.blackImg)
				.pipe(fs.createWriteStream('img/players/' + scraped.black + '.jpg'));
		});

		gamePromises.push(
			Promise.all([whiteImgPromise, blackImgPromise])
			.then(function () {
				tournament[scraped.round][scraped.match][scraped.game] = {
					black: scraped.black,
					blackElo: scraped.blackElo,
					white: scraped.white,
					whiteElo: scraped.whiteElo,
					notation: scraped.notation,
					winner: scraped.winner,
					whiteImg: 'img/players/' + scraped.white + '.jpg',
					blackImg: 'img/players/' + scraped.black + '.jpg'
				};
			})
		);
	});

	Promise.all(gamePromises).then(function () {
		fs.writeFileAsync('data/' + program.tournament + '.json', JSON.stringify(tournament, null, 4))
		.then(function () {
			console.log('all good'.green);
			// process.exit();
		});
	});
});