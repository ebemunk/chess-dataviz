import merge from 'deepmerge';
import * as util from './util';

export class EvalAndTimeGraph {
	constructor(selector, options) {
		if( ! selector ) throw Error('need dom selector');
		this.selector = selector;

		this.container = d3.select(selector);

		let defaultOptions = {
			playerPaneWidth: 200,
			width: 960,
			height: 500,
			margin: {
				top: 40,
				right: 40,
				bottom: 20,
				left: 40
			},
			interactive: true
		};

		options = options || {};

		this.options = merge(defaultOptions, options);

		this.width = this.options.width - this.options.playerPaneWidth - this.options.margin.left - this.options.margin.right;
		this.height = this.options.height - this.options.margin.top - this.options.margin.bottom;

		//scales
		this.xScale = d3.scale.ordinal()
			.rangeBands([0, this.width], 0.1, 0)
		;

		this.yEvalScale = d3.scale.linear()
			.range([this.height, 0])
			.domain([-5, 5])
			.clamp(true)
		;

		this.yTimeScale = d3.scale.linear()
			.range([this.height, 0])
		;

		//axes
		this.xAxis = d3.svg.axis()
			.scale(this.xScale)
			.orient('top')
			.tickFormat((d) => d + 1)
		;

		this.yEvalAxis = d3.svg.axis()
			.scale(this.yEvalScale)
			.orient('left')
		;

		this.yTimeAxis = d3.svg.axis()
			.scale(this.yTimeScale)
			.orient('right')
			.tickFormat(d => Math.abs(d))
		;

		this.init();
	}

	init() {
		let self = this;

		//clear element
		this.container.selectAll('*').remove();

		//player pane
		let playerInfo = this.container
			.append('div')
				.attr('class', 'player-info')
		;

		playerInfo
			.append('div')
				.attr('class', 'player-white')
				.selectAll('div').data(['image', 'name', 'rating']).enter()
				.append('div')
					.attr('class', (d) => `player-${d}`)
		;

		playerInfo.append('div')
			.attr('class', 'player-result')
		;

		playerInfo
			.append('div')
				.attr('class', 'player-black')
				.selectAll('div').data(['image', 'name', 'rating']).enter()
				.append('div')
					.attr('class', (d) => `player-${d}`)
		;

		playerInfo.selectAll('.player-image')
			.append('img')
		;

		//root of the graph
		let root = this.container.append('svg')
			.attr('class', 'graph')
			.attr('width', this.width + this.options.margin.left + this.options.margin.right)
			.attr('height', this.height + this.options.margin.top + this.options.margin.bottom)
		;

		//margins applied
		let svg = root.append('g')
			.attr('transform', 'translate(' + this.options.margin.left + ',' + this.options.margin.top + ')')
		;

		//xAxis
		svg
			.append('g')
				.attr('class', 'axis x')
				.call(this.xAxis)
			.append('text')
				.attr('text-anchor', 'end')
				.attr('transform', 'translate(' + this.width / 2 + ',-25)')
				.text('moves (ply)')
				.attr('class', 'axis-label')
		;

		//yEvalAxis
		svg
			.append('g')
				.attr('class', 'axis yEval')
				.call(this.yEvalAxis)
			.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'rotate(-90) translate(' + -this.yEvalScale(0) + ',-25)')
				.text('area: evaluation (pawns)')
				.attr('class', 'axis-label')
		;

