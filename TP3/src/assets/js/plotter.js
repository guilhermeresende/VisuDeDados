var MAX_CHARTS = 5;

var svgContainer,
    tooltip_bg,
    tooltip;

var dataKeys = [ 'civic engagement', 'community', 
    'education', 'environment', 'health', 'housing', 
    'income', 'jobs', 'life satisfaction', 
    'safety', 'work-life balance' ];

var dataColors = [ '#4c9479', '#4c94bb', '#0004a0',
    '#a84550', '#7ab536', '#13ad33', '#debe1a',
    '#774998', '#df390f', '#39372a', '#5f0202' ];

var div;
function average (data, keys){
    var sum = 0.0;
    for (var i in keys) {
        sum += parseFloat(data[keys[i]]);
    }
    return sum / keys.length;
}

function initChart (id) {
    setupSVG(id);
    div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0)
    .style("z-index",1890);
}

function setupSVG (id) {
    svgContainer = d3.select('#'+id).append("svg")
        .attr("opacity", 0.8)
        .attr("width", 1700)
        .attr("height", 500);
}

function drawChart (datajson, data){
    var flowerCenterX = 40; //deslocamento horizontal da flor
    var flowerCenterY = 400; //altura da flor

    var value = 35;
    var petlSize = 3;
    var distance = 40;
    var initindex=0;
    
    for (i = 0; i < data.length; i++) {
        height = average(data[i], dataKeys);
        for (j=initindex; j<datajson.length;j++){
            if (datajson[j]['code']==data[i]['country']){
                name=datajson[j]['pt'];
                initindex=j+1;
            }
        }
        createFlower(name, data[i], value, petlSize, flowerCenterX+(i*distance), flowerCenterY, flowerCenterX+(i*distance), flowerCenterY*(1-height));
    }
}

function tooltipText(data){
	var text="";
	for (var i=0;i<dataKeys.length;i++){
		text=text+"<b>"+dataKeys[i]+":</b>&#09;"+parseFloat(data[dataKeys[i]]).toFixed(2)+" <br> ";
	}
	return text;

}

function createFlower (name, data, v, sz, x0, y0, x0Fl, y0Fl) {
    createPeduncle(x0, y0, x0Fl, y0Fl, sz);
    var greatestBottomPetal = createPetals(data, v, x0Fl, y0Fl, sz);
    createCircle(x0Fl, y0Fl, sz, name);
    var datatext=tooltipText(data);
    createInvisibleCircle(x0Fl, y0Fl, sz, datatext);
    createFlowerLabel(x0Fl, y0Fl, 4*sz, name, greatestBottomPetal);
}

function createPetals (data, v, x, y, sz) {
    // rotation
    var deltaTheta = 360.0 / dataKeys.length;
    var theta = 2;
    var key, color, petalLength;
    var greatestBottomPetal = 0;
    
    // for each petal
    for (var i = 0; i < dataKeys.length; i++) {
        key = dataKeys[i];
        color = dataColors[i];
        petalLength = v*data[key];
        createPetal(x, y, petalLength, theta, color, sz);
        
        // if petal is on the bottom and is greater than the greatest seen so far
        if (theta > 70 && theta < 120 && petalLength > greatestBottomPetal) {
            greatestBottomPetal = petalLength;
        }
        theta += deltaTheta;
    }

    return greatestBottomPetal;
}

function setupTooltip () {
    tooltip = svgContainer.append("text")
        .attr("x",50).attr("y",50)
        .attr("id", "tooltip")
        .attr("visibility", "hidden")
        .attr("font-family","sans-serif")
        .attr("font-size",12)
        .attr("class","tooltipao");
}

function createPeduncle (x0, y0, x0Fl, y0Fl, sz) {
    var line1 = svgContainer.append("line")
        .attr("x1", x0)
        .attr("y1", y0)
        .attr("x2", x0Fl)
        .attr("y2", y0Fl)
        .attr("stroke-width", sz/2)
        .attr("stroke", "#14320d");
}

