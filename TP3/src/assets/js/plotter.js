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
var data = {};

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


    var svgCont = d3.select("#" + wrapperId)
        .selectAll("div")
	.data(arr)
	.enter().append("div")
    	.style("height", "15px")
	.style("margin-top", "20px")
    	.style("width", function(d) { return x(d) + "px"; });
    //.text(function(d, i) { return names[i] + " [" + d + "]"; });


    svgCont.append("text").append("div")
        .style("color", "black")
    	.style("background-color", "transparent")
    	.style("width", "150px")
    	.style("position", "relative")
    	.style("top", "-22px")
    	.style("width", "500px")        
    	.style("height", "15px")
        .text(function(d, i) { return names[i] + " [" + d + "]"; });
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

/*
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
*/

// returns a Js Object indexed by cnae_3_id.
// the values are the info requested in a list.
function genSparklineInput (key) {
    var cnaes = {};
    
    var years = Object.keys(data);
    years.sort();
    
    for (var y = 0; y < years.length; y++) {
        var cnae_ids = Object.keys(data[years[y]]);
        for (var c = 0; c < cnae_ids.length; c++) {
            var id = cnae_ids[c];
            var row = data[years[y]][id];
            var value = parseFloat(row[key])/row["est_total"]; // average
            if (cnaes[id] === undefined) {
                cnaes[id] = [value];
            } else {
                cnaes[id].push(value);
            }
        }
    }

    return cnaes;
}

// as we aggregate the row values, the fields *_growth_5 can't be used anymore.
// therefore, this function needs to extract this info from the variable 'data'.
// sometimes the previous year's info is not available. so we jsut ignore it.
function genSortedBarsInput (key, year) {
    var bars = [];
    var cnae_keys = Object.keys(data[year]);
    var past_year = year-1;
    for (var i = 0; i < cnae_keys.length; i++) {
        // if thre is no info on the previous year, continue
        if (data[past_year] === undefined || data[past_year][cnae_keys[i]] === undefined) {
            continue;
        }

        var previous = data[past_year][cnae_keys[i]];
        var row = data[year][cnae_keys[i]];
        bars.push({
            name: row.cnae_3_name,
            value: parseFloat(row[key])/row["est_total"],
            color: row.color,
            // current mean minus previous mean
            growth: parseFloat(row[key])/row["est_total"] - parseFloat(previous[key])/previous["est_total"]
        });
    }
    
    bars.sort(function (a, b) {
        if (a.value < b.value) {
            return -1;
        }
        else if (a.value == b.value) {
            if (a.name < b.name) return -1;
            else return 1;
        }
        else return 1;
    });

    return bars;
}

// key: defines if looking for 'job_total' or 'wage_total'
function drawPage(key, year){

    // if key wasnt defined, set it to job_total,
    // which will be the first visualization seen
    // when loading the screen for the first time
    if (key === undefined) {
        key = 'job_total';
    }

    // information's year
    if (year === undefined) {
        year = 2014;
    }
    
    // draws tree map about the info and year requested
    genTreemap(key, year, "tree-map"); 
    
    // indexed by cnae_3. for each cnae_3, it has an array with values from each year,
    // so we can plot a line chart with the growth pattern
    var sparklineInput = genSparklineInput(key);
    
    // as we aggregate the row values, the fields *_growth_5 can't be used anymore.
    // therefore, this function needs to extract this info from the variable 'data'.
    // sometimes the previous year's info is not available. so we jsut ignore it.
    var barsInput = genSortedBarsInput(key, year);

    // greatest values
    drawBarChart(barsInput, true, "greatest-chart");
    // smallest values
    drawBarChart(barsInput, false, "smallest-chart");
    
    // ordena por growth
    growthInput = barsInput.filter(function (item) {return true;});
    growthInput.sort(function (a, b) {
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
    drawGrowthChart(growthInput, true, "growth-chart");
    // decrease
    drawGrowthChart(growthInput, false, "decrease-chart");

}
