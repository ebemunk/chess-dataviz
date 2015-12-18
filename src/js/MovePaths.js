/*global d3*/
/*eslint no-unused-vars: 0*/

import _ from 'lodash';
import debug from 'debug';
import * as util from './util';

let log = debug('cv:MovePaths');

export class MovePaths {
	constructor(selector, options, data) {
		let self = this;

		if( ! selector ) throw Error('need dom selector');

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

		this._data = _.pairs(data.e7);

		let kk = [];

		this._data.forEach(d => {
			let div = d[1] / 3;

			for(let i=0; i<div; i++)
				kk.push([d[0], 1]);
		});

		this.dataContainer.selectAll('.move-path').data(kk)
		.enter().append('path')
			.attr('class', 'move-path')
			.attr('d', d => {
				function gs(d, s) {
					let square = d[0].split('-')[s].toLowerCase();

					let file = square.charCodeAt(0) - 97;
					let rank = 8 - square[1];

					let x = (file * self._options.squareWidth) + (self._options.squareWidth / 2);
					let y = (rank * self._options.squareWidth) + (self._options.squareWidth / 2);

					return {x,y};
				}

				let s = gs(d, 0);
				let e = gs(d, 1);

				let orth = {
					x: -(e.y - s.y),
					y: e.x - s.x
				};

				let norm = Math.sqrt(Math.pow(orth.x, 2) + Math.pow(orth.y, 2));
				let n1 = Math.sqrt(Math.pow(e.x-s.x, 2) + Math.pow(e.y-s.y, 2)) / 2;

				orth.x /= norm;
				orth.y /= norm;

				orth.x *= n1;
				orth.y *= n1;

				let ctrp;

				let angle = Math.atan2(e.y-s.y, e.x-s.x);
				let ng = angle * (180/Math.PI);
				ng *= -1;

				let op;

				if( e.y < s.y ) {
					if( e.x < s.x ) {
						op = -1;
					} else {
						op = 1;
					}
				} else {
					if( e.x < s.x ) {
						op = -1;
					} else {
						op = 1;
					}
				}
				if( op > 0 ) {
					ctrp = {
						x: e.x - orth.x,
						y: e.y - orth.y
					};
				} else {
					ctrp = {
						x: e.x + orth.x,
						y: e.y + orth.y
					};
				}

				let pointRandomizer = d3.random.normal(3, 2);
				let bezierRandomizer = d3.random.normal(10, 3);

				// s.x += pointRandomizer();
				// s.y += pointRandomizer();
				e.x += pointRandomizer();
				e.y += pointRandomizer();
				ctrp.x += bezierRandomizer();
				ctrp.y += bezierRandomizer();

				let str = `M${s.x},${s.y}, Q${ctrp.x},${ctrp.y} ${e.x},${e.y}`
				return str;
			});
	}
}