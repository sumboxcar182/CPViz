<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<script src="https://cdn.rawgit.com/imranghory/treemap-squared/master/min/treemap-squared-0.5.min.js"></script>

<script type='text/javascript'>

	var mx, my;

	onmousemove = function(e)
	{
	   mx = e.pageX;
	   my = e.pageY;
	}

function sPlot (testname, dataPoint) {
  this.testName = testname;
  this.data = [];
}

sPlot.numCreated = 0;


sPlot.prototype.addData = function(x, y, z) {
  this.data.push(x != null ? x : 0);
};

sPlot.prototype.createPlotlyRepresentation = function()
{
	++sPlot.numCreated;
}


document.addEventListener('DOMContentLoaded', function(event) {

   // add javascript code here
// declaring arrays
var shapes = [];
var annotations = [];
var counter = 0;

// For Hover Text
var x_trace = [];
var y_trace = [];
var text = [];

//colors
var colors = ['rgb(166,206,227)', 'rgb(31,120,180)', 'rgb(178,223,138)', 'rgb(51,160,44)', 'rgb(251,154,153)', 'rgb(227,26,28)', 'rgb(253,191,111)', 'rgb(255,127,0)', 'rgb(202,178,214)', 'rgb(106,61,154)', 'rgb(255,255,153)', 'rgb(177,89,40)'];

// Generate Rectangles using Treemap-Squared
var values = [];
var container = document.querySelector(CPVisualization.getContainerSelector());
var summary = CPVisualization.getData();
var metricTitles = CPVisualization.getSummaryData(false).headers.metrics;
var data = summary.data;
var headers = summary.headers;
var container = document.querySelector(CPVisualization.getContainerSelector());


for( var i = 0; i < data.length; ++i){

		values.push(parseFloat(data[i].metrics[0].toFixed(2)));
}

var rectangles = Treemap.generate(values, 100, 100);

for (var i in rectangles) {
	var shape = {
	        		type: 'rect',
					x0: rectangles[i][0],
					y0: rectangles[i][1],
					x1: rectangles[i][2],
					y1: rectangles[i][3],
					line: {
							width: 2
						},
					fillcolor: colors[counter % colors.length]
			};
	shapes.push(shape);
	var annotation = {
	    				x: (rectangles[i][0] + rectangles[i][2]) / 2,
						y: (rectangles[i][1] + rectangles[i][3]) / 2,
						text: String(values[counter]),
						showarrow: false
			};
	annotations.push(annotation);

	// For Hover Text
	x_trace.push((rectangles[i][0] + rectangles[i][2]) / 2);
	y_trace.push((rectangles[i][1] + rectangles[i][3]) / 2);
	text.push(String(values[counter]));

	// Incrementing Counter
	counter++;
}

// Generating Trace for Hover Text
var trace0 = {
			x: x_trace,
			y: y_trace,
			text: text,
			mode: 'text',
			type: 'scatter',
			hoverinfo: 'none'
    };


var myPlot = container,
  data = [trace0],
	layout = 	{
			height: 700,
			width: 700,
			title: metricTitles[0],
			shapes: shapes,
			hovermode: 'closest',
			annotations: annotations,
			xaxis: {
						showgrid: false,
						zeroline: false
			},
			yaxis: {
						showgrid: false,
						zeroline: false
			}
};



Plotly.newPlot(container, [trace0], layout);



myPlot.on('plotly_click', function(data)
{
    var pointNumber = data.points[0].pointNumber; //the number in the array
		CPVisualization.openWaterfallWindow(pointNumber); //waterfall is 1 based

});

myPlot.on('plotly_hover', function(data)
{
  var metricTitles = CPVisualization.getData(false).headers.metrics;
  var pointNumber = data.points[0].pointNumber; //the number in the array
	CPVisualization.showTooltip(pointNumber, metricTitles[0], mx, my);
});

myPlot.on('plotly_unhover', function(data)
{
  CPVisualization.closeTooltip();
});


});

</script>

<style>

   // add css code here

</style>
