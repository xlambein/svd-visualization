
export class Chart {
	constructor (width, height, xlim = [-1, 1], ylim = [-1, 1]) {
		this.margin = {top: 10, right: 10, bottom: 10, left: 10};
		this.width = width - this.margin.left - this.margin.right;
		this.height = height - this.margin.top - this.margin.bottom;

		this.xscale = d3.scaleLinear()
				.domain(xlim)
				.range([0, this.width]);
		this.yscale = d3.scaleLinear()
				.domain(ylim)
				.range([this.height, 0]);
	}

	attach (selection) {
		this.chart = selection.append("svg")
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

		return this.chart;
	}
}

export class Matrix {
	constructor() {
	}

	attach (selection) {
		this.table = selection.append("table")
				.attr("class", "matrix");

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
