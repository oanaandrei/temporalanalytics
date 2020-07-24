// Oana Andrei 2016-2020

var fs = require('fs');

// \definecolor{fgreen}{rgb}{0.07, 0.53, 0.03}

if (process.argv.length<4) {
  console.log('Usage: node jsonResults2tables_AT1_MAP_LongRunPattern.js results_GPAM_K2.json K [latex|csv]');
  return;
}

fs.readFile(process.argv[2], function(err, data) {
  if (err) {
    console.log('error', err);
    return;
  }

  var data = JSON.parse(data);

  var K = parseInt(process.argv[3]);
  var fileType = process.argv[4];

  var MAX_STEPS_REWARD = 2000.00;

  var timecuts = [
  	{ start: 0, end: 1, mindays: 1 },
  	{ start: 0, end: 7, mindays: 7 },
  	{ start: 0, end: 30, mindays: 30 },
  	{ start: 30, end: 60, mindays: 60 },
  	{ start: 60, end: 90, mindays: 90 },
  ];
  var nTimecuts = timecuts.length;

  var table_headerMAP_LongRunPattern = "\\begin{table}\n\\center\n\\caption{MAP property SteadyState for GPAM(" + K + ") of AppTracker1}\\label{table:AT1_MAP_SteadyState_K" + K + "}\n{\\footnotesize\n\\begin{tabular}{|c|";

  var table_header = "";
  var table_header_extra = "";

  var terms1 = [];
  var terms1_extra = [];
  for (var s=0; s<nStates; s++) {
	  terms1.push("|r");
	  for (var k=1; k<K; k++) {
  		terms1.push("r");
  	  }
  }

  if (terms1.length>0) {
    table_header += terms1.join("|") + "|}\n\\hline\n{\\bf \\scriptsize Time} & ";
  }

  for (var s=0; s<nStates-1; s++) {
	  terms1_extra.push("|r");
	  for (var k=1; k<K; k++) {
  		terms1_extra.push("r");
  	  }
  }
  if (terms1_extra.length>0) {
    table_header_extra += terms1_extra.join("|") + "|}\n\\hline\n{\\bf \\scriptsize Target state}  & ";
  }

  var terms3 = [];
  var terms3_extra = [];
  for (var l=0; l<nStates-1; l++) {
  	terms3.push("\\multicolumn{" + K + "}{@{}c@{}||}{\\bf \\scriptsize \\" + dict[l].shortLabel + "}");
  }
  terms3.push("\\multicolumn{" + K + "}{@{}c@{}|}{\\bf \\scriptsize \\" + dict[nStates-1].shortLabel + "}");
  if (terms3.length>0) {
    table_header += terms3.join(" & ") + "\\\\  \n";
  }

  if (nStates > 2) {
	  for (var l=0; l<nStates-2; l++) {
  		terms3_extra.push("\\multicolumn{" + K + "}{@{}c@{}||}{\\bf \\scriptsize \\" + dict[l].shortLabel + "}");
  	  }
  	  terms3_extra.push("\\multicolumn{" + K + "}{@{}c@{}|}{\\bf \\scriptsize \\" + dict[nStates-2].shortLabel + "}");
  }
  else {
  	 terms3_extra.push("\\multicolumn{" + K + "}{@{}c@{}|}{\\bf \\scriptsize \\" + dict[0].shortLabel + "}");
  }
  if (terms3_extra.length>0) {
    table_header_extra += terms3_extra.join(" & ") + "\\\\  \n";
  }

  var terms4 = [];
  var terms4_extra = [];
  var endCline = 0;
  for (l=2; l<=nStates*K; ) {
  	endCline = l + (K - 1);
  	terms4.push("\\cline{" + l + "-" + endCline + "}");
  	l = endCline + 1;
  }
  for (l=2; l<=(nStates-1)*K; ) {
  	endCline = l + (K - 1);
  	terms4_extra.push("\\cline{" + l + "-" + endCline + "}");
  	l = endCline + 1;
  }

  if (terms4.length>0) {
    table_header += terms4.join(" ") + " {\\bf \\scriptsize interval} & ";
  }
  if (terms4_extra.length>0) {
    //table_header_extra += terms4.join(" ") + " {\\bf interval} & ";
    table_header_extra += terms4_extra.join(" ") + " & ";
  }

  var terms2 = [];
  for (var l=0; l<nStates; l++) {
  	for (var k=0; k<K; k++) {
  		terms2.push("{\\bf \\scriptsize AP" + (k+1) + "}");
  	}
  }
  var terms2_extra = [];
  for (var l=0; l<nStates-1; l++) {
  	for (var k=0; k<K; k++) {
  		terms2_extra.push("{\\bf \\scriptsize AP" + (k+1) + "}");
  	}
  }

  if (terms2.length>0) {
    table_header += terms2.join(" & ") + "\\\\ \n \\hline\\hline \n";
  }
  if (terms2_extra.length>0) {
    table_header_extra += terms2_extra.join(" & ") + "\\\\ \n \\hline\\hline \n";
  }


  var strMAP_LongRunPattern = table_headerMAP_LongRunPattern + table_header;


/*  // To DO: output in .csv format
  var csv_header = "Id,Label,";
  var terms2 = [];
  for (var k=0; k<K; k++) {
  	terms2.push("AP " + (k+1));
  }
  if (terms2.length>0) {
    csv_header += terms2.join(",") + "\n";
  }
*/

  // output in .csv format
  var csv_header_init = "Id,TimeIntvl,";
  var terms_csv_init = [];
  for(var i=0; i<nStates; i++) {
	  for (var k=0; k<K; k++) {
  		terms_csv_init.push(dict[i].shortLabel + "/AP" + (k+1));
  	}
  }
  if (terms_csv_init.length>0) {
    csv_header_init += terms_csv_init.join(",") + "\n";
  }

  var csv_header_btw = "Id,TargetState,";
  var terms_csv_btw = [];
  for(var i=0; i<nStates; i++) {
  	for (var k=0; k<K; k++) {
  		terms_csv_btw.push(dict[i].shortLabel + "/AP" + (k+1));
  	}
  }
  if (terms_csv_btw.length>0) {
    csv_header_btw += terms_csv_btw.join(",") + "\n";
  }


  var tableMAP_LongRunPattern = new Array(nTimecuts);
  for (var i = 0; i < nTimecuts; i++) {
  	tableMAP_LongRunPattern[i] = new Array(K*nStates);
  }

  var index = 0;
  var indextimecut = -1;
  var patternId = 0;
  var patternIdSource = 0;
  var patternIdTarget = 0;
  var pctlName;
  data.forEach(function(entry) {
  	if (entry.pctl.name.indexOf("LongRunPattern_SteadyState") == 0) {
  		  indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		  index = 0;
  		  patternId = parseInt(entry.result.i);
		    index = index * K + patternId - 1;
		    if (entry.result.value == null){
			       tableMAP_LongRunPattern[indextimecut][index] = "---";;
		    }
		    else if (entry.result.value === "ErrorFilterInit") {
			       tableMAP_LongRunPattern[indextimecut][index] = "---";
		    }
		    else if (entry.result.value === "ErrorNotConverge") {
			       tableMAP_LongRunPattern[indextimecut][index] = "---";
		    }
		    else {
 			      tableMAP_LongRunPattern[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
		    }
  	}
  });

  var Kcolouring = new Array(K);

// Printing results into a latex table

// Property MAP_LongRunPattern
  for (var l=0; l<nTimecuts; l++){
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
	strMAP_LongRunPattern += "[" + timecuts[l].start + "," + timecuts[l].end + "]";

  	// colouring
  	for(var s=0; s<nStates*K-K+1; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				if (tableMAP_LongRunPattern[l][x] === "---" && tableMAP_LongRunPattern[l][y] === "---" ) {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableMAP_LongRunPattern[l][x] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y]++;
  				} else if (tableMAP_LongRunPattern[l][y] === "---") {
  					Kcolouring[x]++;
  					Kcolouring[y] = -1;

  				} else {
  					if (parseFloat(tableMAP_LongRunPattern[l][y]) > parseFloat(tableMAP_LongRunPattern[l][x])) {
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableMAP_LongRunPattern[l][y]) < parseFloat(tableMAP_LongRunPattern[l][x])) {
	  					Kcolouring[x]++;
  					} else {
  						Kcolouring[y]++; Kcolouring[x]++;
  					}
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strMAP_LongRunPattern += " & " + orderingColourHighBest(Kcolouring[x],K) + tableMAP_LongRunPattern[l][x] + "}";
  		}
  	}
  	strMAP_LongRunPattern += "\\\\ \\hline \n";
  }
  strMAP_LongRunPattern += "\\end{tabular}\n}\n\\end{table}";

  console.log(strMAP_LongRunPattern + "\n\n");

  function indexTimecut(start,end) {
  	for (var l=0; l<nTimecuts; l++) {
  		if (timecuts[l].start === start && timecuts[l].end === end) return l;
  	}
  	console.log("\nTime cut undefined: " + start + " " + end);
  	return -1;
  }

  function orderingColourHighBest(n,K) {
  	switch(K){
  		case 2: return colourK2(n);
  		case 3: return colourK3(n);
  		case 4: return colourK4(n);
  		case 5: return colourK5(n);
  	}
  }


  function colourK2(n) {
  	switch(n) {
  		case 1: return "\\textcolor{blue}{";
  		case 0: return "\\textcolor{purple}{";
  		case -1: return "\\textcolor{grey}{";
  	}
  }

  function colourK3(n) {
  	switch(n) {
  		case 2: return "\\textcolor{blue}{";
  		case 1: return "\\textcolor{purple}{";
  		case 0: return "\\textcolor{orange}{";
  		case -1: return "\\textcolor{grey}{";
  	}
  }

  function colourK4(n) {
  	switch(n) {
  		case 3: return "\\textcolor{blue}{";
  		case 2: return "\\textcolor{purple}{";
  		case 1: return "\\textcolor{orange}{";
  		case 0: return "\\textcolor{fgreen}{";
  		case -1: return "\\textcolor{grey}{";
  	}
  }

  function colourK5(n) {
  	switch(n) {
  		case 4: return "\\textcolor{blue}{";
  		case 3: return "\\textcolor{purple}{";
  		case 2: return "\\textcolor{orange}{";
  	    case 1: return "\\textcolor{fgreen}{";
  		case 0: return "\\textcolor{black}{";
  		case -1: return "\\textcolor{grey}{";
  	}
  }


});
