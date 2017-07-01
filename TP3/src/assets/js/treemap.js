
function genTreemap(tree,container,arr) {
	//console.log(arr);


	//var canvas=d3.select("body").append("svg")
	var canvas = d3.select("#tree-map").append("svg")
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
		.on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div.html("<b>"+d.name+"</b> <br> <b>Valor:</b>&#09;"+d.value+" <br> <b>Grupo:</b>&#09;"+d.group.toUpperCase())	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

	cells.append("text")
		.attr("x",function(d){return d.x+d.dx/2})
		.attr("y",function(d){return d.y+d.dy/2})
		.attr("text-anchor", "middle")
		.style("fill","white")
		.style("font-weight","bold")		
		.style('font-size',function(d){return textSize(d);})		
		.text(function(d) {return d.children ? null : d.name;})

	
}


function textSize(d){
	if(d.dy<12){
		return "0px"
	}
	if(d.dx<15){
		return "0px"
	}
	if(d.area<1000){
		return "0px"
	}
	return ((d.dx*0.7+d.dy*0.4)/(d.name.length*0.8)).toString()+"px";
}