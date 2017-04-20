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
          var c = lines[i].search("\"")          
          if (c >= 0){            
            var n = 0;
            var res = [];
            do{                                      //pra fazer com todas as aspas que houverem               
               res.push = lines[i].slice(n,c).split(",");          //adicionando parte splitada de n até a aspa
               n += c;                               //posicao da ultima aspa (C é dado em funcao da primeira pos do slice)
               c = lines[i].slice(n,lines[i].length).search("\"");   //caçando próxima aspa
               //ps.: Se tiver duas aspas seguidas acho que da ruim
            }while(c>=0);
            sample_data.push(res);
          }
          else{
            var res = lines[i].split(",");
            sample_data.push(res);
          }
        }
        callback(sample_data);
      }
    }
  }
  rawFile.send(null);
}