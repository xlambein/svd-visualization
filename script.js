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
	elem: d3.select("#M"),
	editable: true
});
mat.addEventListener("input", function() {
	update(mat.data);
	updateSVD(mat.data);
});
mat.setData([[1, 0], [0, 1]]).draw();

var U = new Matrix({
	elem: d3.select("#U")
});

var S = new Matrix({
	elem: d3.select("#S")
});

var V = new Matrix({
	elem: d3.select("#V")
});

var E = d3.selectAll(".matrix-vector");

E.on("mouseenter", function () { update([[1, 0], [0, 1]]); });
V.div.on("mouseenter", function () { update(V.data); });
S.div.on("mouseenter", function () { update(numeric.dot(S.data, V.data)); });
U.div.on("mouseenter", function () { update(mat.data); });
mat.div.on("mouseenter", function () { update(mat.data); });

E.on("mouseleave", updateReset);
V.div.on("mouseleave", updateReset);
S.div.on("mouseleave", updateReset);
U.div.on("mouseleave", updateReset);
mat.div.on("mouseleave", updateReset);

update(mat.data);
updateSVD(mat.data);

