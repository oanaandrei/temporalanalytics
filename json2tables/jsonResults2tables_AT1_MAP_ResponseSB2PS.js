// Oana Andrei 2016-2020

var fs = require('fs');

// \definecolor{fgreen}{rgb}{0.07, 0.53, 0.03}

if (process.argv.length<5) {
  console.log('Usage: node jsonResults2tables_AT1_MAP_ResponseSB2PS.js reducedPrismResults_GPAM_ResponseSB2PS_K2.json K [latex|csv]');
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
  
  var dict = [
	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	{ id: "1", label: "TermsAndConditions", shortLabel: "TC" },
	{ id: "2", label: "ATMainView", shortLabel: "Main" },
  	{ id: "3", label: "ATOverallUsageView", shortLabel: "OverallUsage" },
  	{ id: "4", label: "ATStackedBarsView", shortLabel: "StackedBars" },
  	{ id: "5", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" }, 
  	{ id: "6", label: "ATAppsInPeriodView", shortLabel: "AppsInPeriod" },
  	{ id: "7", label: "ATSettingsView", shortLabel: "Settings" },
  	{ id: "8", label: "UseStop", shortLabel: "UseStop" },
  	{ id: "9", label: "ATStatsView", shortLabel: "Stats" },
  	{ id: "10", label: "ATUsageBarChartATOverallUsageView", shortLabel: "UBCOverallUsage" },
  	{ id: "11", label: "ATFeedbackView", shortLabel: "Feedback" },
  	{ id: "12", label: "ATUsageBarChartATStatsView", shortLabel: "UBCStats" },
	{ id: "13", label: "ATInfoView", shortLabel: "Info" },
	{ id: "14", label: "ATUsageBarChartATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
	{ id: "15", label: "ATTaskView", shortLabel: "Task" }
  	];
 
  var nStates = dict.length;

  var timecuts = [
  	{ start: 0, end: 1, mindays: 1 },
  	{ start: 0, end: 7, mindays: 7 },
  	{ start: 0, end: 30, mindays: 30 },
  	{ start: 30, end: 60, mindays: 60 },
  	{ start: 60, end: 90, mindays: 90 },
  ];
  var nTimecuts = timecuts.length;

  // Create the header of the table for one property only

  // Property MAP_VP1
  var table_headerMAP_Response = "\\begin{table}[!h]\n\\center\n\\caption{Property MAP.ResponseSB2PS for K = " + K + "}\\label{table:MAP_ResponseSB2PS" + K + "}\n{\\footnotesize\n\\begin{tabular}{|c|";

  var table_header = "";
  
  var terms1 = [];
  for (var s=0; s<K; s++) {
	  terms1.push("r");
  }
    
  if (terms1.length>0) {
    table_header += terms1.join("|") + "|}\n\\hline\n{\\bf \\scriptsize Time} & ";
  }
  
  var terms3 = [];
  terms3.push("\\multicolumn{" + K + "}{@{}c@{}|}{\\bf \\scriptsize  K = " + K + "}");

  table_header += terms3 + "\\\\  \n";
  
  var terms4 = [];
  terms4.push("\\cline{" + 2 + "-" + (K+1) + "}");

  table_header += terms4.join(" ") + " {\\bf \\scriptsize cut}" + " & ";
  
  var terms2 = [];
  for (var k=0; k<K; k++) {
  	terms2.push("{\\scriptsize AP" + (k+1) + "}");
  }

  if (terms2.length>0) {
    table_header += terms2.join(" & ") + "\\\\ \n \\hline\\hline \n";
  }
   
  var strMAP_Response = table_headerMAP_Response + table_header;


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

  // Define array of results for property MAP_VP1
  var tableMAP_Response = new Array(nTimecuts);
  for (var i = 0; i < nTimecuts; i++) {
  	tableMAP_Response[i] = new Array(K);
  }
 
  // Fill in arrays with results for each property, each line corresponds to a time cut
  var index = 0;
  var indextimecut = -1;
  var patternId = 0;
  var pctlName;
  data.forEach(function(entry) {
  	if (entry.pctl.name.indexOf("MAP_Response_StackedBars_PeriodSelector") == 0) {
  		indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		//index = parseInt(indexStateDictionary(entry.result.j2));
  		patternId = parseInt(entry.result.i);
	  		//console.log("j2= " + entry.result.j2 + " in pattern " + patternId + " at current dictIndex " + index);
  		index = patternId - 1;
  			//tableMAP_VP1[indextimecut][index] = (Number(entry.result.value)).toFixed(2);
  		if (entry.result.value.indexOf("false") == 0){
  				tableMAP_Response[indextimecut][index] = "---";;
  		}
  		else if (entry.result.value.indexOf("true") == 0) {
  				tableMAP_Response[indextimecut][index] = parseFloat(entry.result.p).toFixed(2);
  		}
  		else {
  			console.log("The PRISM results is neither true or false");
  		}
  	}
  });
  //console.log(JSON.stringify(tableMAP_Response));

  var Kcolouring = new Array(K);

// Printing results into a latex table

// Property MAP_Response
  for (var l=0; l<nTimecuts; l++){
	strMAP_Response += "\n$[" + timecuts[l].start + "," + timecuts[l].end + "]$";
  	for (var k=0; k<K; k++) {
  		strMAP_Response += " & " + tableMAP_Response[l][k] + ""; 
  	}  		
  	strMAP_Response += "\\\\";
  }

  strMAP_Response += "\\hline\n \\end{tabular}\n}\n\\end{table}";	

/*  var csvMAP_Response = csv_header;
  for (var i=0; i<nStates; i++) {
  	csvMAP_Response += i + "," + dict[i] + "," + tableMAP_Response[i].join(",") + "\n";
  }  
 */ 


  if (fileType.indexOf("latex") == 0) {
  		console.log(strMAP_Response + "\n\n");
  }
  else if (fileType.indexOf("csv") == 0) {
  	console.log(csvMAP_Response); 
  }
  
   
  function indexTimecut(start,end) {
  	for (var l=0; l<nTimecuts; l++) {
  		if (timecuts[l].start === start && timecuts[l].end === end) return l;
  	}
  	console.log("\nTime cut undefined: " + start + " " + end);
  	return -1;
  }
     
});
