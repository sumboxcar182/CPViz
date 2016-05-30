<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<script type='text/javascript'>

function sPlot (testname, dataPoint) {
  this.testName = testname;
  this.xArr = [];
  this.yArr = [];
  this.zArr = [];
}

sPlot.numCreated = 0;


sPlot.prototype.addData = function(x, y, z) {
  this.xArr.push(x != null ? x : 0);
  this.yArr.push(y != null ? y : 0);
  this.zArr.push(z != null ? z : 0);
};

sPlot.prototype.createPlotlyRepresentation = function()
{
    ++sPlot.numCreated;
    return {
      x: this.xArr,
      y: this.yArr,
      z: this.zArr,
      mode: 'markers',
      marker: {
        color: spinColorWheel(sPlot.numCreated),
        size: 10,
        symbol: 'circle',
        line: {
          color: 'rgb(204, 204, 204)',
          width: 1
        },
        opacity: 0.9
      },
      type: 'scatter3d',
      name: this.testName
     };
}

function spinColorWheel(val)
{
    switch(val)
    {
      case 1:
        return 'rgb (176, 23, 31)';
      case 2:
        return 'rgb (30, 144, 255)';
      case 3:
        return 'rgb (0, 201, 87)';
      case 4:
        return 'rgb (205, 205, 0)';
      case 5:
        return 'rgb (255, 185, 15)';
      case 6:
        return 'rgb (255, 160, 122)';
      case 7:
        return 'rgb (238, 64, 0)';
      case 8:
        return 'rgb (113, 113, 198)';
      case 9:
        return 'rgb (125, 158, 192)';
      case 10:
        return 'rgb (197, 193, 170)';
      case 11:
        return 'rgb (0, 255, 0)';
      case 12:
        return 'rgb (143, 188, 143)';
      case 13:
        return 'rgb (64, 224, 208)';
      default:
        return 'rgb (127, 127, 127)';
    }
}

var mx, my;

onmousemove = function(e)
{
   mx = e.pageX;
   my = e.pageY;
}

document.addEventListener('DOMContentLoaded', function(event) {
 var summary = CPVisualization.getSummaryData();
 var metricTitles = CPVisualization.getSummaryData(false).headers.metrics;
 var data = summary.data;
 var headers = summary.headers;
 var container = document.querySelector(CPVisualization.getContainerSelector());

 if(data.length != 0 && data[0].metrics.length < 3)
 {
   d3.select(container).text("Please select 3 metrics.");
   return;
 }

 var xArr = []; // Metric 1
 var yArr = []; // Metric 2
 var zArr = []; // Metric 3
 var traces = []; //Holds each individual test

 for( var i = 0; i < data.length; ++i){
   if( !(data[i].breakdown1 in traces))
   {
     traces[data[i].breakdown1] = new sPlot(data[i].breakdown1, i);
   }
   traces[data[i].breakdown1].addData(data[i].metrics[0], data[i].metrics[1], data[i].metrics[2]);
 }

 /*var trace = {
 x: xArr,
 y: yArr,
 z: zArr,
 mode: 'markers',
 marker: {
   color: 'rgb(127, 127, 127)',
   size: 12,
   symbol: 'circle',
   line: {
     color: 'rgb(204, 204, 204)',
     width: 1
   },
   opacity: 0.9
 },
 type: 'scatter3d'
};*/

 var plotData = [];//, trace2];

 for(var trace in traces)
 {
   if(traces.hasOwnProperty(trace))
   {
     plotData.push(traces[trace].createPlotlyRepresentation());
   }
 }



var myPlot = container,
  //d3 = Plotly.d3,
  data = plotData,
  layout = {
   hovermode: false,
   title: '3D Scatterplot Title Test',
   scene: {
   xaxis: {
     title: metricTitles[0],
     titlefont: {
       family: 'Courier New, monospace',
       size: 16,
       color: '#7f7f7f'
     }
   },
   yaxis: {
     title: metricTitles[1],
     titlefont: {
       family: 'Courier New, monospace',
       size: 16,
       color: '#7f7f7f'
     }
   },
   zaxis: {
     title: metricTitles[2],
     titlefont: {
       family: 'Courier New, monospace',
       size: 16,
       color: '#7f7f7f'
     }
   }},
   margin: {
     l: 0,
     r: 0,
     b: 0,
     t: 50
   }
 };


Plotly.newPlot(container, plotData, layout);

myPlot.on('plotly_click', function(data)
{
    var summary = CPVisualization.getSummaryData();
    var summaryData = summary.data;
    var dataPoint = data.points[0].data; //splits into x, y, z array.
    var pointNumber = data.points[0].pointNumber; //the number in the array
    var xVal, yVal, zVal;
    var ex = dataPoint.x[pointNumber];
    var ey = dataPoint.y[pointNumber];
    var ez = dataPoint.z[pointNumber];

    for( var i = 0; i < summaryData.length; ++i)    {
      xVal = summaryData[i].metrics[0] != null ? summaryData[i].metrics[0] : 0 ;

      if(xVal != ex)
      {
        continue;
      }
      yVal = summaryData[i].metrics[1] != null ? summaryData[i].metrics[1] : 0 ;
      if(yVal != ey)
      {
        continue;
      }
      zVal = summaryData[i].metrics[2] != null ? summaryData[i].metrics[2] : 0 ;
      if(zVal == ez)
      {
        CPVisualization.openWaterfallWindow(i); //waterfall is 1 based
        break;
      }
    }
});


myPlot.on('plotly_hover', function(data)
{
  var summary = CPVisualization.getSummaryData();
  var metricTitles = CPVisualization.getData(false).headers.metrics;
  var summaryData = summary.data;
  var dataPoint = data.points[0].data; //splits into x, y, z array.
  var pointNumber = data.points[0].pointNumber; //the number in the array
  var xVal, yVal, zVal;
  var ex = dataPoint.x[pointNumber];
  var ey = dataPoint.y[pointNumber];
  var ez = dataPoint.z[pointNumber];

  for( var i = 0; i < summaryData.length; ++i)    {
    xVal = summaryData[i].metrics[0] != null ? summaryData[i].metrics[0] : 0 ;

    if(xVal != ex)
    {
      continue;
    }
    yVal = summaryData[i].metrics[1] != null ? summaryData[i].metrics[1] : 0 ;
    if(yVal != ey)
    {
      continue;
    }
    zVal = summaryData[i].metrics[2] != null ? summaryData[i].metrics[2] : 0 ;
    if(zVal == ez)
    {
      CPVisualization.showTooltip(i, metricTitles[0], mx, my); //waterfall is 1 based
      break;
    }
  }
});


myPlot.on('plotly_unhover', function(data)
{
  CPVisualization.closeTooltip();
});

});
</script>
