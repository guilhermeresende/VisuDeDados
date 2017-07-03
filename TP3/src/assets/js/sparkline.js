// data is an array with the sequential y coordinates,
// if that maks any sense.
// container is the div in which we will draw the sparkline
function drawSparkline (container, data) {

    // X scale will fit values from 0-10 within pixels 0-100
    var x = d3.scale.linear().domain([0, 10]).range([0, 50]);
    // Y scale will fit values from 0-10 within pixels 0-100
    var y = d3.scale.linear().domain([0, 10]).range([0, 30]);    

    var line = d3.svg.line()
        .x(function(d,i) { 
            console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
            return x(i); 
        })
        .y(function(d) { 
            console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
            return y(d); 
        });
    
    d3.select(container).append("svg:path").attr("d", line(data));
}