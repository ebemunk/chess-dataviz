import dbg from 'debug';
import _ from 'lodash';

let debug = dbg('cv:Openings');

export class Openings {
	constructor(selector, options, data) {
		let self = this;

		if( ! selector ) throw Error('need dom selector');

		let defaultOptions = {
			width: 550,
			height: 550,
			colors: d3.scale.category10(),
			arcThreshold: 0.01,
			textThreshold: 0.1
		};

		options = options || {};

		this.options = _.merge({}, defaultOptions, options);
		this.container = d3.select(selector);
		this.dispatch = d3.dispatch('mouseenter', 'mouseleave');

		debug('constructor', this.options);

		this.partition = d3.layout.partition()
			.sort(null)
			.value(d => d.count)
		;

		let radius = Math.min(this.options.width, this.options.height) / 2;

		let xScale = d3.scale.linear()
			.range([0, 2 * Math.PI])
		;

		let yScale = d3.scale.sqrt()
			.range([0, radius])
		;

		this.root = this.container.append('svg')
			.attr('width', this.options.width)
			.attr('height', this.options.height)
				.append('g')
					.attr('transform', 'translate(' + this.options.width / 2 + ',' + this.options.height / 2 + ')')
		;

		this.arc = d3.svg.arc()
			.startAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x))))
			.endAngle(d => Math.max(0, Math.min(2 * Math.PI, xScale(d.x + d.dx))))
			.innerRadius(d => Math.max(0, yScale(d.y)))
			.outerRadius(d => Math.max(0, yScale(d.y + d.dy)))
		;

		if( data ) this.update(data);
	}

	update(data) {
		debug('update');

		let self = this;

		let nodes = this.partition.nodes(data).filter(d => d.dx > this.options.arcThreshold);
		let totalCount = nodes[0].value;
		let percentageFormat = d3.format('.2p');

		let arcs = this.root.selectAll('.arc').data(nodes);

		arcs.enter()
			.append('path')
				.attr('display', d => d.depth ? null : 'none')
				.attr('d', this.arc)
				.attr('fill-rule', 'evenodd')
				.attr('class', 'arc')
				.each(function(d) {
					this.x0 = 0;
					this.dx0 = 0;
				})
		;

		arcs
			.style('fill', (d, i) => { 
				if( i === 0 ) return;

				let rootParent = this.getParents(d)[0];
				let color = d3.hsl(this.options.colors(rootParent.san));

				if( d.depth % 2 === 0 ) {
					color = color.darker(0.5);
				} else {
					color = color.brighter(0.5);
				}

				color = color.darker(d.depth * 0.2);
				return color; 
			})
			.on('mouseenter', (d, i) => {
				let parents = this.getParents(d);

				arcs.style('opacity', 0.3);
				arcs.filter(node => {return parents.indexOf(node) > -1})
				.style('opacity', 1);

				let count = d.count || 0;

				this.percentageText.text(percentageFormat(d.count / totalCount));
				this.countText.text(d.count + ' games');

				let moves = _.pluck(parents, 'san');
				this.dispatch.mouseenter(d, i, moves);
			})
			.on('mouseleave', () => {
				arcs.style('opacity', 1);

				this.percentageText.text(percentageFormat(1));
				this.countText.text(totalCount + ' games');

				this.dispatch.mouseleave();
			})
			.transition().duration(500)
				.attrTween('d', function (d) {
					var interpolate = d3.interpolate({
						x: this.x0,
						dx: this.dx0
					}, d);

					return function(t) {
						var b = interpolate(t);
						return self.arc(b);
					}
				})
		;

		arcs.exit().remove();

		let sanText = this.root.selectAll('.san').data(nodes);
		sanText.enter()
			.append('text')
				.attr('class', 'san')
				.attr('dy', '6')
				.attr('text-anchor', 'middle')
		;

		sanText.transition().duration(500)
			.attr('transform', d => 'translate(' + this.arc.centroid(d) + ')')
			.text(d => {
				if( d.dx < this.options.textThreshold ) return '';

				return d.depth ? d.san : '';
			})
		;

		sanText.exit().remove();

		if( ! this.percentageText ) {
			this.percentageText = this.root
				.append('text')
					.attr('class', 'percentage-text')
					.attr('text-anchor', 'middle')
					.text(percentageFormat(1))
			;
		}

		if( ! this.countText ) {
			this.countText = this.root
				.append('text')
					.attr('class', 'count-text')
					.attr('text-anchor', 'middle')
					.attr('dy', 25)
					.text(totalCount + ' games')
			;
		}
	}

	getParents(node) {
		let path = [];
		let current = node;
		while( current.parent ) {
			path.unshift(current);
			current = current.parent;
		}

		return path;
	}
}