function createPetal(x0, y0, v, rotation, color, sz){
    var line1 = svgContainer.append("line")
        .attr("x1", x0)
        .attr("y1", y0)
        .attr("x2", x0+v)
        .attr("y2", y0)
        .attr("stroke-width", sz)
        .attr("stroke", color)
        .attr("transform", "rotate( "+rotation+" "+x0+" "+y0+")")
        .attr("class","petal");
}

function createCircle (x, y, size, name) {
    var circle = svgContainer.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("class", "flower_")
        .attr("stroke-width", size/2)
        .attr("fill", "#b4a702")
        .attr("stroke", "#e3ef02")
        .attr("r", size);
}

function createInvisibleCircle (x, y, size, text) {
    var circle = svgContainer.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("class", "flower_")
        .attr("opacity",0)
        .attr("r", size*6.5)
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(text)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

}

function createFlowerLabel (x, y, size, name, greatestBottomPetal) {
    var svgText = svgContainer.append("text")
        .attr("x",x - 10 - greatestBottomPetal)
        .attr("y",y-6)
        .text(name)
        .attr("class", "flower_")       
        .attr("transform", "rotate( 270 "+x+" "+y+")")
        .attr("font-size",size.toString()+"px")
        .style("text-anchor","end");
        // .attr("font-family", "consolas");
}

function fieldSorter(fields) {
    return function (a, b) {
        return fields
            .map(function (o) {
                var dir = 1;
                if (o[0] === '-') {
                   dir = -1;
                   o=o.substring(1);
                }
                if (a[o] > b[o]) return dir;
                if (a[o] < b[o]) return -(dir);
                return 0;
            })
            .reduce(function firstNonZeroValue (p,n) {
                return p ? p : n;
            }, 0);
    };
}
function drawLines(arr, data){
    var width = 420;

    var x = d3.scale.linear()
    .domain([0, d3.max(arr)])
    .range([0, width]);


    d3.select(".chart")
    .selectAll("div")
    .data(arr)
    .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d, i) { return data[i]['name'] + " [" + d + "]"; });


    var chart = d3.select(".chart");
    var bar = chart.selectAll("div");

    var barUpdate = bar.data(arr);
    var barEnter = barUpdate.enter().append("div");
    barEnter.style("width", function(d) { return d * 10 + "px"; });
    barEnter.text(function(d) { return d; });
}

function drawChart(data, type){

    var arr = new Array();// = [4, 8, 15, 16, 23, 42];

    if(type == "+"){
        for (i = 0; i < MAX_CHARTS; i++) 
            arr.push( parseInt(data[i]['value']) );
    }
    else{
        aval = MAX_CHARTS;
        for (i = data.length-1; i > 0; i--){
            if(!isNaN(data[i]['value'])){
                aval--;
                //console.log(data[i]['value']);
                arr.push( parseInt(data[data.length-i-1]['value']) );
            }
            if(aval == 0)
                i = 0;
        }
        arr.sort();

    }

    console.log(arr);    

    drawLines(arr, data);
}

function drawTreeMap(arr){

  var visualization = d3plus.viz()
    .container("#viz")  // container DIV to hold the visualization
    .data(arr)  // data to use with the visualization
    .type("tree_map")   // visualization type
    .id("name")         // key for which our data is unique on
    .size("value")      // sizing of blocks
    .draw() 
}

function drawPage(data){
    console.log(data);
    var arr = new Array();

    for (i = 0; i < data.length; i++) {
        contains = false;

        //var value = parseInt(data[i]['num_emp']);
        var value = parseInt(data[i]['num_emp']);
        if(isNaN(value))
            value = 0;
        var name = data[i]['cnae_3'];

        for(j = 0; j < arr.length; j++){
            if(arr[j]['name'] == name){
                arr[j]['value'] += value;
                    contains = true;
                }
            }

            if(!contains)
                arr.push({"value": value, "name": name});
            
    }

    arr.sort(fieldSorter(['-value', '-name']));

    drawTreeMap(arr);
    drawChart(arr, "+");

}