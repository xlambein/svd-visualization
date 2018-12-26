# Two-dimensional SVD Visualizer

A simple tool to help understand the SVD by visualizing what it does to a 2D matrix in terms of transformed vectors.


## Requirements

You need `npm` to install the modules and build the project.


## Install & Run

The following commands clone the repo, install the dependencies, build the project and start a local HTTP server:

```bash
git clone https://github.com/xlambein/svd-visualization.git
cd svd-visualization
npm install
npm run build
npm run serve
```

Once this is done, open your browser to the URL indicated (most probably, [127.0.0.1:8080](http://127.0.0.1:8080/)).


## How to Use It

Shortly: the dots on the chart are vectors that are transformed by a matrix (initially, the identity).  Changing the fields in the editable matrix below on the left changes the tranform applied to these vectors.  It also changes the matrix of the SVD, displayed on the right.  Hovering over the various matrices will change the transform applied to the vectors.  More specifically, the vertical vectors `(x, y)` will display the vectors on the chart in their initial position; the matrix `V` will display the vectors transformed by `V`; the matrix `Σ` will display the vectors transformed by `V` then `Σ`; any other location will show `V` then `Σ` then `U`, which is just `M`.