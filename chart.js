
export class Chart {
	constructor (opts) {
		this.margin = opts.margin || {top: 10, right: 10, bottom: 10, left: 10};
		this.width = opts.width - this.margin.left - this.margin.right;
		this.height = opts.height - this.margin.top - this.margin.bottom;
		this.xlim = opts.xlim || [-1, 1];
		this.ylim = opts.ylim || [-1, 1];

		this.xscale = d3.scaleLinear()
				.domain(this.xlim)
				.range([0, this.width]);
		this.yscale = d3.scaleLinear()
				.domain(this.ylim)
				.range([this.height, 0]);

		this.chart = opts.elem.append("svg")
				.attr("width", this.width + this.margin.left + this.margin.right)
				.attr("height", this.height + this.margin.top + this.margin.bottom)
			.append("g")
				.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

		var xaxis = d3.axisTop(this.xscale)
				.tickSizeOuter(0),
			yaxis = d3.axisRight(this.yscale)
				.tickSizeOuter(0);

		this.chart.append("g")
				.attr("class", "axis")
				.attr("transform", `translate(0, ${this.height/2})`)
				.call(xaxis);

		this.chart.append("g")
				.attr("class", "axis")
				.attr("transform", `translate(${this.width/2}, 0)`)
				.call(yaxis);

		this.vectors = this.chart.append("g");
	}

	draw () {
		var vectors = this.vectors.selectAll(".vector")
				.data(this.data);

		vectors.exit().remove();

		vectors.enter().append("circle")
				.attr("class", "vector")
				.attr("fill", d => `rgb(${d.color[0]},${d.color[1]},${d.color[2]})`)
				.attr("cx", d => this.xscale(d.vector[0]))
				.attr("cy", d => this.yscale(d.vector[1]))
				.attr("r", "3px");

		vectors.transition()
				.attr("cx", d => this.xscale(d.vector[0]))
				.attr("cy", d => this.yscale(d.vector[1]));
	}

	setData (data) {
		this.data = data;
		return this;
	}
}

export class Matrix {
	constructor() {
	}

	attach (selection) {
		this.div = selection.append("div")
				.attr("class", "matrix");
		this.table = this.div.append("table");

		return this;
	}

	update (data) {
		this.data = data;

		this.table.data([data]);

		var tr = this.table.selectAll("tr")
				.data(this.data);

		tr.exit().remove();

		tr = tr.enter().append("tr")
			.merge(tr);

		var td = tr.selectAll("td")
				.data(d => d);

		td.exit().remove();

		td = td.enter().append("td")
			.merge(td)
				.text(d => d.toFixed(2));

		return this;
	}
}
