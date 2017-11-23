import {Chart, Matrix} from "./chart.js";

var data = [
	{vector: [1, 1]},
	{vector: [1, .5]},
	{vector: [1, 0]},
	{vector: [1, -.5]},
	{vector: [1, -1]},
	{vector: [.5, 1]},
	{vector: [0, 1]},
	{vector: [-.5, 1]},
	{vector: [.5, -1]},
	{vector: [0, -1]},
	{vector: [-.5, -1]},
	{vector: [-1, 1]},
	{vector: [-1, .5]},
	{vector: [-1, 0]},
	{vector: [-1, -.5]},
	{vector: [-1, -1]},
];

function colorGradient2D(x, y) {
	return [
		Math.round(255 * ((y + 1)/2)),
		Math.round(255 * (1 - (y + x + 2)/4)),
		Math.round(255 * ((x + 1)/2))
	];
}

for (let i = 0; i < data.length; i++) {
	data[i].color = colorGradient2D(...data[i].vector);
}

var chart = new Chart(320, 240, [-6, 6], [-4.5, 4.5]);

chart.attach(d3.select(".chart"))
		.attr("class", "chart");

var matrixData = [[1, 0], [0, 1]];

var matrix = d3.select(".matrix");

function update() {
	matrixData = math.reshape(matrix.selectAll("input").data(), [2, 2]);
	var transformedData = data.map((d, i) => {
		var d2 = Object.assign({}, d);
		d2.vector = numeric.dot(d.vector, numeric.transpose(matrixData));
		return d2;
	});

	var vectors = chart.chart.selectAll(".vector")
			.data(transformedData);

	vectors.exit().remove();

	vectors.enter().append("circle")
			.attr("class", "vector")
			.attr("fill", d => `rgb(${d.color[0]},${d.color[1]},${d.color[2]})`)
			.attr("cx", d => chart.xscale(d.vector[0]))
			.attr("cy", d => chart.yscale(d.vector[1]))
			.attr("r", "3px");

	vectors.transition()
			.attr("cx", d => chart.xscale(d.vector[0]))
			.attr("cy", d => chart.yscale(d.vector[1]));
	
	var svd = numeric.svd(matrixData);
	U.update(svd.U);
	S.update(numeric.diag(svd.S));
	V.update(numeric.transpose(svd.V));
}

var tr = matrix.selectAll("tr")
		.data(matrixData)
	.enter().append("tr");

var td = tr.selectAll("td")
		.data(d => d)
	.enter().append("td")
		.append("input")
		.attr("type", "text")
		.attr("value", d => d)
		.on("input", function () { d3.select(this).datum(Number.isNaN(+this.value) ? 0 : +this.value); update(); });

var U = new Matrix()
		.attach(d3.select("#target"));

d3.select(".bracket")
		.style("font-size", matrix.style("height"));

d3.select("#target").append("span")
		.attr("class", "operator")
		.text("•");

var S = new Matrix()
		.attach(d3.select("#target"))

d3.select("#target").append("span")
		.attr("class", "operator")
		.text("•");

var V = new Matrix()
		.attach(d3.select("#target"));

V.table.on("mouseenter", function () { console.log(V.data); });
V.table.on("mouseleave", function () { console.log("out"); });

update();



/* TODO:
 * - Abstract the vectors, the graph, and the matrix
 * - Communicate with the PubSub library
 */

/*

var start_date = new Date(2016, 9, 17, 7, 0),
	end_date = new Date(2016, 9, 17, 19, 0);

var colormap = d3.scaleOrdinal(d3.schemeCategory10);

var bands = d3.scaleBand()
		.range([0, height]);

var scale = d3.scaleTime()
		.domain([start_date, end_date])
		.rangeRound([0, width]);

var axis = d3.axisBottom(scale)
		.ticks(d3.timeMinute.every(30));

var chart = d3.select(".chart")
		.attr("width", width)
		.attr("height", height);

chart.append("g")
		.attr("transform", "translate(0, 30)")
		.call(axis);

d3.csv("closest_beacons.csv", function(d) {
	return {
		datetime: d3.isoParse(d.datetime),
		member: d.member,
		region: d.region,
		beacon: d['location']
	}
}, function(data) {
	data = data.filter(function(d) { return (d.datetime >= start_date) && (d.datetime < end_date); });
	var rects = chart.selectAll("rect")
		.data(data);

	var members = [...(new Set(data.map(function(d) { return d.member; })))];
	var beacons = [...(new Set(data.map(function(d) { return d.beacon; })))];

	bands.domain(members);
	colormap.domain(beacons);

	rects.enter().append("rect")
			.attr("y", function(d) { return bands(d.member); })
			.attr("x", function(d) { return scale(d.datetime); })
			.attr("height", function(d) { return bands.bandwidth(); })
			.attr("width", function(d) { return scale(d3.timeMinute.offset(d.datetime, 1)) - scale(d.datetime); })
			.style("fill", function(d) { return colormap(d.beacon); });

	rects.exit().remove();
});

*/


//var circle = chart.selectAll("circle")
//	.data(data);
//
//circle.enter().append("circle")
//		.attr("r", 20.5)
//	.merge(circle)
//		.attr("cx", function(d) { return d.x })
//		.attr("cy", function(d) { return d.y });
