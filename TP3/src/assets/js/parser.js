
function parseCSV (filename, callback) {
	d3.csv(filename, function(data) {
		callback(data);
	});
 }

// reads each needed file and checks if
// the other requests are over. if they are,
// call function to draw charts
function readDatasets (callback) {
	var numFilesToRead = 3;
	var data2result;

	d3.csv('data/activities.csv', function (data) {
		// synthesizes information
		for (var i = 0; i < data.length; i++) {
			data[i]["ID"] = data[i]["ID"].toLowerCase();
			activities[data[i]["ID"]] = {
				name: data[i]["Nome"],
				color: data[i]["Cor"]
			}
		}

		numFilesToRead--;
		if(numFilesToRead == 0) {
			callback(data2result);
		}
	});

	d3.csv('data/occupations.csv', function (data) {
		// synthesizes information
		for (var i = 0; i < data.length; i++) {
			data[i]["ID"] = data[i]["ID"].toLowerCase();
			occupations[data[i]["ID"]] = {
				name: data[i]["Nome"],
				color: data[i]["Cor"]
			}
		}

		numFilesToRead--;
		if(numFilesToRead == 0) {
			callback(data2result);
		}
	});


	// belohorizonte's mesoregion code: 310007
	d3.csv('data/data2.csv', function (res) {
		data2result = res;

		numFilesToRead--;
		if(numFilesToRead == 0) {
			callback(data2result);
		}
	});
}