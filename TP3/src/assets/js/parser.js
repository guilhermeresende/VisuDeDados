
function parseCSV (filename, funcEntrada, resultcountries) {

	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", filename, true);
	rawFile.onreadystatechange = function (){
		if(rawFile.readyState === 4){
			if(rawFile.status === 200 || rawFile.status == 0){
				var allText = rawFile.responseText;
				//var resultdata= {};//d3.csvParse(allText);	
				//var resultdata= d3.csv(filename);	
				d3.csv(filename, function(data) {
				
				  funcEntrada(data);
				});
						
			}
		}
	}
	rawFile.send(null);
 }

function parseEverything (filenamejson, filenamecsv, createflower) {
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", filenamejson, true);
	rawFile.onload = function (){
		if(rawFile.readyState === 4){
			if(rawFile.status === 200 || rawFile.status == 0){
				var allText = rawFile.responseText;
				var resultcountries = JSON.parse(allText);
				parseCSV(filenamecsv,createflower,resultcountries);
			}
		}
	}
	rawFile.send(null);
}