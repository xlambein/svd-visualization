
var scrub = {
	input: null,
	position: {x: 0, y: 0},
	value: 0
};

window.addEventListener("mousemove", function (e) {
	if (scrub.input) {
		const step = 0.1;
		const stepLen = 10;

		var delta = e.clientX - scrub.position.x;
		delta = Math.round(delta / stepLen) * step;

		var val = scrub.value + delta;

		var event = new CustomEvent('scrub', { detail: val });
		scrub.input.dispatchEvent(event);
	}
});

window.addEventListener("mouseup", function () {
	scrub.input = null;
});

export function makeScrubbable(input) {
	input.addEventListener("mousedown", function (e) {
		scrub.input = e.target;
		scrub.position.x = e.clientX;
		scrub.position.y = e.clientY;
		scrub.value = parseFloat(e.target.value);
	});
	input.addEventListener("click", function (e) {
		e.target.select();
	});
	input.style.cursor = "col-resize";
}

