// import debug from 'debug';

// let dbg = debug('cv:Openings');

export class Openings {
	constructor(selector, options) {








// Dimensions of sunburst.
var width = 550;
var height = 550;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
	w: 75, h: 30, s: 3, t: 10
};

// make `colors` an ordinal scale
var colors = d3.scale.category20();

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 

var vis = d3.select("#chart").append("svg:svg")
		.attr("width", width)
		.attr("height", height)
		.append("svg:g")
		.attr("id", "container")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.layout.partition()
		.size([2 * Math.PI, radius * radius])
		.value(function(d) { return d.size; });

var arc = d3.svg.arc()
		.startAngle(function(d) { return d.x; })
		.endAngle(function(d) { return d.x + d.dx; })
		.innerRadius(function(d) { return Math.sqrt(d.y); })
		.outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

// Use d3.csv.parseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.

//var text = getText();
//var csv = d3.csv.parseRows(text);
//var json = buildHierarchy(csv);
var json = getData();
createVisualization(json);

// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

	// Basic setup of page elements.
	// initializeBreadcrumbTrail();
	
	// d3.select("#togglelegend").on("click", toggleLegend);

	// Bounding circle underneath the sunburst, to make it easier to detect
	// when the mouse leaves the parent g.
	vis.append("svg:circle")
			.attr("r", radius)
			.style("opacity", 0);

	// For efficiency, filter nodes to keep only those large enough to see.
	var nodes = partition.nodes(json)
			.filter(function(d) {
			return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
			});
		
		var uniqueNames = (function(a) {
				var output = [];
				a.forEach(function(d) {
						if (output.indexOf(d.name) === -1) {
								output.push(d.name);
						}
				});
				return output;
		})(nodes);
		
	// set domain of colors scale based on data
	colors.domain(uniqueNames);
	
	// make sure this is done after setting the domain
	// drawLegend();
				

	var path = vis.data([json]).selectAll("path")
			.data(nodes)
			.enter().append("svg:path")
			.attr("display", function(d) { return d.depth ? null : "none"; })
			.attr("d", arc)
			.attr("fill-rule", "evenodd")
			.style("fill", function(d) { return colors(d.name); })
			.style("opacity", 1)
			// .on("mouseover", mouseover);
  var text = vis.selectAll("text").data(nodes);
  var textEnter = text.enter().append("text")
      // .attr("x", (d) => d.x)
      .attr('transform', (d) => "translate(" + arc.centroid(d) + ")")
      .text(function(d) {
      	var a = (d.dx) * 90 / Math.PI;
      	console.log(a);
      	if(a < 10) return '';
      	return d.depth ? d.name : '';
      })
      .attr('text-anchor', 'middle')
      ;

	// Add the mouseleave handler to the bounding circle.
	// d3.select("#container").on("mouseleave", mouseleave);

	// Get total size of the tree = value of root node from partition.
	// totalSize = path.node().__data__.value;
 };

// Fade all but the current sequence, and show it in the breadcrumb trail.
// function mouseover(d) {

// 	var percentage = (100 * d.value / totalSize).toPrecision(3);
// 	var percentageString = percentage + "%";
// 	if (percentage < 0.1) {
// 		percentageString = "< 0.1%";
// 	}

// 	d3.select("#percentage")
// 			.text(percentageString);

// 	d3.select("#explanation")
// 			.style("visibility", "");

// 	var sequenceArray = getAncestors(d);
// 	// updateBreadcrumbs(sequenceArray, percentageString);

// 	// Fade all the segments.
// 	d3.selectAll("path")
// 			.style("opacity", 0.3);

// 	// Then highlight only those that are an ancestor of the current segment.
// 	vis.selectAll("path")
// 			.filter(function(node) {
// 								return (sequenceArray.indexOf(node) >= 0);
// 							})
// 			.style("opacity", 1);
// }

// // Restore everything to full opacity when moving off the visualization.
// function mouseleave(d) {

// 	// Hide the breadcrumb trail
// 	d3.select("#trail")
// 			.style("visibility", "hidden");

// 	// Deactivate all segments during transition.
// 	d3.selectAll("path").on("mouseover", null);

// 	// Transition each segment to full opacity and then reactivate it.
// 	d3.selectAll("path")
// 			.transition()
// 			.duration(1000)
// 			.style("opacity", 1)
// 			.each("end", function() {
// 							d3.select(this).on("mouseover", mouseover);
// 						});

// 	d3.select("#explanation")
// 			.transition()
// 			.duration(1000)
// 			.style("visibility", "hidden");
// }

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
// function getAncestors(node) {
// 	var path = [];
// 	var current = node;
// 	while (current.parent) {
// 		path.unshift(current);
// 		current = current.parent;
// 	}
// 	return path;
// }

// function initializeBreadcrumbTrail() {
// 	// Add the svg area.
// 	var trail = d3.select("#sequence").append("svg:svg")
// 			.attr("width", width)
// 			.attr("height", 50)
// 			.attr("id", "trail");
// 	// Add the label at the end, for the percentage.
// 	trail.append("svg:text")
// 		.attr("id", "endlabel")
// 		.style("fill", "#000");
// }

// // Generate a string that describes the points of a breadcrumb polygon.
// function breadcrumbPoints(d, i) {
// 	var points = [];
// 	points.push("0,0");
// 	points.push(b.w + ",0");
// 	points.push(b.w + b.t + "," + (b.h / 2));
// 	points.push(b.w + "," + b.h);
// 	points.push("0," + b.h);
// 	if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
// 		points.push(b.t + "," + (b.h / 2));
// 	}
// 	return points.join(" ");
// }

