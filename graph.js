function ChessGraph(selector, playerInfoSelector, options) {
	//element
	this.container = d3.select(selector);
	this.playerInfoContainer = d3.select(playerInfoSelector);

	//options
	this.defaults = {
		width: 760,
		height: 500,
		margin: {
			top: 40,
			right: 40,
			bottom: 20,
			left: 40
		},
		interactive: true
	};

	this.options = $.extend(true, {}, this.defaults, options);

	this.width = this.options.width - this.options.margin.left - this.options.margin.right;
	this.height = this.options.height - this.options.margin.top - this.options.margin.bottom;

	//scales
	this.xScale = d3.scale.ordinal()
		.rangeBands([0, this.width], 0.1, 0)
	;

	this.yEvalScale = d3.scale.linear()
		.range([this.height, 0])
		.domain([-5, 5]) //static
		.clamp(true)
	;

	this.yTimeScale = d3.scale.linear()
		.range([this.height, 0])
	;

	//axes
	this.xAxis = d3.svg.axis()
		.scale(this.xScale)
		.orient('top')
	;

	this.yEvalAxis = d3.svg.axis()
		.scale(this.yEvalScale)
		.orient('left')
	;

	this.yTimeAxis = d3.svg.axis()
		.scale(this.yTimeScale)
		.orient('right')
		.tickFormat(function (d) {return Math.abs(d);})
	;

	this.init();
}

//parse time usage in minutes
ChessGraph.prototype.minuteParser = function(d, i) {
	var min = d.time.match(/(\d+)m/);
	min = min ? +min[1] : 0;

	var sec = d.time.match(/(\d+)s/);
	sec = sec ? +sec[1] : 0;

	var minutes = min + sec / 60;

	if( i % 2 ) {
		minutes = -minutes;
	}

	return minutes;
};

