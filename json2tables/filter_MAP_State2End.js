// Oana Andrei 2016-2020

var fs = require('fs');

if (process.argv.length<6) {
  console.log('Usage: node filterFile.js resultsFile K min_j max_j');
  return;
}

fs.readFile(process.argv[2], function(err, data) {
  if (err) {
    console.log('error', err);
    return;
  }

  var data = JSON.parse(data);
  data.reverse();

  var K = process.argv[3]; // read argument for K
  var crt_i = K;
  
  var min_j = process.argv[4];
  var max_j = process.argv[5];
  var crt_j = max_j;
  
  data = data.filter(function(a) {
  	if (a.result.value.indexOf("false") == 0 && parseFloat(a.result.p) == 0) {
	  	if (crt_j == min_j) {
	  		crt_j = max_j;
	  	}
	  	else {
	  		crt_j--;
	  	}
	  	//console.log(JSON.stringify(a) + "\n");
	  	//console.log("False zero: " + parseInt(a.result.i) + " " + parseInt(a.result.j) + "\n");
	  	return true; 
	}
	if (parseInt(a.result.j) == crt_j && a.result.value.indexOf("true") == 0) {
	  	if (crt_j == min_j) {
	  		crt_j = max_j;
	  	}
	  	else {
	  		crt_j--;
	  	}
		//console.log(JSON.stringify(a) + "\n");
		//console.log("True: " + parseInt(a.result.i) + " " + parseInt(a.result.j) + "\n");
		return true;
	}
  });  
  
  data.reverse();
  
  console.log(JSON.stringify(data));
});

