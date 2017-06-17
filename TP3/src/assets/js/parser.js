
function parseCSV (filename, callback) {
	d3.csv(filename, function(data) {
		callback(data);
	});
 }