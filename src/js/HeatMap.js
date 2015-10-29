/*global d3*/
/*eslint no-unused-vars: 0*/

import _ from 'lodash';
import dbg from 'debug';
import * as util from './util';

let debug = dbg('cdv:HeatMap');

export class HeatMap {
	constructor(selector, options, data) {
		let self = this;

		if( ! selector ) throw Error('need dom selector');

		this.data = data;

		//container setup
		this.selector = selector;

		this.container = d3.select(selector);

		//options
		let defaultOptions = {
			sideLength: 500,
			margin: 20,
			interactive: true,
			accessor: {
				piece: 'all',
				color: 'w'
			}
		};

		options = options || {};

		this.options = _.merge({}, defaultOptions, options);

		//calculate some things to use later
		this.options.totalSideLength = this.options.sideLength;
		this.options.sideLength = this.options.sideLength - this.options.margin * 2;
		this.options.squareLength = Math.floor(this.options.sideLength / 8);

		//scale
		this.scale = d3.scale.linear()
			.range([0, this.options.squareLength])
		;

		//board squares
		let board = [];
		for( let i = 0; i < 64; i++ ) {
			board.push({
				x: i % 8,
				y: Math.floor(i / 8)
			});
		}

		//check if a square is white
		function isWhite(d) {
			return (! (d.x % 2) && ! (d.y % 2)) || (d.x % 2 && d.y % 2);
		}

		//clear element
		this.container.selectAll('*').remove();

		//root svg
		let root = this.container.append('svg')
			.attr('width', this.options.totalSideLength + 'px')
			.attr('height', this.options.totalSideLength + this.options.squareLength + 'px')
			.attr('class', 'graph')
		;

		//margins applied
		let svg = root.append('g')
			.attr('transform', 'translate(' + this.options.margin + ',' + this.options.margin + ')')
			.attr('class', 'board')
		;

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
			.attr('x', (d) => d.x * this.options.squareLength)
			.attr('y', (d) => d.y * this.options.squareLength)
			.attr('width', this.options.squareLength + 'px')
			.attr('height', this.options.squareLength + 'px')
		;

		//a-h labels for files
		let files = d3.range(8).map((i) => String.fromCharCode(97 + i));
		//labels among the A file
		let fileLabels = d3.range(8).map((i) => '.a' + (i + 1));

		//file labels
		svg.selectAll(fileLabels)
			.append('text')
				.attr('x', (d) => d.x * this.options.squareLength)
				.attr('y', (d) => d.y * this.options.squareLength)
				.attr('dx', '0.2em')
				.attr('dy', '1em')
				.text((d) => 8 - d.y)
				.attr('class', 'label')
		;

		//labels for 1st rank
		let rankLabels = files.slice().map((file) => '.' + file + '1');

		//rank labels
		svg.selectAll(rankLabels)
			.append('text')
				.attr('x', (d) => (d.x + 1) * this.options.squareLength)
				.attr('y', (d) => (d.y + 1) * this.options.squareLength)
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

		//piece selector container
		root.append('g')
			.attr('class', 'piece-selector')
			.attr('transform', 'translate(' + this.options.margin + ',' + (this.options.margin + this.options.sideLength) + ')')
		;

		//color toggle piece selector
		this.container.select('.piece-selector')
			.append('circle')
				.attr('r', this.options.squareLength / 2)
				.attr('cx', this.options.squareLength / 2)
				.attr('cy', this.options.squareLength / 2)
				.attr('class', self.options.accessor.color == 'w' ? 'white' : 'black')
				.classed('color-toggle', true)
				.on('click', function(d) {
					d3.select(this)
						.attr('class', self.options.accessor.color == 'b' ? 'white' : 'black')
						.classed('color-toggle', true)
					;
					self.options.accessor.color = (self.options.accessor.color == 'b' ? 'w' : 'b');
					self.updatePieceSelectors();
					self.update();
				})
			.append('svg:title')
					.text('Switch Color')
		;

		//tooltip element
		this.tooltip = this.container
			.append('div')
				.attr('class', 'tooltip')
		;

		this.updatePieceSelectors();
	}

	updatePieceSelectors() {
		let self = this;

		var pieceTitles = {
			all: 'All',
			k: 'King',
			q: 'Queen',
			r: 'Rook',
			b: 'Bishop',
			n: 'Knight',
			p: 'Pawn'
		};

		var colors = {
			b: 'Black',
			w: 'White'
		};

		//construct individual piece elements
		let pieces = [{
			piece: 'all',
			image: util.pieces.all,
			key: pieceTitles.all
		}];

		for( let key in util.pieces[this.options.accessor.color] ) {
			pieces.push({
				piece: key,
				image: util.pieces[this.options.accessor.color][key],
				key: colors[this.options.accessor.color] + ' ' + pieceTitles[key]
			});
		}

		//create the selector pieces
		let selectors = this.container.select('.piece-selector')
			.selectAll('.piece').data(pieces, (d) => d.key)
		;

		//enter
		selectors.enter()
			.append('image')
				.attr('width', this.options.squareLength)
				.attr('height', this.options.squareLength)
				.attr('x', (d, i) => (this.options.squareLength) * (i + 1))
				.attr('xlink:href', (d) => d.image)
				.attr('class', 'piece')
				.classed('selected', (d) => this.options.accessor.piece == d.piece)
				.on('click', function(d) {
					self.container.select('.piece-selector').selectAll('.piece').classed('selected', false);
					d3.select(this).classed('selected', true);
					self.options.accessor.piece = d.piece;
					self.update();
				})
				.append('svg:title')
					.text((d) => d.key)
		;

		//exit
		selectors.exit().remove();
	}

	setData(data) {
		this.data = data;
	}

	update() {
		let self = this;

		//set domain
		this.scale.domain(
			d3.extent(this.data, (d) => d[this.options.accessor.piece][this.options.accessor.color])
		);

		//extract relevant data
		let data = this.data.map((d) => this.scale(d[this.options.accessor.piece][this.options.accessor.color]));

		let heatSquares = this.dataContainer
			.selectAll('.heat-square').data(data)
		;

		//enter
		heatSquares.enter()
			.append('rect')
				.attr('x', (d, i) => (i % 8 * this.options.squareLength) + (this.options.squareLength / 2))
				.attr('y', (d, i) => (Math.floor(i / 8) * this.options.squareLength) + (this.options.squareLength / 2))
				.attr('width', (d) => d + 'px')
				.attr('height', (d) => d + 'px')
				.attr('transform', (d) => {
					let halfWidth = d / 2;
					return 'translate(-' + halfWidth + ',-' + halfWidth + ')';
				})
				.attr('class', 'heat-square')
				.on('mouseover', function(d, i) {
					self.tooltip
						.html(self.data[i][self.options.accessor.piece][self.options.accessor.color])
						.style('left', (d3.event.pageX) + 'px')
						.style('top', (d3.event.pageY - 28) + 'px')
						.classed('visible', true)
					;
				})
				.on('mousemove', function (d) {
					self.tooltip
						.style('left', (d3.event.pageX) + 'px')
						.style('top', (d3.event.pageY - 28) + 'px')
					;
				})
				.on('mouseout', function(d) {
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