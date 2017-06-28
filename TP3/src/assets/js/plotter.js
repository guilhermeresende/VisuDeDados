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
function drawLines(arr, data, wrapperId, names){
    var width = 420;

    document.getElementById(wrapperId).innerHTML = "";

    var x = d3.scale.linear()
    .domain([0, d3.max(arr)])
    .range([0, width]);


    d3.select("#" + wrapperId)
    .selectAll("div")
    .data(arr)
    .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d, i) { return names[i] + " [" + d + "]"; });


    var chart = d3.select("#" + wrapperId);
    var bar = chart.selectAll("div");

    var barUpdate = bar.data(arr);
    var barEnter = barUpdate.enter().append("div");
    barEnter.style("width", function(d) { return d * 10 + "px"; });
    barEnter.text(function(d) { return d; });
}

function drawBarChart(data, descending, wrapperId){
    var arr = new Array();// = [4, 8, 15, 16, 23, 42];
    var names = new Array();

    if(descending){
        aval = MAX_CHARTS;
        for (i = data.length-1; i > 0; i--){
            arr.push( parseInt(data[i]['value']) );
            names.push( data[i]['name']);
            aval--;
            if(aval == 0)
                    i = 0;
        }
        //arr.reverse();
    }
    else{
        aval = MAX_CHARTS;
        for (i = 0; i < data.length; i++){
            if(!isNaN(data[i]['value'])){
                aval--;
                //console.log(data[i]['value']);
                arr.push( Math.abs(parseInt(data[i]['value'])) );
                names.push( data[i]['name']);
            }
            if(aval == 0)
                i = data.length;
        }
    }

    //console.log(arr);    

    drawLines(arr, data, wrapperId, names);
}

function drawGrowthChart (data, descending, wrapperId) {
    var newData = [];
    for (var i = 0; i < data.length; i++) {
        newData.push({
            value: data[i].growth,
            name: data[i].name
        });
    }
    drawBarChart(newData, descending, wrapperId);
}


function drawTreeMap(arr){

    document.getElementById("tree-map").innerHTML = "";

//   var visualization = d3plus.viz()
    var tree = {
        name: "tree",
        children: [
            { name: "Word-wrapping comes for free in HTML", size: 16000 },
            { name: "animate makes things fun", size: 8000 },
            { name: "data data everywhere...", size: 5220 },
            { name: "display something beautiful", size: 3623 },
            { name: "flex your muscles", size: 984 },
            { name: "physics is religion", size: 6410 },
            { name: "query and you get the answer", size: 2124 }
        ]
    };

    genTreemap(tree,"tree-map",arr)

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
        var name = activities[id].name;
        var color = activities[id].color;
        var growth = parseFloat(data[i][key+'_growth_5']);
        var value = parseFloat(data[i][key]);
        if (isNaN(value)) value = 0;
        if (isNaN(growth)) growth = 0;
        growth *= 100;
        
        if (parsedData[id] === undefined) {
            parsedData[id] = {
                value: value,
                name: name,
                group: group,
                color: color,
                growth: growth
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
            "color": parsedData[cnaeKeys[i]].color,
            "growth": parsedData[cnaeKeys[i]].growth
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

    // greatest values
    drawBarChart(chartData, true, "greatest-chart");
    // smallest values
    drawBarChart(chartData, false, "smallest-chart");
    drawTreeMap(chartData);

    // ordena por growth
    filteredChartData = chartData.filter(function(item){return true});
    filteredChartData.sort(function (a, b){
        if (a.growth < b.growth) {
            return -1;
        }
        else if (a.growth == b.growth) {
            if (a.name < b.name) return -1;
            else return 1;
        }
        else return 1;
    });

    // growth
    drawGrowthChart(filteredChartData, true, "growth-chart");
    // decrease
    drawGrowthChart(filteredChartData, false, "decrease-chart");

}