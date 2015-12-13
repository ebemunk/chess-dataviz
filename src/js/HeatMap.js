/*global d3*/
/*eslint no-unused-vars: 0*/

import _ from 'lodash';
import debug from 'debug';
import * as util from './util';

let log = debug('cdv:HeatMap');

export class HeatMap {
	constructor(selector, options, data) {
		let self = this;

		if( ! selector ) throw Error('need dom selector');

		this._data = data;

		//container setup
		this.container = d3.select(selector);

		//options
		let defaultOptions = {
			width: 500,
			margin: 20,
			interactive: true,
			accessor: {
				piece: 'all',
				color: 'w'
			}
		};

		options = options || {};
		this._options = _.merge({}, defaultOptions, options);

		this._options.boardWidth = this._options.width - this._options.margin * 2;
		this._options.squareWidth = Math.floor(this._options.boardWidth / 8);

		//scale
		this.scale = d3.scale.linear()
			.range([0, this._options.squareWidth])
		;

		//clear element
		this.container.selectAll('*').remove();

		//root svg
		let root = this.container.append('svg')
			.attr('width', this._options.width + 'px')
			.attr('height', this._options.width + 'px')
			.attr('class', 'graph')
		;

		//margins applied
		let svg = root.append('g')
			.attr('transform', 'translate(' + this._options.margin + ',' + this._options.margin + ')')
			.attr('class', 'board')
		;

		//board squares
		let board = util.boardSquares();

		//create the g elements for squares
		let squares = svg.selectAll('.square').data(board).enter()
			.append('g')
				.attr('class', (d) => {
					let file = String.fromCharCode(97 + d.x);
					let rank = 8 - d.y;

					return 'square ' + file + rank;
				})
				.classed('white', (d) => util.isWhite(d))
				.classed('black', (d) => ! util.isWhite(d))
		;

		//create square elements for board squares
		squares.append('rect')
			.attr('x', (d) => d.x * this._options.squareWidth)
			.attr('y', (d) => d.y * this._options.squareWidth)
			.attr('width', this._options.squareWidth + 'px')
			.attr('height', this._options.squareWidth + 'px')
			.attr('class', 'sq')
		;

		//labels among the A file
		let fileLabels = d3.range(8).map((i) => '.a' + (i + 1));

		//file labels
		svg.selectAll(fileLabels)
			.append('text')
				.attr('x', (d) => d.x * this._options.squareWidth)
				.attr('y', (d) => d.y * this._options.squareWidth)
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
				.attr('x', (d) => (d.x + 1) * this._options.squareWidth)
				.attr('y', (d) => (d.y + 1) * this._options.squareWidth)
				.attr('dx', '-0.3em')
				.attr('dy', '-0.5em')
				.attr('text-anchor', 'end')
				.text((d) => files[d.x])
				.attr('class', 'label')
		;

		//container for heatmap data
		this.dataContainer = svg.append('g')
			.attr('class', 'data-container')
		;

		//tooltip element
		this.tooltip = this.container.append('div')
			.attr('class', 'tooltip')
		;
	}

	data(data) {
		this._data = data;

		this.update();
	}

	options(options) {
		_.merge(this._options, options);

		this.update();
	}

	update() {
		let self = this;

		if( ! this._options.interactive ) {
			this.tooltip.classed('visible', false);
		}

		//set domain
		this.scale.domain(
			d3.extent(this._data, (d) => d[this._options.accessor.piece][this._options.accessor.color])
		);

		//extract relevant data
		let data = this._data.map((d) => this.scale(d[this._options.accessor.piece][this._options.accessor.color]));

		let heatSquares = this.dataContainer
			.selectAll('.heat-square').data(data)
		;

		//enter
		heatSquares.enter()
			.append('rect')
				.attr('x', (d, i) => (i % 8 * this._options.squareWidth) + (this._options.squareWidth / 2))
				.attr('y', (d, i) => (Math.floor(i / 8) * this._options.squareWidth) + (this._options.squareWidth / 2))
				.attr('width', (d) => d + 'px')
				.attr('height', (d) => d + 'px')
				.attr('transform', (d) => {
					let halfWidth = d / 2;
					return 'translate(-' + halfWidth + ',-' + halfWidth + ')';
				})
				.attr('class', 'heat-square')
				.on('mouseover', function(d, i) {
					if( ! self._options.interactive ) return;

					self.tooltip
						.html(self._data[i][self._options.accessor.piece][self._options.accessor.color])
						.style('left', (d3.event.pageX) + 'px')
						.style('top', (d3.event.pageY - 28) + 'px')
						.classed('visible', true)
					;
				})
				.on('mousemove', function (d) {
					if( ! self._options.interactive ) return;

					self.tooltip
						.style('left', (d3.event.pageX) + 'px')
						.style('top', (d3.event.pageY - 28) + 'px')
					;
				})
				.on('mouseout', function(d) {
					if( ! self._options.interactive ) return;

					self.tooltip.classed('visible', false);
				})
		;

		//enter + update
		heatSquares.transition()
			.attr('width', (d) => d + 'px')
			.attr('height', (d) => d + 'px')
			.attr('transform', (d) => {
				let halfWidth = d / 2;
				return 'translate(-' + halfWidth + ',-' + halfWidth + ')';
			})
		;
	}
}