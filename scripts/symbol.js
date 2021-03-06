var year = 2008;
data.yearIdx = function(year) { return 2008-year; }

var w = 600,
    h = 300,
    rScale = 1 / 170;
 
var scale = pv.Geo.scale()
    .domain({lng: -128, lat: 24}, {lng: -64, lat: 50})
    .range({x: 0, y: 0}, {x: w, y: h});
 
 
var colors = ["#008038", "#F7976B", "#ED1C23"];
 
us_lowres.forEach(function(c) {
  c.code = c.code.toUpperCase();
  c.centLatLon = centroid(c.borders[0]);
});
 
 
// Add the main panel for the visualization
var vis = new pv.Panel()
    .width(w)
    .height(h)
    .top(30);
 
// Add a panel for each state
var state = vis.add(pv.Panel)
    .data(us_lowres);
 
// Add a panel for each state land mass
state.add(pv.Panel)
    .data(function(c)  { return c.borders; })
	.add(pv.Line)
    .data(function(l)  { return l; })
    .left(scale.x)
    .top(scale.y)
    .fillStyle("#eee")
    .lineWidth(1)
    .strokeStyle("#ccc")
    .antialias(false);
 
// Add the pie chart
var pie = vis.add(pv.Panel)
    .data(us_lowres)
    .left(function(c) { return scale(c.centLatLon).x; })
    .top(function(c) { return scale(c.centLatLon).y; })
	.add(pv.Wedge)
    .data(function(c)  { return [
        (100 - data[c.code].over[data.yearIdx(year)]
         - data[c.code].obese[data.yearIdx(year)]),
        data[c.code].over[data.yearIdx(year)],
        data[c.code].obese[data.yearIdx(year)]
      ]; })
    .left(0)
    .top(0)
    .outerRadius(function(d, c)  { return Math.sqrt(data[c.code].pop[data.yearIdx(year)])*rScale; })
    .angle(function(d)  { return d /100 * 2 * Math.PI; })
    .fillStyle(function()  { return colors[this.index]; })
    .title(function(d, c)  { return c.name; });
 
// Add the legend
vis.add(pv.Dot)
   .data(["Obese", "Overweight", "Normal"])
   .left(10)
   .bottom(function()  { return this.index * 12 + 10; })
   .strokeStyle(null)
   .fillStyle(function()  { return colors[2 - this.index]; })
 .anchor("right").add(pv.Label);
 
vis.render();
 