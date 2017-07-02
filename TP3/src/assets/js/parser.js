
function parseCSV (filename, callback) {
    d3.csv(filename, function(res) {
        callback(res);
    });
 }

// reads each needed file and checks if
// the other requests are over. if they are,
// call function to draw charts
function readDatasets (callback, parameter) {
    var numFilesToRead = 3;

    d3.csv('data/activities.csv', function (res) {
        // synthesizes information
        for (var i = 0; i < res.length; i++) {
            res[i]["ID"] = res[i]["ID"].toLowerCase();
            activities[res[i]["ID"]] = {
                name: res[i]["Nome"],
                color: res[i]["Cor"]
            }
        }

        numFilesToRead--;
        if(numFilesToRead == 0) {
            callback(parameter);
        }
    });

    d3.csv('data/occupations.csv', function (res) {
        // synthesizes information
        for (var i = 0; i < res.length; i++) {
            res[i]["ID"] = res[i]["ID"].toLowerCase();
            occupations[res[i]["ID"]] = {
                name: res[i]["Nome"],
                color: res[i]["Cor"]
            }
        }

        numFilesToRead--;
        if(numFilesToRead == 0) {
            callback(parameter);
        }
    });

    // Lê a base indexando pelo ano e, para cada ano,
    // indexa pelo cnae_3_id, somando wage_total,
    // job_total, e est_total dos itens com cnae_3_id
    // iguais.
    d3.csv('data/data.csv', function (res) {
        data = {}; // essa variável é a declarada no arquivo plotter.js. loucura total.
        
        for (var i = 0; i < res.length; i++) {
            if (res[i].cnae_3_color === undefined) { console.log(res[i]); }
            // coleção de dados tava bichada
            if (!res[i].cnae_3_color.startsWith('#')) {
                res[i].color = res[i].cbo_id;
            } else {
                res[i].color = res[i].cnae_3_color;
            }


            var year = res[i]["year"];
            var cnae_3 = res[i]["cnae_3_id"];
            res[i]["cnae_1_id"] = cnae_3[0];
            res[i].wage_total = !isNaN(parseFloat(res[i].wage_total)) ? parseFloat(res[i].wage_total) : 0;
            res[i].job_total = !isNaN(parseFloat(res[i].job_total)) ? parseFloat(res[i].job_total) : 0;
            res[i].est_total = !isNaN(parseFloat(res[i].est_total)) ? parseFloat(res[i].est_total) : 0;
            
            // inicializa a variável que conterá a resposta.
            // os objetos são indexados pelo ano
            if (data[year] === undefined) {
                data[year] = {};
            }
            // os itens de um ano são indexados pelo cnae_3_id
            if (data[year][cnae_3] === undefined) {
                data[year][cnae_3] = res[i];
            // acumula valores  
            } else {
                data[year][cnae_3].wage_total += res[i].wage_total;
                data[year][cnae_3].job_total += res[i].job_total;
                data[year][cnae_3].est_total += res[i].est_total;
            }
        }

        // console.log(data);

        numFilesToRead--;
        if(numFilesToRead == 0) {
            callback(parameter);
        }
    });
}
