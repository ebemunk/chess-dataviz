/*global d3*/
/*eslint no-unused-vars: 0*/

import _ from 'lodash';
import dbg from 'debug';

let debug = dbg('cdv:MovePaths');

export class MovePaths {
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
			interactive: true
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
			.attr('height', this.options.totalSideLength + 'px')
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

		//tooltip element
		this.tooltip = this.container
			.append('div')
				.attr('class', 'tooltip')
		;

		// var d1 = d3.svg.diagonal()
  //          .source( {"x":0, "y":0} )
  //          .target( {"x":250, "y":250} );

		// this.dataContainer.append("path")
		//     .attr("stroke", "blue")
		//     .attr("fill", "transparent")
		//     .attr("stroke-width", "10")
		//     .attr("d", d1);
	}
}