import {Chart, Matrix} from "./chart.js";

var vectors = [
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

for (let i = 0; i < vectors.length; i++) {
	vectors[i].color = colorGradient2D(...vectors[i].vector);
}

var chart = new Chart({
	elem: d3.select(".chart"),
	width: 320,
	height: 240,
	xlim: [-6, 6],
	ylim: [-4.5, 4.5]
});

function update(data) {
	var transformedData = vectors.map((d, i) => {
		var d2 = Object.assign({}, d);
		d2.vector = numeric.dot(d.vector, numeric.transpose(data));
		return d2;
	});

	chart.setData(transformedData).draw();
}

function updateReset() {
	update(mat.data);
}

function updateSVD(data) {
	var svd = numeric.svd(data);
	U.setData(numeric.neg(svd.U)).draw();
	S.setData(numeric.diag(svd.S)).draw();
	V.setData(numeric.neg(numeric.transpose(svd.V))).draw();
}

var mat = new Matrix({
	elem: d3.select("#target"),
	editable: true
});
mat.addEventListener("input", function() {
	update(mat.data);
	updateSVD(mat.data);
});
mat.setData([[1, 0], [0, 1]]).draw();

mat.div.append("div")
		.attr("class", "bottom-note")
		.html("\\(M\\)<br>Arbitrary Matrix");

d3.select("#target").append("span")
		.attr("class", "operator")
		.text("=");

var U = new Matrix({
	elem: d3.select("#target")
});
U.div.append("div")
		.attr("class", "bottom-note")
		.html("\\(U\\)<br>Isomorphy");

d3.select("#target").append("span")
		.attr("class", "operator")
		.text("•");

var S = new Matrix({
	elem: d3.select("#target")
});
S.div.append("div")
		.attr("class", "bottom-note")
		.html("\\(\\Sigma\\)<br>Scaling");

d3.select("#target").append("span")
		.attr("class", "operator")
		.text("•");

var V = new Matrix({
	elem: d3.select("#target")
});
V.div.append("div")
		.attr("class", "bottom-note")
		.html("\\(V\\)<br>Isomorphy");

d3.select("#target").append("span")
		.attr("class", "operator")
		.text("•");

var E = new Matrix({
	elem: d3.select("#target")
}).setData([[1, 0], [0, 1]]).draw();

E.div.on("mouseenter", function () { update(E.data); });
V.div.on("mouseenter", function () { update(V.data); });
S.div.on("mouseenter", function () { update(numeric.dot(S.data, V.data)); });
U.div.on("mouseenter", function () { update(mat.data); });
mat.div.on("mouseenter", function () { update(mat.data); });

E.div.on("mouseleave", updateReset);
V.div.on("mouseleave", updateReset);
S.div.on("mouseleave", updateReset);
U.div.on("mouseleave", updateReset);
mat.div.on("mouseleave", updateReset);

update(mat.data);
updateSVD(mat.data);



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