//parse score
ChessGraph.prototype.scoreParser = function(score) {
	//mate notation
	if( score.match(/#/g) ) {
		score = score.replace('#', '');
		//just make it a big number
		score = +score * 10;
	}

	return score;
};

//graph initialization
ChessGraph.prototype.init = function() {
	var self = this;

	//clear element
	this.container.selectAll('*').remove();

	var root = this.container
		//root svg which isnt transformed
		.append('svg')
			.attr('class', 'graph')
			.attr('width', this.width + this.options.margin.left + this.options.margin.right)
			.attr('height', this.height + this.options.margin.top + this.options.margin.bottom)
	;

	//margins applied
	var svg = root.append('g')
		.attr('transform', 'translate(' + this.options.margin.left + ',' + this.options.margin.top + ')')
	;

	//xAxis
	svg
		.append('g')
			.attr('class', 'x axis')
			.call(this.xAxis)
		.append('text')
			.attr('text-anchor', 'end')
			.attr('transform', 'translate(' + this.width / 2 + ',-25)')
			.text('moves (ply)')
			.attr('class', 'label')
	;

	//yEvalAxis
	svg
		.append('g')
			.attr('class', 'yEval axis')
			.call(this.yEvalAxis)
		.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'rotate(-90) translate(' + -this.yEvalScale(0) + ',-25)')
			.text('area: evaluation (pawns)')
			.attr('class', 'label')
	;

	//yTimeAxis
	svg
		.append('g')
			.attr('class', 'yTime axis')
			.attr('transform', 'translate(' + this.width + ',0)')
			.call(this.yTimeAxis)
		.append('text')
			.attr('text-anchor', 'middle')
			.attr('transform', 'rotate(-90) translate(' + -this.yEvalScale(0) + ',35)')
			.text('bars: move time (minutes)')
			.attr('class', 'label')
	;

	//eval guide lines
	var evalGuides = svg.append('g')
		.attr('class', 'eval-guides')
	;

	var evalGuideLines = [
		0.5, -0.5,
		1, -1,
		2, -2
	];

	var evalGuideTexts = [
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
				.attr('y1', function (d) { return self.yEvalScale(d); })
				.attr('x2', this.width)
				.attr('y2', function (d) { return self.yEvalScale(d); })
				.attr('class', 'eval-guide-line')
	;

	evalGuides.selectAll('.eval-guide-text')
		.data(evalGuideTexts).enter()
			.append('text')
				.attr('transform', function (d) {
					var offset = d.dy ? d.dy : 0;
					return 'translate(5,' + (self.yEvalScale(d.y) + offset) + ')';
				})
				.text(function (d) { return d.text; })
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
	var interactiveLayer = svg.append('g')
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
			.attr('class', function (d) { return 'guide ' + d + '-guide'; })
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
			var mouseX = d3.mouse(this)[0];
			var leftEdges = self.xScale.range();
			var width = self.xScale.rangeBand();
			var j;
			for(j=0; mouseX > (leftEdges[j] + width); j++) {}

			//convert it to the range on screen
			var xPoint = self.xScale.domain()[j];
			var xPosition = self.xScale(xPoint) + (self.xScale.rangeBand() / 2);

			if( ! xPosition ) return;

			//draw x axis guide
			interactiveLayer.select('.x-guide')
				.classed('hidden', false)
				.attr('x1', xPosition)
				.attr('y1', 0 - 6)
				.attr('x2', xPosition)
				.attr('y2', self.height)
			;

			//draw yEval guide
			var score = self.scoreParser(self.game.notation[xPoint].score);
			var yPosition = self.yEvalScale(score);

			interactiveLayer.select('.yEval-guide')
				.classed('hidden', false)
				.attr('x1', 0 - 6)
				.attr('y1', yPosition)
				.attr('x2', xPosition)
				.attr('y2', yPosition)
			;

			//draw yTime guide
			var minutes = self.minuteParser(self.game.notation[xPoint], xPoint);
			yPosition = self.yTimeScale(minutes);

			interactiveLayer.select('.yTime-guide')
				.classed('hidden', false)
				.attr('x1', xPosition)
				.attr('y1', yPosition)
				.attr('x2', self.width + 6)
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
};

//update graph data with new game
ChessGraph.prototype.update = function(game) {
	var self = this;

	this.game = game;

	//set scale domains
	this.xScale.domain(d3.range(game.notation.length));

	var y2max = d3.max(
		d3.extent(game.notation, this.minuteParser).map(Math.abs)
	);
	this.yTimeScale.domain([-y2max, y2max]);

	//only show every 10th move tick on x-axis
	this.xAxis.tickValues(this.xScale.domain().filter(function (d, i) {
		return ! (i % 10);
	}));

	//line generator
	var line = d3.svg.line()
		.x(function (d, i) {
			return self.xScale(i) + (self.xScale.rangeBand() / 2);
		})
		.y(function (d) {
			var score = self.scoreParser(d.score);

			return self.yEvalScale(score);
		})
	;

	//area generator
	var area = d3.svg.area()
		.x(line.x())
		.y1(line.y())
		.y0(this.yEvalScale(0))
	;

	//axes
	var axes = this.container.transition();

	axes.select('g.x.axis')
		.call(this.xAxis)
	;
	axes.select('g.yTime.axis')
		.call(this.yTimeAxis)
	;
	axes.select('g.yEval.axis')
		.call(this.yEvalAxis)
	;

	//bars

	//join
	var bars = this.container.select('.bars')
		.selectAll('.bar')
		.data(game.notation)
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
		.delay(function (d, i) {
			return i / self.xScale.domain().length * 500;
		})
		.attr('x', function (d, i) { return self.xScale(i); })
		.attr('width', this.xScale.rangeBand())
		.attr('y', function (d, i) {
			var minutes = self.minuteParser(d, i);

			if( minutes > 0 ) {
				return self.yTimeScale(minutes);
			} else {
				return self.yTimeScale(0);
			}
		})
		.attr('height', function (d, i) {
			var minutes = self.minuteParser(d, i);

			if( minutes > 0 ) {
				return self.yTimeScale(0) - self.yTimeScale(minutes);
			} else {
				return self.yTimeScale(minutes) - self.yTimeScale(0); 
			}
		})
		.attr('class', function (d, i) {
			return 'bar ' + (i % 2 ? 'black' : 'white');
		})
	;

	//exit
	bars.exit()
		.transition()
		.delay(function (d, i) {
			return i / self.xScale.domain().length * 500;
		})
		.attr('height', 0)
		.remove()
	;

	//lines
	var lines = this.container.select('.lines')
		.selectAll('.line')
	;

	//enter
	lines
		.data(['white', 'black']).enter()
		.append('path')
			.attr('class', function(d) { return 'line ' + d; })
			.attr('clip-path', function(d) { return 'url(#clip-' + d + ')'; })
			.datum(game.notation)
			.attr('d', line)
	;

	//update + enter
	lines
		.datum(game.notation)
		.transition()
		.attr('d', line)
	;

	//areas
	var areas = this.container.select('.areas')
		.selectAll('.area')
	;

	//enter
	areas
		.data(['white', 'black']).enter()
		.append('path')
			.attr('class', function(d) { return 'area ' + d; })
			.attr('clip-path', function(d) { return 'url(#clip-' + d + ')'; })
			.datum(game.notation)
			.attr('d', area)
	;

	//update + enter
	areas
		.datum(game.notation)
		.transition()
		.attr('d', area)
	;

	this.updatePlayers(game);
};

//update player information pane
ChessGraph.prototype.updatePlayers = function(game) {
	this.playerInfoContainer.select('.white .name').text(game.white);
	this.playerInfoContainer.select('.white .rating').text(game.whiteElo);
	this.playerInfoContainer.select('.white .image img').attr('src', game.whiteImg);
	this.playerInfoContainer.select('.black .name').text(game.black);
	this.playerInfoContainer.select('.black .rating').text(game.blackElo);
	this.playerInfoContainer.select('.black .image img').attr('src', game.blackImg);

	var winner = game.winner == 'draw' ? 'draw' : game.winner + ' wins';
	this.playerInfoContainer.select('.result').text(winner);
};