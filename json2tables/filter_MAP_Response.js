// Oana Andrei 2016-2020

// keep only those entries for which the prop is true for the lowest probability bound p

var fs = require('fs');

if (process.argv.length<4) {
  console.log('Usage: node filterFile.js resultsFile K ');
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
  
  //console.log(data.length);
  
  data = data.filter(function(a) {
  	if (a.result.value.indexOf("false") == 0 && parseFloat(a.result.p) == 0) {
	  	crt_i--; 
	  	if (crt_i == 0) {
	  		crt_i = K;
	  	}
	  	//console.log(crt_i);
	  	//console.log(JSON.stringify(a) + "\n");
	  	return true; 
	}
	if (parseInt(a.result.i) == crt_i && a.result.value.indexOf("true") == 0) {
	  	if (crt_i == 1) {
	  		crt_i = K;
	  	}
	  	else {
	  		crt_i--; 
	  	}
		//console.log(crt_i);
		//console.log(JSON.stringify(a) + "\n");
		return true;
	}
  });  
  
  data.reverse();
  
  console.log(JSON.stringify(data));
});

