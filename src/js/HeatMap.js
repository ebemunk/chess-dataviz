/*global d3*/
/*eslint no-unused-vars: 0*/

import _ from 'lodash';
import debug from 'debug';
import * as util from './util';

let log = debug('cdv:HeatMap');

export class HeatMap {
	constructor(selector, options, data) {
		//container setup
		this.container = d3.select(selector);

		//options
		let defaultOptions = {
			width: 500,
			margin: 20,
			accessor: {
				piece: 'all',
				color: 'w'
			},
			sizeScale: true,
			colorScale: false
		};

		options = options || {};
		this._options = _.merge({}, defaultOptions, options);

		this._options.boardWidth = this._options.width - this._options.margin * 2;
		this._options.squareWidth = Math.floor(this._options.boardWidth / 8);

		//event dispatcher
		this.dispatch = d3.dispatch('mouseenter', 'mousemove', 'mouseleave');

		//scales
		this._scale = {
			size: d3.scale.linear().range([0, this._options.squareWidth]),
			color: d3.scale.linear().range(['blue', 'red'])
		};

		if( _.isArray(this._options.colorScale) ) {
			this._scale.color.range(this._options.colorScale);
		}

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

		util.drawBoard(svg, this._options.squareWidth);

		//container for heatmap data
		this.dataContainer = svg.append('g')
			.attr('class', 'data-container')
		;

		if( data ) {
			this.data(data);
		}
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
		let self = this;

		//adjust scales
		let extent = d3.extent(this._data, (d) => d[this._options.accessor.piece][this._options.accessor.color]);

		this._scale.size.domain(extent);
		this._scale.color.domain(extent);

		//update heat squares
		let heatSquares = this.dataContainer
			.selectAll('.heat-square').data(this._data)
		;

		//enter
		heatSquares.enter()
			.append('rect')
				.attr('x', (d, i) => (i % 8 * this._options.squareWidth) + (this._options.squareWidth / 2))
				.attr('y', (d, i) => (Math.floor(i / 8) * this._options.squareWidth) + (this._options.squareWidth / 2))
				.attr('width', (d) => squareSize(d) + 'px')
				.attr('height', (d) => squareSize(d) + 'px')
				.attr('transform', (d) => {
					let halfWidth = squareSize(d) / 2;
					return 'translate(-' + halfWidth + ',-' + halfWidth + ')';
				})
				.attr('class', 'heat-square')
				.style('fill', (d, i) => squareColor(d))
				.on('mouseenter', (d, i) => {
					this.dispatch.mouseenter(d[this._options.accessor.piece][this._options.accessor.color]);
				})
				.on('mousemove', (d, i) => {
					this.dispatch.mousemove();
				})
				.on('mouseout', (d, i) => {
					this.dispatch.mouseleave();
				})
		;

		//enter + update
		heatSquares.transition()
			.attr('width', (d) => squareSize(d) + 'px')
			.attr('height', (d) => squareSize(d) + 'px')
			.attr('transform', (d) => {
				let halfWidth = squareSize(d) / 2;
				return 'translate(-' + halfWidth + ',-' + halfWidth + ')';
			})
			.style('fill', (d, i) => squareColor(d))
		;

		function squareSize(d) {
			let size;

			if( self._options.sizeScale ) {
				size = self._scale.size(d[self._options.accessor.piece][self._options.accessor.color]);
			} else {
				size = self._options.squareWidth;
			}

			return size;
		}

		function squareColor(d) {
			let color;

			if( self._options.colorScale ) {
				color = self._scale.color(d[self._options.accessor.piece][self._options.accessor.color]);
			}

			return color;
		}
	}
}