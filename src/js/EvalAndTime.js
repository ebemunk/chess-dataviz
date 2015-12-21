/*global d3*/

import _ from 'lodash';
import debug from 'debug';

let log = debug('cdv:EvalAndTime');

/*
Plots evaluation & time usage for a game.
Expects a game object such as:
{
	black: 'Giri, Anish',
	blackElo: '2790',
	blackImg: 'img/players/Giri.jpg',

	white: 'Anand, Viswanathan',
	whiteElo: '2791',
	whiteImg: 'img/player/Anand.jpg',

	winner: 'draw' OR 'white' OR 'black',

	notation: [
		{score: 0.15, time: 0.6}, //must not be strings
		...
	]
}

*/
export class EvalAndTime {
	constructor(selector, options, data) {
		let self = this;

		//container
		this.container = d3.select(selector);

		//options
		let defaultOptions = {
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

		this._options = _.merge({}, defaultOptions, options);

		this._width = this._options.width - this._options.margin.left - this._options.margin.right;
		this._height = this._options.height - this._options.margin.top - this._options.margin.bottom;

		//event dispatcher
		this.dispatch = d3.dispatch('mouseenter', 'mousemove', 'mouseleave');

		//scales
		this._xScale = d3.scale.ordinal()
			.rangeBands([0, this._width], 0.1, 0)
		;

		this._yEvalScale = d3.scale.linear()
			.range([this._height, 0])
			.domain([-5, 5])
			.clamp(true)
		;

		this._yTimeScale = d3.scale.linear()
			.range([this._height, 0])
		;

		//axes
		this._xAxis = d3.svg.axis()
			.scale(this._xScale)
			.orient('top')
			.tickFormat((d) => d + 1)
		;

		this._yEvalAxis = d3.svg.axis()
			.scale(this._yEvalScale)
			.orient('left')
		;

		this._yTimeAxis = d3.svg.axis()
			.scale(this._yTimeScale)
			.orient('right')
			.tickFormat(d => Math.abs(d))
		;

		//clear element
		this.container.selectAll('*').remove();

		//root of the graph
		let root = this.container.append('svg')
			.attr('class', 'graph')
			.attr('width', this._width + this._options.margin.left + this._options.margin.right)
			.attr('height', this._height + this._options.margin.top + this._options.margin.bottom)
		;

		//margins applied
		let svg = root.append('g')
			.attr('transform', 'translate(' + this._options.margin.left + ',' + this._options.margin.top + ')')
		;

		//xAxis
		svg
			.append('g')
				.attr('class', 'axis x')
				.call(this._xAxis)
			.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'translate(' + this._width / 2 + ',-25)')
				.text('moves (ply)')
				.attr('class', 'axis-label')
		;

		//yEvalAxis
		svg
			.append('g')
				.attr('class', 'axis yEval')
				.call(this._yEvalAxis)
			.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'rotate(-90) translate(' + -this._yEvalScale(0) + ',-25)')
				.text('area: evaluation (pawns)')
				.attr('class', 'axis-label')
		;

		//yTimeAxis
		svg
			.append('g')
				.attr('class', 'axis yTime')
				.attr('transform', 'translate(' + this._width + ',0)')
				.call(this._yTimeAxis)
			.append('text')
				.attr('text-anchor', 'middle')
				.attr('transform', 'rotate(-90) translate(' + -this._yEvalScale(0) + ',35)')
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
					.attr('y1', d => this._yEvalScale(d))
					.attr('x2', this._width)
					.attr('y2', d => this._yEvalScale(d))
					.attr('class', 'eval-guide-line')
		;

