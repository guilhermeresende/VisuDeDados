function parse(filename, callback){
	var sample_data=[];
	var lines=[];
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", filename, true);
	rawFile.onreadystatechange = function (){
		if(rawFile.readyState === 4){
			if(rawFile.status === 200 || rawFile.status == 0){
				var allText = rawFile.responseText;
				//console.log(rawFile.responseText);
				lines = allText.split("\r");
				for(var i=0;i<lines.length;i++){
					var c = lines[i].search("\"")          
					if (c >= 0){
						var secondc = lines[i].slice(c+1,lines[i].length).search("\"") +c+1;
						var quotedtext = lines[i].slice(c,secondc);
						quotedtext=quotedtext.replace(",","\\\\\\;");
						lines[i]=lines[i].slice(0,c)+quotedtext+lines[i].slice(secondc,lines[i].length);
						var res = lines[i].split(",");
						for(var j=0;j<res.length;j++){
							res[j]=res[j].replace("\\\\\\;",",")
						}						
					}
					else{
						var res = lines[i].split(",");
					}
					sample_data.push(res);
				}
				//console.log(sample_data)
				callback(sample_data);
			}
		}
	}
	rawFile.send(null);
}