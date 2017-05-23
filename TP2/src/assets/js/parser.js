
function parsecsv(filename, createflower,resultcountries){

	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", filename, true);
	rawFile.onreadystatechange = function (){
		if(rawFile.readyState === 4){
			if(rawFile.status === 200 || rawFile.status == 0){
				var allText = rawFile.responseText;
				var resultdata= d3.csvParse(allText);	
				console.log(resultcountries);
				createflower(resultcountries,resultdata);		
			}
		}
	}
	rawFile.send(null);
  	//return resultdata;
 }

function parseeverything(filenamejson,filenamecsv,createflower){	
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", filenamejson, true);
	rawFile.onload = function (){
		if(rawFile.readyState === 4){
			if(rawFile.status === 200 || rawFile.status == 0){
				var allText = rawFile.responseText;
				var resultcountries=JSON.parse(allText);
				parsecsv(filenamecsv,createflower,resultcountries);
			}
		}
	}
	rawFile.send(null);
}


function readjson(text){
	
	return resultcountries;
}