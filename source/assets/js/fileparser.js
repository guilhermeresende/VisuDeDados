function parse(filename, callback){
  console.log("ooooooo disgreta");
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
          var res = lines[i].split(",");
          sample_data.push(res);
        }
        callback(sample_data);
      }
    }
  }
  rawFile.send(null);
}