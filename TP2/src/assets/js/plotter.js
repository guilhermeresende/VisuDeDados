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

function average (data, keys){
    var sum = 0.0;
    for (var i in keys) {
        sum += parseFloat(data[keys[i]]);
    }
    return sum / keys.length;
}

function initChart (id) {
    setupSVG(id); setupTooltips();
}

function setupSVG (id) {
    svgContainer = d3.select('#'+id).append("svg")
        .attr("opacity", 0.8)
        .attr("width", 1620)
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

function createFlower (name, data, v, sz, x0, y0, x0Fl, y0Fl) {
    createPeduncle(x0, y0, x0Fl, y0Fl, sz);
    var greatestBottomPetal = createPetals(data, v, x0Fl, y0Fl, sz);
    createCircle(x0Fl, y0Fl, sz, name);
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
        .text("TOOOOLS")
        .attr("font-family","sans-serif")
        .attr("font-size",12);
}

function setupTooltipBG () {
    tooltip_bg = svgContainer.append("rect")
        .attr("x",50).attr("y", 50)
        .attr("rx", 5).attr("ry", 5)
        .attr("id", "tooltip_bg")
        .attr("width", 50).attr("height", 16)
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .attr("visibility", "hidden");
}

function setupTooltips () {
    setupTooltipBG(); setupTooltip();
}

function showTooltip (evt, name, data) {
    tooltip.attr("x",evt.clientX-8);
    tooltip.attr("y",evt.clientY-5);
    tooltip.attr("visibility","visible");

    tooltip_bg.attr("x",evt.clientX-8);
    tooltip_bg.attr("y",evt.clientY-5);
    tooltip_bg.attr("visibility","visible");
}

function hideTooltip () {
    tooltip.attr("visibility","hidden");
    tooltip_bg.attr("visibility","hidden");
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
        .attr("r", size)
        .attr("onmousemove", "showTooltip(evt, '"+name+"')")
        .attr("onmouseout", "hideTooltip(evt)" );
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