// // Update the breadcrumb trail to show the current sequence and percentage.
// function updateBreadcrumbs(nodeArray, percentageString) {

// 	// Data join; key function combines name and depth (= position in sequence).
// 	var g = d3.select("#trail")
// 			.selectAll("g")
// 			.data(nodeArray, function(d) { return d.name + d.depth; });

// 	// Add breadcrumb and label for entering nodes.
// 	var entering = g.enter().append("svg:g");

// 	entering.append("svg:polygon")
// 			.attr("points", breadcrumbPoints)
// 			.style("fill", function(d) { return colors(d.name); });

// 	entering.append("svg:text")
// 			.attr("x", (b.w + b.t) / 2)
// 			.attr("y", b.h / 2)
// 			.attr("dy", "0.35em")
// 			.attr("text-anchor", "middle")
// 			.text(function(d) { return d.name; });

// 	// Set position for entering and updating nodes.
// 	g.attr("transform", function(d, i) {
// 		return "translate(" + i * (b.w + b.s) + ", 0)";
// 	});

// 	// Remove exiting nodes.
// 	g.exit().remove();

// 	// Now move and update the percentage at the end.
// 	d3.select("#trail").select("#endlabel")
// 			.attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
// 			.attr("y", b.h / 2)
// 			.attr("dy", "0.35em")
// 			.attr("text-anchor", "middle")
// 			.text(percentageString);

// 	// Make the breadcrumb trail visible, if it's hidden.
// 	d3.select("#trail")
// 			.style("visibility", "");

// }

// function drawLegend() {

// 	// Dimensions of legend item: width, height, spacing, radius of rounded rect.
// 	var li = {
// 		w: 75, h: 30, s: 3, r: 3
// 	};

// 	var legend = d3.select("#legend").append("svg:svg")
// 			.attr("width", li.w)
// 			.attr("height", colors.domain().length * (li.h + li.s));

// 	var g = legend.selectAll("g")
// 			.data(colors.domain())
// 			.enter().append("svg:g")
// 			.attr("transform", function(d, i) {
// 							return "translate(0," + i * (li.h + li.s) + ")";
// 					 });

// 	g.append("svg:rect")
// 			.attr("rx", li.r)
// 			.attr("ry", li.r)
// 			.attr("width", li.w)
// 			.attr("height", li.h)
// 			.style("fill", function(d) { return colors(d); });

// 	g.append("svg:text")
// 			.attr("x", li.w / 2)
// 			.attr("y", li.h / 2)
// 			.attr("dy", "0.35em")
// 			.attr("text-anchor", "middle")
// 			.text(function(d) { return d; });
// }

// function toggleLegend() {
// 	var legend = d3.select("#legend");
// 	if (legend.style("visibility") == "hidden") {
// 		legend.style("visibility", "");
// 	} else {
// 		legend.style("visibility", "hidden");
// 	}
// }

function getData() {
	return{
    "name": "ref",
    "children": [
        {
            "name": "june11",
            "children": [
                {
                    "name": "atts",
                    "children": [
                        {
                            "name": "early",
                            "size": 11
                        },
                        {
                            "name": "jcp",
                            "size": 40
                        },
                        {
                            "name": "jcpaft",
                            "size": 50
                        },
                        {
                            "name": "stillon",
                            "size": 195
                        },
                        {
                            "name": "jo",
                            "children": [
                                {
                                    "name": "early",
                                    "size": 100
                                },
                                {
                                    "name": "jcp",
                                    "size": 67
                                },
                                {
                                    "name": "jcpaft",
                                    "size": 110
                                },
                                {
                                    "name": "stillon",
                                    "size": 154
                                },
                                {
                                    "name": "sus1",
                                    "children": [
                                        {
                                            "name": "early",
                                            "size": 11
                                        },
                                        {
                                            "name": "jcp",
                                            "size": 118
                                        },
                                        {
                                            "name": "jcpaft",
                                            "size": 39
                                        },
                                        {
                                            "name": "stillon",
                                            "size": 2779
                                        }
                                    ]
                                },
                                {
                                    "name": "sus5",
                                    "children": [
                                        {
                                            "name": "early",
                                            "size": 0
                                        },
                                        {
                                            "name": "jcp",
                                            "size": 64
                                        },
                                        {
                                            "name": "jcpaft",
                                            "size": 410
                                        },
                                        {
                                            "name": "stillon",
                                            "size": 82
                                        }
                                    ]
                                },
                                {
                                    "name": "sus9",
                                    "children": [
                                        {
                                            "name": "early",
                                            "size": 1018
                                        },
                                        {
                                            "name": "jcp",
                                            "size": 3458
                                        },
                                        {
                                            "name": "jcpaft",
                                            "size": 106
                                        },
                                        {
                                            "name": "stillon",
                                            "size": 243
                                        }
                                    ]
                                },
                                {
                                    "name": "sus13",
                                    "children": [
                                        {
                                            "name": "early",
                                            "size": 110
                                        },
                                        {
                                            "name": "jcp",
                                            "size": 190
                                        },
                                        {
                                            "name": "jcpaft",
                                            "size": 80
                                        },
                                        {
                                            "name": "stillon",
                                            "size": 9190
                                        },
                                        {
                                            "name": "allsus",
                                            "size": 3970
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "noatt",
                    "size": 30
                }
            ]
        }
    ]
}
};

















	}
}