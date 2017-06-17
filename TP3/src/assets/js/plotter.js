var MAX_CHARTS = 5;

var svgContainer,
    tooltip_bg,
    tooltip,
    div;

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