		//yTimeAxis
		svg
			.append('g')
				.attr('class', 'axis yTime')
				.attr('transform', 'translate(' + this.width + ',0)')
				.call(this.yTimeAxis)
			.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'rotate(-90) translate(' + -this.yEvalScale(0) + ',35)')
				.text('bars: move time (minutes)')
				.attr('class', 'axis-label')
		;

		//eval guide lines
		let evalGuides = svg.append('g')
			.attr('class', 'eval-guides')
		;

		let evalGuideLines = [
			0.5, -0.5,
			1, -1,
			2, -2
		];

		let evalGuideTexts = [
			{y: 0.5, dy: 10, text: 'equal'},
			{y: 1, dy: 10, text: 'white is slightly better'},
			{y: 2, dy: 10, text: 'white is much better'},
			{y: 2, dy: -5, text: 'white is winning'},

			{y: -0.5, dy: 10, text: 'black is slightly better'},
			{y: -1, dy: 10, text: 'black is much better'},
			{y: -2, dy: 10, text: 'black is winning'}
		];

		evalGuides.selectAll('.eval-guide-line')
			.data(evalGuideLines).enter()
				.append('line')
					.attr('x1', 0)
					.attr('y1', d => this.yEvalScale(d))
					.attr('x2', this.width)
					.attr('y2', d => this.yEvalScale(d))
					.attr('class', 'eval-guide-line')
		;

		evalGuides.selectAll('.eval-guide-text')
			.data(evalGuideTexts).enter()
				.append('text')
					.attr('transform', d => {
						let offset = d.dy ? d.dy : 0;
						return 'translate(5,' + (this.yEvalScale(d.y) + offset) + ')';
					})
					.text(d => d.text)
					.attr('class', 'eval-guide-text')
		;

		//bars group
		svg.append('g')
			.attr('class', 'bars')
		;

		//clip paths
		svg.append('clipPath')
			.attr('id', 'clip-white')
		.append('rect')
			.attr('width', this.width)
			.attr('height', this.height / 2)
		;

		svg.append('clipPath')
			.attr('id', 'clip-black')
		.append('rect')
			.attr('y', this.height / 2)
			.attr('width', this.width)
			.attr('height', this.height / 2)
		;

		//lines group
		svg.append('g')
			.attr('class', 'lines')
		;

		//areas group
		svg.append('g')
			.attr('class', 'areas')
		;

		//interactive layer group (for mouse hover stuff)
		let interactiveLayer = svg.append('g')
			.attr('class', 'interactive-layer')
		;

		//interactive guidelines for axes
		interactiveLayer.selectAll('.guide')
			.data(['x', 'yEval', 'yTime']).enter()
			.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', 0)
				.attr('y2', 0)
				.attr('class', d => `guide ${d}-guide`)
		;

		//invisible rect to absorb mouse move events
		interactiveLayer.append('rect')
			.attr('width', this.width)
			.attr('height', this.height)
			.attr('pointer-events', 'all')
			.attr('class', 'mouse-absorb')
			.on('mousemove', function () {
				//disregard if options.interactive is off
				if( ! self.options.interactive ) return;

				//calculate which point index the mouse is on
				let mouseX = d3.mouse(this)[0];
				let leftEdges = self.xScale.range();
				let width = self.xScale.rangeBand();
				let j;
				for(j=0; mouseX > (leftEdges[j] + width); j++) {}

				//convert it to the range on screen
				let xPoint = self.xScale.domain()[j];
				let xPosition = self.xScale(xPoint) + (self.xScale.rangeBand() / 2);

				if( ! xPosition ) return;

				//draw x axis guide
				interactiveLayer.select('.x-guide')
					.classed('hidden', false)
					.attr('x1', xPosition)
					.attr('x2', xPosition)
					.attr('y1', -6)
					.attr('y2', self.height)
				;

				//draw yEval guide
				let yPosition = self.yEvalScale(self.game.notation[xPoint].score);

				interactiveLayer.select('.yEval-guide')
					.classed('hidden', false)
					.attr('x1', -6)
					.attr('x2', xPosition)
					.transition().duration(100)
					.attr('y1', yPosition)
					.attr('y2', yPosition)
				;

				//draw yTime guide
				yPosition = self.yTimeScale(self.game.notation[xPoint].time);

				interactiveLayer.select('.yTime-guide')
					.classed('hidden', false)
					.attr('x1', xPosition)
					.attr('x2', self.width + 6)
					.transition().duration(100)
					.attr('y1', yPosition)
					.attr('y2', yPosition)
				;
			})
			.on('mouseout', function () {
				//disregard if options.interactive is off
				if( ! self.options.interactive ) return;

				//hide guidelines on mouseout
				interactiveLayer.selectAll('.interactive-layer .guide')
					.classed('hidden', true)
			})
		;
	}

	update(game) {
		this.game = game;

		//set scale domains
		this.xScale.domain(d3.range(this.game.notation.length));

		let y2max = d3.max(
			d3.extent(this.game.notation, d => d.time).map(Math.abs)
		);
		this.yTimeScale.domain([-y2max, y2max]);

		//only show every 10th move tick on x-axis
		this.xAxis.tickValues(
			this.xScale.domain().filter((d, i) => i == 0 || ! ((i + 1) % 10))
		);

		//line generator
		let line = d3.svg.line()
			.x((d, i) => this.xScale(i) + (this.xScale.rangeBand() / 2))
			.y((d) => this.yEvalScale(d.score))
		;

		//area generator
		let area = d3.svg.area()
			.x(line.x())
			.y1(line.y())
			.y0(this.yEvalScale(0))
		;

		//axes
		let axes = this.container.transition();

		axes.select('g.axis.x')
			.call(this.xAxis)
		;
		axes.select('g.axis.yTime')
			.call(this.yTimeAxis)
		;
		axes.select('g.axis.yEval')
			.call(this.yEvalAxis)
		;

		//bars

		//join
		let bars = this.container.select('.bars')
			.selectAll('.bar')
			.data(this.game.notation)
		;

		//enter
		bars.enter()
			.append('rect')
				.attr('height', 0)
				.attr('y', this.yTimeScale(0))
		;

		//update + enter
		bars
			.transition()
			.delay((d, i) => i / this.xScale.domain().length * 500)
			.attr('x',(d, i) => this.xScale(i))
			.attr('width', this.xScale.rangeBand())
			.attr('y', d => {
				if( d.time > 0 ) {
					return this.yTimeScale(d.time);
				} else {
					return this.yTimeScale(0);
				}
			})
			.attr('height', d => {
				if( d.time > 0 ) {
					return this.yTimeScale(0) - this.yTimeScale(d.time);
				} else {
					return this.yTimeScale(d.time) - this.yTimeScale(0); 
				}
			})
			.attr('class', (d, i) => 'bar ' + (i % 2 ? 'black' : 'white'))
		;

		//exit
		bars.exit()
			.transition()
			.delay((d, i) => i / this.xScale.domain().length * 500)
			.attr('height', 0)
			.remove()
		;

		//lines
		let lines = this.container.select('.lines')
			.selectAll('.line')
		;

		//enter
		lines
			.data(['white', 'black']).enter()
			.append('path')
				.attr('class', (d) => `line ${d}`)
				.attr('clip-path', (d) => `url(#clip-${d})`)
				.datum(this.game.notation)
				.attr('d', line)
		;

		//update + enter
		lines
			.datum(this.game.notation)
			.transition()
			.attr('d', line)
		;

		//areas
		let areas = this.container.select('.areas')
			.selectAll('.area')
		;

		//enter
		areas
			.data(['white', 'black']).enter()
			.append('path')
				.attr('class', (d) => `area ${d}`)
				.attr('clip-path', (d) => `url(#clip-${d})`)
				.datum(this.game.notation)
				.attr('d', area)
		;

		//update + enter
		areas
			.datum(this.game.notation)
			.transition()
			.attr('d', area)
		;

		this.updatePlayers();
	}

	updatePlayers() {
		let playerInfo = this.container.select('.player-info');

		playerInfo.select('.player-white .player-name').text(this.game.white);
		playerInfo.select('.player-white .player-rating').text(this.game.whiteElo);
		playerInfo.select('.player-white .player-image img').attr('src', '/' + this.game.whiteImg);

		playerInfo.select('.player-black .player-name').text(this.game.black);
		playerInfo.select('.player-black .player-rating').text(this.game.blackElo);
		playerInfo.select('.player-black .player-image img').attr('src', '/' + this.game.blackImg);

		let winner;

		if( this.game.avgGame ) {
			winner = 'averaged games'
		} else {
			winner = this.game.winner == 'draw' ? 'draw' : this.game.winner + ' wins';
		}

		playerInfo.select('.player-result').text(winner);
	}

	static averageEvalAndTime(tournament, percentage = false) {
		let games = util.tournamentObjToArray(tournament, true);

		let avgGame = {
			white: 'White',
			whiteImg: 'img/players/white.jpg',
			black: 'Black',
			blackImg: 'img/players/black.jpg',
			avgGame: true,
			notation: []
		};

		for( let game of games ) {
			game = util.parseGameNotation(game);
console.log('NG');
			game.notation.forEach((move, i) => {
				let index = percentage ? Math.round(i / game.notation.length * 100) : i;
if(i % 2 == 0)
console.log(move.time);
				if( avgGame.notation[index] ) {
					avgGame.notation[index].score += move.score;
					avgGame.notation[index].time += move.time;
					avgGame.notation[index].count++;
				} else {
					avgGame.notation[index] = {
						score: move.score,
						time: move.time,
						count: 1
					};
				}
			});
		}

		avgGame.notation.map((move) => {
			move.score /= move.count;
			move.time /= move.count;
		});

		return avgGame;
	}
}