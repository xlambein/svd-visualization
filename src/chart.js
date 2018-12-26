import {makeScrubbable} from "./scrub.js";

// The following class comes from
// https://stackoverflow.com/a/24216547
class Emitter {
	constructor() {
		var delegate = document.createDocumentFragment();
		[
			'addEventListener',
			'dispatchEvent',
			'removeEventListener'
		].forEach(f =>
			this[f] = (...xs) => delegate[f](...xs)
		)
	}
}


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
				.attr("r", "4px");

		vectors.transition()
				.ease(d3.easeLinear)
				.duration(200)
				.attr("cx", d => this.xscale(d.vector[0]))
				.attr("cy", d => this.yscale(d.vector[1]));
	}

	setData (data) {
		this.data = data;
		return this;
	}
}

export class Matrix extends Emitter {
	constructor (opts) {
		super();
		this.div = opts.elem
				.attr("class", "matrix");
		this.table = this.div.append("table");
		this.editable = opts.editable || false;

		this.inputEvent = new Event("input");
	}

	draw () {
		this.table.data([this.data]);

		var tr = this.table.selectAll("tr")
				.data(this.data);

		tr.exit().remove();

		tr = tr.enter().append("tr")
			.merge(tr);

		var td = tr.selectAll("td")
				.data(d => d);

		td.exit().remove();

		if (this.editable) {
			td = td.enter().append("td")
				.merge(td);

			var input = td.selectAll("input")
					.data(d => [d]);

			input.exit().remove();

			var matrix = this;
			input = input.enter().append("input")
				//	.attr("type", "number")
				//	.attr("step", "0.1")
				//	.attr("min", "-5")
				//	.attr("max", "5")
					.on("input", function () {
						var val = parseFloat(this.value);
						d3.select(this).datum(Number.isNaN(val) ? 0 : val);
						matrix.setData(math.reshape(input.data(), math.size(matrix.data)))
								.draw();
						matrix.dispatchEvent(matrix.inputEvent);
					})
					.on("scrub", function () {
						this.value = d3.event.detail.toFixed(2);
						d3.select(this).dispatch('input');
					})
					.each(function () {
						makeScrubbable(this);
					})
				.merge(input)
					.property("value", d => d.toFixed(2));
		} else {
			td = td.enter().append("td")
				.merge(td)
					.text(d => d.toFixed(2));
		}

		return this;
	}

	setData(data) {
		this.data = data;
		return this;
	}
}

