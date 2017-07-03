
// assume que a variável data no arquivo plotter está preenchida
function genTreeData (key, year) {
    var dataByGroups = {}; // groups by cnae_1
    var cnae_3_keys = Object.keys(data[year]); // all cnae_3 from that year
    
    // groups data from same cnae_1 from that year
    for (var k = 0; k < cnae_3_keys.length; k++) {
        var cnae_3 = cnae_3_keys[k];
        var group = cnae_3[0];
        if (dataByGroups[group] === undefined) {
            dataByGroups[group] = [];
        }
        dataByGroups[group].push(data[year][cnae_3]);
    }
    
    // generate data in the tree form needed by d3
    var tree = {
        name: "Root",
        value: 100,
        children: []
    };

    // groups are the cnae_1.
    // for iterates over groups to append their cnae_3 as children
    var groups = Object.keys(dataByGroups);
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var groupNode = {
            name: group,
            value: 80,
            children: []
        }
        for (var j = 0; j < dataByGroups[group].length; j++) {
            groupNode.children.push({
                id: dataByGroups[group][j].cnae_3_id,
                name: dataByGroups[group][j].cnae_3_name,
                value: parseFloat(dataByGroups[group][j][key])/dataByGroups[group][j]['est_total'],
                color: dataByGroups[group][j].color,
                group: groups[i]
            });
        }
        tree.children.push(groupNode);
    }
    return tree;
}

function genTreemap(key, year, container) {
    
    // console.log(data); console.log(key, year);
    document.getElementById(container).innerHTML = "";
    var canvas = d3.select("#"+container).append("svg")
        
        .attr("width", "900px")
        .attr("height","520px");

    var tree = genTreeData(key, year);  
    var treemap = d3.layout.treemap()
        .size([900,520])
        .sticky(true)
        .nodes(tree);

    var cells = canvas.selectAll(".cell")
        .data(treemap)
        .enter()
        .append("g")
        .attr("class","cell")

    cells.append("rect")
        .attr("x", function (d){return d.x;})
        .attr("y", function(d) {return d.y;})
        .attr("width", function(d){return d.dx;})
        .attr("height", function(d) {return d.dy;})
        .attr("fill", function(d){return d.children ? undefined : d.color;})
        .attr("stroke","#fff")
        .on("mouseover", function(d) {      
            div.transition()        
                .duration(200)      
                .style("opacity", .9);      
            div.html("<b>"+d.name+"</b> <br> <b>Valor:</b>&#09;"+d.value+" <br> <b>Grupo:</b>&#09;"+d.group.toUpperCase())
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            drawDetailsLineChart(d.id, d.name);
        })                  
        .on("mouseout", function(d) {       
            hideDetailsLineChart();
            div.transition()        
                .duration(500)      
                .style("opacity", 0);
        });

	cells.append("text")
		.attr("x",function(d){return d.x+d.dx/2})
		.attr("y",function(d){return d.y+d.dy/1.85})
		.attr("text-anchor", "middle")
		.style("fill","white")
		.style("font-weight","bold")
		.style("font-family","calibri")	
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
	return ((d.dx*0.9+d.dy*0.2)/(d.name.length*0.65)).toString()+"px";
}