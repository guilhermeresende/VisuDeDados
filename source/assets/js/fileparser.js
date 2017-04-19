function parse(filename){
  var sample_data=[];
  var lines=[];
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", filename, true);
  rawFile.onreadystatechange = function (){
    if(rawFile.readyState === 4){
      if(rawFile.status === 200 || rawFile.status == 0){
        var allText = rawFile.responseText;
        lines = allText.split("\r");
        for(var i=0;i<lines.length;i++){
          var res = lines[i].split(",");
          sample_data.push(res);
        }
      }
    }
  }
  rawFile.send(null);
  return sample_data;
}