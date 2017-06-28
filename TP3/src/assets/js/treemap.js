//https://www.youtube.com/watch?v=svT9RdyQlrw


function genTreemap(tree,container,arr) {
	console.log(arr);

	var canvas=d3.select("body").append("svg")
		.attr("width",900)
		.attr("height",400);

	var tree={"name":"parent","color":"a","group":"aaaaa","value":0,"growth":0,"children":[]};
	var indexnum=-1;
	for(var i=0;i<arr.length;i++){

		found=0;
		indexnum=tree["children"].length-1;
		for (var j=0;j<tree["children"].length;j++){
			if (tree["children"][j]["group"]==arr[i]["group"]){
					indexnum=j;
					found=1;
					break;
			}
		}
		if (!found){
			tree["children"].push({"name":arr[i]["group"],"color":"a","group":arr[i]["group"],"value":0,"growth":0,"children":[]});
			indexnum=tree["children"].length-1;
		}
	
		tree["children"][indexnum]["children"].push(arr[i]);

	}
	
	//console.log(tree)


	var treemap = d3.layout.treemap()
	    .size([900,400])
	    .sticky(true)
	    .nodes(tree);


	console.log(treemap)
	 
	var cells=canvas.selectAll(".cell")
		.data(treemap)
		.enter()
		.append("g")
		.attr("class","cell")

	cells.append("rect")
		.attr("x", function (d){return d.x;})
		.attr("y", function(d) {return d.y;})
		.attr("width", function(d){return d.dx;})
		.attr("height", function(d) {return d.dy;})
		.attr("fill", function(d){return d.children ? null : d.color;})
		.attr("stroke","#fff")

	cells.append("text")
		.attr("x",function(d){return d.x+d.dx/2})
		.attr("y",function(d){return d.y+d.dy/2})
		.attr("text-anchor", "middle")
		.text(function(d) {return d.children ? null : d.name;})

	
}/*


<!DOCTYPE html>
<style>

form {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

svg {
  font: 10px sans-serif;
}

</style>
<svg width="960" height="570"></svg>
<form>
  <label><input type="radio" name="mode" value="sumBySize" checked> Size</label>
  <label><input type="radio" name="mode" value="sumByCount"> Count</label>
</form>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script>

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); },
    color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
    format = d3.format(",d");

var treemap = d3.treemap()
    .tile(d3.treemapResquarify)
    .size([width, height])
    .round(true)
    .paddingInner(1);

d3.json("flare.json", function(error, data) {
  if (error) throw error;

  var root = d3.hierarchy(data)
      .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
      .sum(sumBySize)
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

  treemap(root);

  var cell = svg.selectAll("g")
    .data(root.leaves())
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

  cell.append("rect")
      .attr("id", function(d) { return d.data.id; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", function(d) { return color(d.parent.data.id); });

  cell.append("clipPath")
      .attr("id", function(d) { return "clip-" + d.data.id; })
    .append("use")
      .attr("xlink:href", function(d) { return "#" + d.data.id; });

  cell.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
    .selectAll("tspan")
      .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
    .enter().append("tspan")
      .attr("x", 4)
      .attr("y", function(d, i) { return 13 + i * 10; })
      .text(function(d) { return d; });

  cell.append("title")
      .text(function(d) { return d.data.id + "\n" + format(d.value); });

  d3.selectAll("input")
      .data([sumBySize, sumByCount], function(d) { return d ? d.name : this.value; })
      .on("change", changed);

  var timeout = d3.timeout(function() {
    d3.select("input[value=\"sumByCount\"]")
        .property("checked", true)
        .dispatch("change");
  }, 2000);

  function changed(sum) {
    timeout.stop();

    treemap(root.sum(sum));

    cell.transition()
        .duration(750)
        .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; })
      .select("rect")
        .attr("width", function(d) { return d.x1 - d.x0; })
        .attr("height", function(d) { return d.y1 - d.y0; });
  }
});

function sumByCount(d) {
  return d.children ? 0 : 1;
}

function sumBySize(d) {
  return d.size;
}

</script>
*/