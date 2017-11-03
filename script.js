var data = [
	{color: 'red', vector: [1, 1]},
	{color: 'blue', vector: [-1, 1]},
	{color: 'green', vector: [-1, -1]},
	{color: 'yellow', vector: [1, -1]}
];

var margin = {top: 10, right: 10, bottom: 10, left: 10},
	width = 640 - margin.left - margin.right,
	height = 480 - margin.top - margin.bottom;

var xlim = [-6., 6.],
	ylim = [-4.5, 4.5];

var cx = width / 2,
	cy = height / 2;

var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`);

var xscale = d3.scaleLinear()
		.domain(xlim)
		.range([0, width]),
	yscale = d3.scaleLinear()
		.domain(ylim)
		.range([height, 0]);

var xaxis = d3.axisTop(xscale)
		.tickSizeOuter(0)
	yaxis = d3.axisRight(yscale)
		.tickSizeOuter(0);

chart.append("g")
		.attr("class", "axis")
		.attr("transform", `translate(0, ${cy})`)
		.call(xaxis);

chart.append("g")
		.attr("class", "axis")
		.attr("transform", `translate(${cx}, 0)`)
		.call(yaxis);

var matrixData = [[1, 0], [0, 1]];

var matrix = d3.select(".matrix");

function update() {
	matrixData = matrix.selectAll("input").data();
	var M = math.reshape(matrixData, [2, 2]);
	var transformedData = data.map((d, i) => {
		var d2 = Object.assign({}, d);
		d2.vector = numeric.dot(d.vector, numeric.transpose(M));
		return d2;
	});

	var vectors = chart.selectAll(".vector")
			.data(transformedData);

	vectors.enter()	
			.append("circle")
			.attr("class", "vector")
			.attr("fill", d => d.color)
			.attr("cx", d => xscale(d.vector[0]))
			.attr("cy", d => yscale(d.vector[1]))
			.attr("r", "5px");

	vectors.transition()
			.attr("cx", d => xscale(d.vector[0]))
			.attr("cy", d => yscale(d.vector[1]));

	vectors.exit().remove();
}

var tr = matrix.selectAll("tr")
		.data(matrixData)
	.enter()
		.append("tr");

var td = tr.selectAll("td")
		.data(d => d)
	.enter()
		.append("td")
		.append("input")
		.attr("type", "text")
		.attr("value", d => d)
		.on("input", function () { d3.select(this).datum(Number.isNaN(+this.value) ? 0 : +this.value); update(); });

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
