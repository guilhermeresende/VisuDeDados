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

function initializeTableData (dataset) {
    params.header = dataset[0]; // primeira linha
    params.dataset = dataset.slice(1);
    params.filtered = dataset.slice(1);
}

function renderTable (dataset) {

    // se ainda nao tiver inicializado a tabela e o arqgumento nao for indefinido
    if (params.dataset === undefined && dataset !== undefined) {
        initializeTableData(dataset);
    }

    // inicializacao eventos da busca
	var field = document.getElementById('search');
	field.onkeypress = function (event) {
        if (params.search !== field.value) {
            params.search = field.value.toLowerCase();
            filterData();
            renderTable();
        }
    };
    // keydown nao funcionava direito quando ia deletar...
    field.onkeyup = function (event) {
        if (params.search !== field.value) {
            params.search = field.value.toLowerCase();
            filterData();
            renderTable();
        }
    };

	// Create table
    var table = document.createElement('table');
    table.className += "table table-hover"; 

    // create rows
    for (var i = 0; i < params.filtered.length; i++) {

    	var row = table.insertRow(i);
    	// create row cells
    	for (var j in params.filtered[i]) {
    		var cell = row.insertCell(j);
    		cell.innerHTML = params.filtered[i][j];
    		//cell.setAttribute()
    	}
    }

    // create header
    var header = table.createTHead();
    var row = header.insertRow(0);
    for (j in params.header) {
    	var th = document.createElement('th');
		th.innerHTML = params.header[j];
		// if (params.sortedCol == j && ) {

		// }

		th.onclick = callbackClickOrderBy(j);
		row.appendChild(th);
    }

    var container = document.getElementById('table-container');
    container.innerHTML = '';
    container.appendChild(table);
}

function callbackClickOrderBy (j) {
    return function (event) {
        params.sortedCol = j;
        params.sortReverse = !params.sortReverse;
        sortData();
        renderTable();
    };
}

function sortData () {
	params.filtered.sort(function (a, b) {
		if(a[params.sortedCol] < b[params.sortedCol]) {
            if (!params.sortReverse) return -1;
            else return 1;
		}
		else {
			if (!params.sortReverse) return 1;
            else return -1;
		}
	});
}

function filterData () {
	if (params.search === undefined || params.search == '') {
        params.filtered = params.dataset;
        return;
    }

	var filtered = [];
	for (var i = 0; i < params.dataset.length; i++) {
		for (var j = 0; j < params.dataset[i].length; j++) {
			if (params.dataset[i][j].toLowerCase().search(params.search) >= 0){
				filtered.push(params.dataset[i]);
                break;
			}
		}
	}
    params.filtered = filtered;
}