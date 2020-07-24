// Oana Andrei 2019-2020
// Status: done
// we keep only the result with the highest value of j for which the property is true



var fs = require('fs');

if (process.argv.length<6) {
  console.log('Usage: node filterFile.js resultsFile K min_j max_j');
  // where min_j refers to the minimum state index in the dictionary and max_j to the maximum
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
  var crt_i = K; // current pattern
  var crt_i1 = K;

  var min_j = process.argv[4];
  var max_j = process.argv[5];
  var crt_j = max_j; // current state id; because we reversed the data, we start with the highest id of the state

  data = data.filter(function(a) {

  	if (a.result.value.indexOf("false") == 0 && parseFloat(a.result.p) == 0) {
	  	//crt_i = parseInt(a.result.i);
	  	crt_j = parseInt(a.result.j);
	  	crt_i1 = parseInt(a.result.i1);

	  	if (crt_i1 > 1) {
	  		crt_i1--;
	  	}
	  	else if (crt_i1 == 1) {
	  		crt_i1 = K;
	  		if (crt_j == min_j) {
	  			crt_j = max_j;
		  	}
		  	else if (crt_j > min_j) {
	  			crt_j--;
	  		}
	  	}
	  	//console.log("False zero: " + parseInt(a.result.i) + " " + parseInt(a.result.j) + " " + parseInt(a.result.i1) + "\n");
	  	//console.log(JSON.stringify(a) + "\n");
	  	return true;
	}
	if (parseInt(a.result.j) == crt_j && parseInt(a.result.i1) == crt_i1 && a.result.value.indexOf("true") == 0) {
	  	if (crt_i1 > 1) {
	  		crt_i1--;
	  	}
	  	else if (crt_i1 == 1) {
	  		crt_i1 = K;
	  		if (crt_j == min_j) {
	  			crt_j = max_j;
		  	}
		  	else if (crt_j > min_j) {
	  			crt_j--;
	  		}
	  	}
		//console.log("True: " + parseInt(a.result.i) + " " + parseInt(a.result.j) + " " + parseInt(a.result.i1) + "\n");
		//console.log(JSON.stringify(a) + "\n");
		return true;
	}
  });

  data.reverse();

  console.log(JSON.stringify(data));
});
