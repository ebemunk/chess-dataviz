/*global d3*/
/*eslint no-unused-vars: 0*/

import debug from 'debug';
import _ from 'lodash';

let log = debug('cdv:Openings');

export class Openings {
	constructor(selector, options, data) {
		//container setup
		this.container = d3.select(selector);

		let defaultOptions = {
			width: 550,
			height: 550,
			colors: d3.scale.category10(),
			arcThreshold: 0.01,
			textThreshold: 0.1
		};

		options = options || {};
		this._options = _.merge({}, defaultOptions, options);

		//event dispatcher
		this.dispatch = d3.dispatch('mouseenter', 'mousemove', 'mouseleave');

		this._partition = d3.layout.partition()
			.sort(null)
			.value(d => d.count)
		;

		let radius = Math.min(this._options.width, this._options.height) / 2;

		let xScale = d3.scale.linear().range([0, 2 * Math.PI]);
		let yScale = d3.scale.sqrt().range([0, radius]);

		this._arc = d3.svg.arc()
			.startAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x))))
			.endAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x + d.dx))))
			.innerRadius(d => Math.max(0, yScale(d.y)))
			.outerRadius(d => Math.max(0, yScale(d.y + d.dy)))
		;

		this.dataContainer = this.container.append('svg')
			.attr('width', this._options.width)
			.attr('height', this._options.height)
				.append('g')
					.attr('transform', 'translate(' + this._options.width / 2 + ',' + this._options.height / 2 + ')')
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
			'height'
		];

		_.merge(this._options, _.omit(options, omit));

		this.update();
	}

	update() {
		let self = this;

		let nodes = this._partition.nodes(this._data).filter(d => d.dx > this._options.arcThreshold);

		let arcs = this.dataContainer.selectAll('.arc').data(nodes);

		arcs.enter()
			.append('path')
				.attr('display', d => d.depth ? null : 'none')
				.attr('d', this._arc)
				.attr('fill-rule', 'evenodd')
				.attr('class', 'arc')
				.each(function(d) {
					this.x0 = 0;
					this.dx0 = 0;
				})
				.style('fill', fillColor)
		;

		arcs
			.on('mouseenter', (d, i) => {
				let parents = getParents(d);

				arcs.style('opacity', 0.3);
				arcs.filter(node => parents.indexOf(node) > -1)
				.style('opacity', 1);

				let moves = _.pluck(parents, 'san');
				this.dispatch.mouseenter(d, moves);
			})
			.on('mousemove', () => {
				this.dispatch.mousemove();
			})
			.on('mouseleave', () => {
				arcs.style('opacity', 1);

				this.dispatch.mouseleave();
			})
			.transition().duration(500)
				.attrTween('d', function (d) {
					var interpolate = d3.interpolate({
						x: this.x0,
						dx: this.dx0
					}, d);

					this.x0 = d.x;
					this.dx0 = d.dx;

					return function(t) {
						var b = interpolate(t);
						return self._arc(b);
					};
				})
			.style('fill', fillColor)
		;

		arcs.exit().remove();

		let sanText = this.dataContainer.selectAll('.san').data(nodes);
		sanText.enter()
			.append('text')
				.attr('class', 'san')
				.attr('dy', '6')
				.attr('text-anchor', 'middle')
		;

		sanText.transition().duration(500)
			.attr('transform', d => 'translate(' + this._arc.centroid(d) + ')')
			.text(d => {
				if( d.dx < this._options.textThreshold ) return '';

				return d.depth ? d.san : '';
			})
		;

		sanText.exit().remove();

		function fillColor(d, i) {
			if( i === 0 ) return;

			let rootParent = getParents(d)[0];
			let color = d3.hsl(self._options.colors(rootParent.san));

			if( d.depth % 2 === 0 ) {
				color = color.darker(0.5);
			} else {
				color = color.brighter(0.5);
			}

			color = color.darker(d.depth * 0.2);
			return color;
		}
	}
}

function getParents(node) {
	let path = [];
	let current = node;
	while( current.parent ) {
		path.unshift(current);
		current = current.parent;
	}

	return path;
}