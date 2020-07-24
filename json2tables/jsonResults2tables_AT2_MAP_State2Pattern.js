// Oana: 18 March 2019 
// Status: done

var fs = require('fs');

// \definecolor{fgreen}{rgb}{0.07, 0.53, 0.03}

if (process.argv.length<6) {
  console.log('Usage: node jsonResults2tables_AT1_MAP_State2Pattern.js results_GPAM_K2.json K [latex|csv] [4statesL1|4statesL2|8statesL1|full] )');
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
  var dictType = process.argv[5];
  
  var MAX_STEPS_REWARD = 2000.00;
  
	// UseStop only dictionary
  var dict_UseStop = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	//{ id: "1", label: "ATMainView", shortLabel: ""Main"" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TaC" },
  	//{ id: "3", label: "ATSettingsView", shortLabel: "Settings" },  	
  	//{ id: "4", label: "ATInfoView", shortLabel: "InfoView"},
  	//{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OverallUsageAllTime" }, 
  	//{ id: "6", label: "ATInDepthMenu", shortLabel:  "InDepthMenu"},
  	{ id: "7", label: "UseStop", shortLabel: "UseStop" },
  	//{ id: "8", label: "ATAppsInPeriodView_Today", shortLabel: "AppsInPeriodToday" },
  	//{ id: "9", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" },
  	//{ id: "10", label: "ATStatsView", shortLabel: "Stats" },
  	//{ id: "11", label: "ATAppsInPeriodView_ExploreByPeriod", shortLabel: "AppsInPeriodbyPeriod" },
  	//{ id: "12", label: "ATUsageBarChart_ATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
	//{ id: "13", label: "ATOverallUsageView_ByApp", shortLabel: "OverallUsagebyApp" },
	//{ id: "14", label: "ATUsageBarChart_ATStatsView", shortLabel: "UBCStats" },
	//{ id: "15", label: "ATUsageBarChart_ATOverallUsageView", shortLabel: "UBCOverallUsage" },
	//{ id: "16", label: "ATFeedbackView", shortLabel: "Feedback" },
	//{ id: "17", label: "ATTaskView", shortLabel: "Task" }
  	];

  var level1Dict = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	//{ id: "1", label: "ATMainView", shortLabel: "Main" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TaC" },
  	//{ id: "3", label: "ATSettingsView", shortLabel: "Settings" },  	
  	//{ id: "4", label: "ATInfoView", shortLabel: "InfoView"},
  	{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OverallUsageAllTime" }, 
  	{ id: "6", label: "ATInDepthMenu", shortLabel: "InDepthMenu"},
  	{ id: "7", label: "UseStop", shortLabel: "UseStop" },
  	//{ id: "8", label: "ATAppsInPeriodView_Today", shortLabel: "AppsInPeriodToday" },
  	//{ id: "9", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" },
  	//{ id: "10", label: "ATStatsView", shortLabel: "Stats" },
  	//{ id: "11", label: "ATAppsInPeriodView_ExploreByPeriod", shortLabel: "AppsInPeriodbyPeriod" },
  	//{ id: "12", label: "ATUsageBarChart_ATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
	//{ id: "13", label: "ATOverallUsageView_ByApp", shortLabel: "OverallUsagebyApp" },
	//{ id: "14", label: "ATUsageBarChart_ATStatsView", shortLabel: "UBCStats" },
	//{ id: "15", label: "ATUsageBarChart_ATOverallUsageView", shortLabel: "UBCOverallUsage" },
	//{ id: "16", label: "ATFeedbackView", shortLabel: "Feedback" },
	//{ id: "17", label: "ATTaskView", shortLabel: "Task" }
  	];

  var level2Dict = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	//{ id: "1", label: "ATMainView", shortLabel: "Main" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TaC" },
  	//{ id: "3", label: "ATSettingsView", shortLabel: "Settings" },  	
  	//{ id: "4", label: "ATInfoView", shortLabel: "InfoView"},
  	//{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OverallUsageAllTime" }, 
  	//{ id: "6", label: "ATInDepthMenu", shortLabel: "InDepthMenu"},
  	//{ id: "7", label: "UseStop", shortLabel: "UseStop" },
  	{ id: "8", label: "ATAppsInPeriodView_Today", shortLabel: "AppsInPeriodToday" },
  	{ id: "9", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" },
  	{ id: "10", label: "ATStatsView", shortLabel: "Stats" },
  	//{ id: "11", label: "ATAppsInPeriodView_ExploreByPeriod", shortLabel: "AppsInPeriodbyPeriod" },
  	//{ id: "12", label: "ATUsageBarChart_ATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
	{ id: "13", label: "ATOverallUsageView_ByApp", shortLabel: "OverallUsagebyApp" },
	//{ id: "14", label: "ATUsageBarChart_ATStatsView", shortLabel: "UBCStats" },
	//{ id: "15", label: "ATUsageBarChart_ATOverallUsageView", shortLabel: "UBCOverallUsage" },
	//{ id: "16", label: "ATFeedbackView", shortLabel: "Feedback" },
	//{ id: "17", label: "ATTaskView", shortLabel: "Task" }
  	];

  var level3Dict = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	//{ id: "1", label: "ATMainView", shortLabel: "Main" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TaC" },
  	//{ id: "3", label: "ATSettingsView", shortLabel: "Settings" },  	
  	//{ id: "4", label: "ATInfoView", shortLabel: "InfoView"},
  	//{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OverallUsageAllTime" }, 
  	//{ id: "6", label: "ATInDepthMenu", shortLabel: "InDepthMenu"},
  	//{ id: "7", label: "UseStop", shortLabel: "UseStop" },
  	//{ id: "8", label: "ATAppsInPeriodView_Today", shortLabel: "AppsInPeriodToday" },
  	//{ id: "9", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" },
  	//{ id: "10", label: "ATStatsView", shortLabel: "Stats" },
  	{ id: "11", label: "ATAppsInPeriodView_ExploreByPeriod", shortLabel: "AppsInPeriodbyPeriod" },
  	{ id: "12", label: "ATUsageBarChart_ATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
	//{ id: "13", label: "ATOverallUsageView_ByApp", shortLabel: "OverallUsagebyApp" },
	{ id: "14", label: "ATUsageBarChart_ATStatsView", shortLabel: "UBCStats" },
	{ id: "15", label: "ATUsageBarChart_ATOverallUsageView", shortLabel: "UBCOverallUsage" },
	//{ id: "16", label: "ATFeedbackView", shortLabel: "Feedback" },
	//{ id: "17", label: "ATTaskView", shortLabel: "Task" }
  	];

  var dict_threelevels = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	{ id: "1", label: "ATMainView", shortLabel: "Main" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TaC" },
  	{ id: "3", label: "ATSettingsView", shortLabel: "Settings" },  	
  	//{ id: "4", label: "ATInfoView", shortLabel: "InfoView"},
  	{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OverallUsageAllTime" }, 
  	{ id: "6", label: "ATInDepthMenu", shortLabel: "InDepthMenu"},
  	{ id: "7", label: "UseStop", shortLabel: "UseStop" },
  	{ id: "8", label: "ATAppsInPeriodView_Today", shortLabel: "AppsInPeriodToday" },
  	{ id: "9", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" },
  	{ id: "10", label: "ATStatsView", shortLabel: "Stats" },
  	{ id: "11", label: "ATAppsInPeriodView_ExploreByPeriod", shortLabel: "AppsInPeriodbyPeriod" },
  	{ id: "12", label: "ATUsageBarChart_ATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
	{ id: "13", label: "ATOverallUsageView_ByApp", shortLabel: "OverallUsagebyApp" },
	{ id: "14", label: "ATUsageBarChart_ATStatsView", shortLabel: "UBCStats" },
	{ id: "15", label: "ATUsageBarChart_ATOverallUsageView", shortLabel: "UBCOverallUsage" },
	//{ id: "16", label: "ATFeedbackView", shortLabel: "Feedback" },
	//{ id: "17", label: "ATTaskView", shortLabel: "Task" }
  	];
  	
  var dict;
  if (dictType.indexOf("level1Dict") == 0) {
  	dict = level1Dict;
  }
  else if (dictType.indexOf("UseStop") == 0) {
  	dict = dict_UseStop
  }
  else if (dictType.indexOf("level2Dict") == 0) {
  	dict = level2Dict;
  }
  else if (dictType.indexOf("level3Dict") == 0) {
  	dict = level3Dict;
  }  
  else if (dictType.indexOf("threelevels") == 0) {
  	dict = dict_threelevels;
  }  
  else {
  	console.log("Incorrect choice of dictionary option!");
  	return;
  }
 
  var fullDict = [
	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	{ id: "1", label: "ATMainView", shortLabel: "Main" },
	{ id: "2", label: "TermsAndConditions", shortLabel: "TaC" },
  	{ id: "3", label: "ATSettingsView", shortLabel: "Settings" },  	
  	{ id: "4", label: "ATInfoView", shortLabel: "InfoView"},
  	{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OverallUsageAllTime" }, 
  	{ id: "6", label: "ATInDepthMenu", shortLabel: "InDepthMenu"},
  	{ id: "7", label: "UseStop", shortLabel: "UseStop" },
  	{ id: "8", label: "ATAppsInPeriodView_Today", shortLabel: "AppsInPeriodToday" },
  	{ id: "9", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" },
  	{ id: "10", label: "ATStatsView", shortLabel: "Stats" },
  	{ id: "11", label: "ATAppsInPeriodView_ExploreByPeriod", shortLabel: "AppsInPeriodbyPeriod" },
  	{ id: "12", label: "ATUsageBarChart_ATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
	{ id: "13", label: "ATOverallUsageView_ByApp", shortLabel: "OverallUsagebyApp" },
	{ id: "14", label: "ATUsageBarChart_ATStatsView", shortLabel: "UBCStats" },
	{ id: "15", label: "ATUsageBarChart_ATOverallUsageView", shortLabel: "UBCOverallUsage" },
	{ id: "16", label: "ATFeedbackView", shortLabel: "Feedback" },
	{ id: "17", label: "ATTaskView", shortLabel: "Task" }
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
  var table_headerMAP_State2Pattern = "\\begin{table}[!h]\n\\center\n\\caption{Property MAP.State2Pattern for K = " + K + "}\\label{table:MAP_State2Pattern_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{c";
  
  var table_header = "";
  
  var terms1 = [];
  for (var s=0; s<nStates; s++) {
	  terms1.push("r");
	  for (var k=1; k<K; k++) {
  		terms1.push("r");
  	  }
  }
    
  if (terms1.length>0) {
    table_header += terms1.join(" ") + "}\n\\hline\n{\\bf \\scriptsize Time} & ";
  }
  
  var terms3 = [];
  for (var l=0; l<nStates-1; l++) {
  	terms3.push("\\multicolumn{" + K + "}{@{}c@{}||}{\\bf \\scriptsize \\" + dict[l].shortLabel + "}");
  }
  terms3.push("\\multicolumn{" + K + "}{@{}c@{}|}{\\bf \\scriptsize \\" + dict[nStates-1].shortLabel + "}");
  if (terms3.length>0) {
    table_header += terms3.join(" & ") + "\\\\  \n";
  }

  var terms4 = [];
  var endCline = 0;
  for (l=2; l<=nStates*K; ) {
  	endCline = l + (K - 1);
  	terms4.push("\\cline{" + l + "-" + endCline + "}");
  	l = endCline + 1;
  }
  if (terms4.length>0) {
    table_header += terms4.join(" ") + " {\\bf interval} & ";
  }
  
  var terms2 = [];
  for (var l=0; l<nStates; l++) {
  	for (var k=0; k<K; k++) {
  		terms2.push("{\\bf \\scriptsize AP" + (k+1) + "}");
  	}
  }
  
  if (terms2.length>0) {
    table_header += terms2.join(" & ") + "\\\\ \n \\hline\\hline \n";
  }
  
  var strMAP_State2Pattern = table_headerMAP_State2Pattern + table_header;



  // Transposed 
  var table_headerMAP_State2Pattern_transposed = "\\begin{table}[!h]\n\\center\n\\caption{Property MAP.State2Pattern for GPAM(" + K + ")}\\label{table:MAP_State2Pattern_K" + K + "_" + dictType + "_transposed}\n{\\footnotesize\n\\begin{tabular}{|rr|";
  
  var table_header_transposed = "";
  
  var terms1_transposed = [];
  for (var i=0; i<nTimecuts; i++) {
  	for (var j=0; j<K; j++) {	
		terms1_transposed.push("r");
	}
	terms1_transposed.push("|");
  }
    
  if (terms1_transposed.length>0) {
    table_header_transposed += terms1_transposed.join("") + "}\n\\toprule\n{\\bf \\scriptsize State} & {\\bf \\scriptsize AP} & ";
  }
  
  var terms3_transposed = [];
  for (var l=0; l<nTimecuts-1; l++) {
  	terms3_transposed.push("\\multicolumn{" + K + "}{@{}c@{}|}{\\bf \\scriptsize [" + timecuts[l].start + "," + timecuts[l].end + "]}");
  }
  terms3_transposed.push("\\multicolumn{" + K + "}{@{}c@{}|}{\\bf \\scriptsize [" + timecuts[nTimecuts-1].start + "," + timecuts[nTimecuts-1].end + "]}");
  if (terms3_transposed.length>0) {
    table_header_transposed += terms3_transposed.join(" & ") + "\\\\  \n";
  }

  var terms4_transposed = [];
  var endCline = 0;
  for (l=3; l<=nTimecuts*K + 2; ) {
  	endCline = l + (K - 1);
  	terms4_transposed.push("\\cmidrule(lr){" + l + "-" + endCline + "}");
  	l = endCline + 1;
  }
  if (terms4_transposed.length>0) {
    table_header_transposed += terms4_transposed.join(" ") + " & & ";
  }
  
  var terms2_transposed = [];
  for (var l=0; l<nTimecuts; l++) {
  	for (var k=0; k<K; k++) {
  		terms2_transposed.push("{\\bf \\scriptsize AP" + (k+1) + "}");
  	}
  }
  
  if (terms2_transposed.length>0) {
    table_header_transposed += terms2_transposed.join(" & ") + "\\\\ \n \\toprule \n";
  }
  
  var strMAP_State2Pattern = table_headerMAP_State2Pattern + table_header;
  var strMAP_State2Pattern_transposed = table_headerMAP_State2Pattern_transposed + table_header_transposed;

  // CSV format 	
  var csv_header = "Time interval,";
  var terms_csv = [];
  for (var i=0; i<nStates; i++) {
  	for (var k=0; k<K; k++) {
  		terms_csv.push(dict[i].shortLabel + "/AP" + (k+1));
  	}
  }
  if (terms_csv.length>0) {
    csv_header += terms_csv.join(",") + "\n";
  }  

  var csv_header_transposed = "Time interval,";
  var terms_csv_transposed = [];
  for (var i=0; i<nTimecuts; i++) {
  	for (var k=1; k<=K; k++) {
  		terms_csv_transposed.push("[" + timecuts[i].start + "-" + timecuts[i].end + "]/AP" + k);
  	}
  }
  if (terms_csv_transposed.length>0) {
    csv_header_transposed += terms_csv_transposed.join(",") + "\n";
  }  


  // Define array of results for property
  var tableMAP_State2Pattern = new Array(nTimecuts);
  for (var i = 0; i < nTimecuts; i++) {
  	tableMAP_State2Pattern[i] = new Array(K*nStates);
  }
	
  var tableMAP_State2Pattern_transposed = new Array(nStates*K);
  for (var i = 0; i < nStates*K; i++) {
  	tableMAP_State2Pattern_transposed[i] = new Array(K*nTimecuts);
  }

  
  var indexState = -1;
  indextimecut = -1;
  patternId = 0;
  var patternId1 = 0;
  var indexRow = 0;
  var indexCol = 0;
  data.forEach(function(entry) {
  		indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		indexState = parseInt(indexStateDictionary(entry.result.j));
  		patternId = parseInt(entry.result.i);
  		patternId1 = parseInt(entry.result.i1);
  		// testing:
	  	//console.log("State j= " + entry.result.j + " in pattern " + patternId + " at current dictIndex " + indexState + " going to i1=" + patternId1 + " p=" + entry.result.p + " " + entry.result.value + " at time cut " + indextimecut);
  		if (indexState != -1) {
	  		//console.log("State j= " + entry.result.j + " in pattern " + patternId + " at current dictIndex " + indexState + " going to i1=" + patternId1);
  			indexRow = indexState * K + patternId - 1;
  			indexCol = indextimecut * K + patternId1 - 1;
  			//tableMAP_State2Pattern_transposed[indexRow][indexCol] = (Number(entry.result.value)).toFixed(2);
  			if (entry.result.value.indexOf("false") == 0) {
  				tableMAP_State2Pattern_transposed[indexRow][indexCol] = "false";;
  			}
  			else if (entry.result.value.indexOf("true") == 0) {
  				//tableMAP_State2Pattern_transposed[indexRow][indexCol] = parseFloat(entry.result.value);
	  			tableMAP_State2Pattern_transposed[indexRow][indexCol] = parseFloat(entry.result.p).toFixed(2);
  				//console.log("Table entry at " + indexRow + ", " + index + " is " + tableMAP_State2Pattern_transposed[indexRow][indexCol]);
  			}
  			else {
  				console.log("Unknown value, not true or false, but " + entry.result.value);
  			}
  
  	}
  });
  // testing
  // console.log(JSON.stringify(tableMAP_State2Pattern_transposed));
  



// Printing transposed results into a latex table
  for (var l=0; l<nStates; l++){
  	strMAP_State2Pattern_transposed += "\\" + dict[l].shortLabel;
  	for (var x=0; x<K; x++) {
		strMAP_State2Pattern_transposed += " & AP" + (x+1);
		for (var i=0; i<nTimecuts*K; i++) {
		  	strMAP_State2Pattern_transposed += " & " + tableMAP_State2Pattern_transposed[l*K+x][i]; 
	  	}
  		strMAP_State2Pattern_transposed += "\\\\ \n";
  	}
	if (l < nStates-1) {
		strMAP_State2Pattern_transposed += "\\midrule \n";
	}
  }
  strMAP_State2Pattern_transposed += "\\bottomrule \n \\end{tabular}\n}\n\\end{table}";	



  // CSV file - not checked for correctness  
  //var csvMAP_State2Pattern = csv_header;
  //for (var i=0; i<nTimecuts; i++) {
  //	csvMAP_State2Pattern += timecuts[i].start + " - " + timecuts[i].end + "," + tableMAP_State2Pattern[i].join(",") + "\n";
  //}  
  
  // CSV file - not fixed
  //var csvMAP_State2Pattern_transposed = csv_header_transposed;
  //for (var j=0; j<nStates; j++) {
  //	csvMAP_State2Pattern_transposed += "" + dict[j].shortLabel + "," + tableMAP_State2Pattern_transposed[i].join(",") + "\n";
  //	for (i=0; i<K; i++) {
  //		csvMAP_State2Pattern_transposed += . ..	
  //	}
  //}
  
  
  if (fileType.indexOf("latex") == 0) {
  	console.log(strMAP_State2Pattern_transposed + "\n\n");
  }
  else if (fileType.indexOf("csv") == 0) {
  	console.log(csvMAP_State2Pattern_transposed); 
  }
  
  
  
  //console.log(strMAP_State2Pattern + "\n\n");
  
  //console.log(csvMAP_State2Pattern);  
    
  function isUseStart(stateIndex_j){
  	//console.log(stateIndex_j);
  	//console.log(parseInt(stateIndex_j)); 	
  	if (fullDict[parseInt(stateIndex_j)].label.indexOf("UseStart") == 0) {
  		//console.log("Initial state for j0= " + parseInt(stateIndex_j));
		return true;
	}
	return false;
  }
  
  function indexStateDictionary(stateIndex_j) {
	for (var l=0; l<nStates; l++) {
		if(parseInt(dict[l].id) == parseInt(stateIndex_j)) return l; 
	}
	return -1;
  }  

  
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
 
  function orderingColourLowBest(n,K) {
  	switch(K){
  		case 2: { if (n === -1) return colourK2(-1); else return colourK2(K-1-n); }
  		case 3: { if (n === -1) return colourK3(-1); else return colourK3(K-1-n); }
  		case 4: { if (n === -1) return colourK4(-1); else return colourK4(K-1-n); }
  		case 5: { if (n === -1) return colourK5(-1); else return colourK5(K-1-n); }
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
