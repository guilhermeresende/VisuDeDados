

function parsecsv(filename, func){

	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", filename, true);
	rawFile.onreadystatechange = function (){
		if(rawFile.readyState === 4){
			if(rawFile.status === 200 || rawFile.status == 0){
				var allText = rawFile.responseText;
				var resultdata= d3.csvParse(allText);	
				//console.log(resultdata);
				func(resultdata);		
			}
		}
	}
	rawFile.send(null);
  	//return resultdata;
 }

function parsejson(filename){	

	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", filename, true);
	rawFile.onreadystatechange = function (){
		if(rawFile.readyState === 4){
			if(rawFile.status === 200 || rawFile.status == 0){
				var allText = rawFile.responseText;
				var resultcountries=JSON.parse(allText);
				console.log(resultcountries);
			}
		}
	}
	rawFile.send(null);
  //return resultcountries;
}
