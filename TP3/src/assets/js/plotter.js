var MAX_CHARTS = 5;

var svgContainer,
    tooltip_bg,
    tooltip,
    div;

// maps activity id (CNAE) to an object 
// containing name and HTML color code.
// for instance:
// activities["o84"] = {
//     name: "Atividade administrativa",
//     color: "#FFFFAA"
// }
// same for occupations object.
// objects are populated in parser.js:readDatasets()
var activities = {};
var occupations = {};
var data;

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
function drawLines(arr, data, wrapperId){
    var width = 420;

    var x = d3.scale.linear()
    .domain([0, d3.max(arr)])
    .range([0, width]);


    d3.select("#" + wrapperId)
    .selectAll("div")
    .data(arr)
    .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d, i) { return data[i]['name'] + " [" + d + "]"; });


    var chart = d3.select("#" + wrapperId);
    var bar = chart.selectAll("div");

    var barUpdate = bar.data(arr);
    var barEnter = barUpdate.enter().append("div");
    barEnter.style("width", function(d) { return d * 10 + "px"; });
    barEnter.text(function(d) { return d; });
}

function drawBarChart(data, ascending, wrapperId){

    var arr = new Array();// = [4, 8, 15, 16, 23, 42];

    if(ascending){
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

    drawLines(arr, data, wrapperId);
}

function drawTreeMap(arr){

//   var visualization = d3plus.viz()
//     .container("#viz")  // container DIV to hold the visualization
//     .data(arr)  // data to use with the visualization
//     .type("tree_map")   // visualization type
//     .id("name")         // key for which our data is unique on
//     .size("value")      // sizing of blocks
//     .draw() 

    var visualization = d3plus.viz()
        .container("#tree-map") // container DIV to hold the visualization
        .data(arr) // data to use with the visualization
        .type("tree_map") // visualization type
        .id(["group","name"]) // keys. 'group' coming first to make it cluster the squares with same cnae_1
        .depth(1)
        .size("value")
        .color("color")
        .draw()
}

// data: variable declared on the top of this file populated in parser.js:readDatabases()
// key: defines if looking for 'num_emp' or 'wage'
function drawPage(parsedFile, key){
    if (data === undefined) {
        data = parsedFile;
    }

    // if key wasnt defined, set it to num_emp,
    // which will be the first visualization seen
    // when loading the screen for the first time
    if (key === undefined) {
        key = 'num_emp';
    }
    
    var parsedData = {};

    // sums up all rows that have the same cnae_3 code
    for (var i = 0; i < data.length; i++) {
        var id = data[i]['cnae_3'];
        var group = data[i]['cnae_1'];
        if (activities[id] === undefined) {
            console.log(data[i]);
        }
        var name = activities[id].name;
        var color = activities[id].color;
        var value = parseInt(data[i][key]);
        if (isNaN(value)) value = 0;
        
        if (parsedData[id] === undefined) {
            parsedData[id] = {
                value: value,
                name: name,
                group: group,
                color: color
            }
        } else {
            parsedData[id].value += value;
        }
    }

    // creating array to feed d3plus
    var chartData = [];
    var cnaeKeys = Object.keys(parsedData);
    for (var i = 0; i < cnaeKeys.length; i++) {
        chartData.push({
            "value": parsedData[cnaeKeys[i]].value,
            "name": parsedData[cnaeKeys[i]].name,
            "group": parsedData[cnaeKeys[i]].group,
            "color": parsedData[cnaeKeys[i]].color
        });
    }

    // by value first, then by name
    chartData.sort(function (a, b){
        if (a.value < b.value) {
            return -1;
        }
        else if (a.value == b.value) {
            if (a.name < b.name) return -1;
            else return 1;
        }
        else return 1;
    });

    drawTreeMap(chartData);
    
    // greatest values
    drawBarChart(chartData, false, "greatest-chart");

    // smallest values
    drawBarChart(chartData, true, "smallest-chart");


}