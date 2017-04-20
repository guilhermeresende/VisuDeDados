var params = {
	page: 0,
	min: 0,
	max: 9,
	size: 10,
	// data:
	sortedCol: 0,
	sortReverse: false,
	search: ''
}

function createTable(mydata){

	if (params.dataset === undefined) {
		params.dataset = mydata;
	}

	var field = document.getElementById('search');
	field.onkeydown = function (event) {
		params.search = field.value;
		var filtered = filterData();
		createTable(filtered);
	};
	field.onkeypressed = function (event) {
		params.search = field.value;
		var filtered = filterData();
		createTable(filtered);
	};

	// Create table.
    var table = document.createElement('table');
    table.className += "table table-hover table-striped"; 

    // create rows
    for (var i = 1; i < mydata.length; i++) {

    	var row = table.insertRow(i - 1);
    	// create row cells
    	for (var j in mydata[i]) {
    		var cell = row.insertCell(j);
    		cell.innerHTML = mydata[i][j];
    		//cell.setAttribute()
    	}
    }

    var header = table.createTHead();
    var row = header.insertRow(0);
    for (j in mydata[0]) {
    	var th = document.createElement('th');
		th.innerHTML = mydata[0][j];
		// if (params.sortedCol == j && ) {

		// }
		th.onclick = function (event) {
			params.sortedCol = j;
			params.sortReverse = !params.sortReverse;
			var newdata=mydata.slice(1,mydata.length);
			console.log("data");
			console.log(mydata);
			console.log(newdata);
			sortData(newdata);
			createTable([mydata[0]].concat(newdata));
		};
		row.appendChild(th);
    }

    var container = document.getElementById('table-container');
    container.innerHTML = '';
    container.appendChild(table);
}

function sortData (mydata) {
	mydata.sort(function (a, b) {	
		if(a[params.sortedCol] < b[params.sortedCol]) {
		  return -1;
		}
		else{
			return 1;
		}
	});

}

function filterData () {
	if (params.search == '')
		return params.dataset;

	var filtered = [params.dataset[0]]; // header
	for (var i = 1; i < params.dataset.length; i++) {
		var found = false;
		for (var j = 0; j < params.dataset[i].length; j++) {
			if(params.dataset[i][j].search(params.search)>=0){
				filtered.push(params.dataset[i])
			}
		}
	}
	return(filtered);

}