		evalGuides.selectAll('.eval-guide-text')
			.data(evalGuideTexts).enter()
				.append('text')
					.attr('transform', d => {
						let offset = d.dy ? d.dy : 0;
						return 'translate(5,' + (this._yEvalScale(d.y) + offset) + ')';
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
			.attr('width', this._width)
			.attr('height', this._height / 2)
		;

		svg.append('clipPath')
			.attr('id', 'clip-black')
		.append('rect')
			.attr('y', this._height / 2)
			.attr('width', this._width)
			.attr('height', this._height / 2)
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
			.attr('width', this._width)
			.attr('height', this._height)
			.attr('pointer-events', 'all')
			.attr('class', 'mouse-absorb')
			.on('mouseenter', () => {
				this.dispatch.mouseenter();
			})
			.on('mousemove', function () {
				/*eslint no-empty: 0*/

				//disregard if options.interactive is off
				if( ! self._options.interactive ) return;

				//calculate which point index the mouse is on
				let mouseX = d3.mouse(this)[0];
				let leftEdges = self._xScale.range();
				let width = self._xScale.rangeBand();
				let j;
				for(j=0; mouseX > (leftEdges[j] + width); j++) {}

				//convert it to the range on screen
				let xPoint = self._xScale.domain()[j];
				let xPosition = self._xScale(xPoint) + (self._xScale.rangeBand() / 2);

				if( ! xPosition ) return;

				//draw x axis guide
				interactiveLayer.select('.x-guide')
					.classed('hidden', false)
					.attr('x1', xPosition)
					.attr('x2', xPosition)
					.attr('y1', -6)
					.attr('y2', self._height)
				;

				//draw yEval guide
				let yPosition = self._yEvalScale(self._data[xPoint].score);

				interactiveLayer.select('.yEval-guide')
					.classed('hidden', false)
					.attr('x1', -6)
					.attr('x2', xPosition)
					.transition().duration(100)
						.attr('y1', yPosition)
						.attr('y2', yPosition)
				;

				//draw yTime guide
				yPosition = self._yTimeScale(self._data[xPoint].time);

				interactiveLayer.select('.yTime-guide')
					.classed('hidden', false)
					.attr('x1', xPosition)
					.attr('x2', self._width + 6)
					.transition().duration(100)
						.attr('y1', yPosition)
						.attr('y2', yPosition)
				;

				self.dispatch.mousemove(self._data[xPoint]);
			})
			.on('mouseleave', function () {
				//disregard if options.interactive is off
				if( ! self._options.interactive ) return;

				//hide guidelines on mouseleave
				interactiveLayer.selectAll('.interactive-layer .guide')
					.classed('hidden', true)
				;

				self.dispatch.mouseleave();
			})
		;
	}

	data(data) {
		this._data = data;

		this.update();
	}

	options(options) {
		let omit = [
			'width',
			'margin',
			'boardWidth',
			'squareWidth'
		];

		_.merge(this._options, _.omit(options, omit));

		if( _.isArray(this._options.colorScale) ) {
			this._scale.color.range(this._options.colorScale);
		}

		this.update();
	}

	update() {
		//set scale domains
		this._xScale.domain(d3.range(this._data.length));

		let y2max = d3.max(
			d3.extent(this._data, d => d.time).map(Math.abs)
		);
		this._yTimeScale.domain([-y2max, y2max]);

		//only show every 10th move tick on x-axis
		this._xAxis.tickValues(
			this._xScale.domain().filter((d, i) => i == 0 || ! ((i + 1) % 10))
		);

		//line generator
		let line = d3.svg.line()
			.x((d, i) => this._xScale(i) + (this._xScale.rangeBand() / 2))
			.y((d) => this._yEvalScale(d.score))
		;

		//area generator
		let area = d3.svg.area()
			.x(line.x())
			.y1(line.y())
			.y0(this._yEvalScale(0))
		;

		//axes
		let axes = this.container.transition();

		axes.select('g.axis.x')
			.call(this._xAxis)
		;
		axes.select('g.axis.yTime')
			.call(this._yTimeAxis)
		;
		axes.select('g.axis.yEval')
			.call(this._yEvalAxis)
		;

		//bars

		//join
		let bars = this.container.select('.bars')
			.selectAll('.bar')
			.data(this._data)
		;

		//enter
		bars.enter()
			.append('rect')
				.attr('height', 0)
				.attr('y', this._yTimeScale(0))
		;

		//update + enter
		bars
			.transition()
			.delay((d, i) => i / this._xScale.domain().length * 500)
			.attr('x',(d, i) => this._xScale(i))
			.attr('width', this._xScale.rangeBand())
			.attr('y', d => {
				if( d.time > 0 ) {
					return this._yTimeScale(d.time);
				} else {
					return this._yTimeScale(0);
				}
			})
			.attr('height', d => {
				if( d.time > 0 ) {
					return this._yTimeScale(0) - this._yTimeScale(d.time);
				} else {
					return this._yTimeScale(d.time) - this._yTimeScale(0); 
				}
			})
			.attr('class', (d, i) => 'bar ' + (i % 2 ? 'black' : 'white'))
		;

		//exit
		bars.exit()
			.transition()
			.delay((d, i) => i / this._xScale.domain().length * 500)
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
				.datum(this._data)
				.attr('d', line)
		;

		//update + enter
		lines
			.datum(this._data)
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
				.datum(this._data)
				.attr('d', area)
		;

		//update + enter
		areas
			.datum(this._data)
			.transition()
			.attr('d', area)
		;
	}
}