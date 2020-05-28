// Oana Andrei 2016-2020

var fs = require('fs');

// \definecolor{fgreen}{rgb}{0.07, 0.53, 0.03}

if (process.argv.length<7) {
  console.log('Usage: node jsonResults2tables_AT1_MAP.js results_GPAM_K2.json K [latex|csv] [5statesL1|UseStop|8statesL1|UBCstates|twolevels|threelevels]) [VP1|SC1|VC1|PG3|VPbtw|SCbtw_1|SCbtw_2]');
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
  var propType = process.argv[6]; 
  var timecut_start = 30;
  var timecut_end = 60;  
  if (propType.indexOf("SCbtw") == 0 || propType.indexOf("VPbtw") == 0) {
  	if (process.argv.length<9) {
  		console.log('Usage: node jsonResults2tables_AT1.js results_Pattern_PAM_K2.json K csv [twolevels|threelevels] [VPbtw|SCbtw_1|SCbtw_2] start end');
  		return;
  	}
	timecut_start = process.argv[7];
	timecut_end = process.argv[8];
  }
    
  var MAX_STEPS_REWARD = 2000.00;
  
  // default dictionary OverallUsage, StackedBars, PeriodSelectors, Stats - states at level 1 in the hierarchical menu
  var dict_5statesL1 = [
  //	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
  //	{ id: "1", label: "TermsAndConditions", shortLabel: "TC" },
  //	{ id: "2", label: "ATMainView", shortLabel: "Main" },
  	{ id: "3", label: "ATOverallUsageView", shortLabel: "OverallUsage" },
  	{ id: "4", label: "ATStackedBarsView", shortLabel: "StackedBars" },
  	{ id: "5", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" }, 
  	{ id: "6", label: "ATAppsInPeriodView", shortLabel: "AppsInPeriod" },
  //  	{ id: "7", label: "ATSettingsView", shortLabel: "Settings" },
  //  	{ id: "8", label: "UseStop", shortLabel: "UseStop" },
	{ id: "9", label: "ATStatsView", shortLabel: "Stats" },
  //  	{ id: "10", label: "ATUsageBarChartATOverallUsageView", shortLabel: "UBCOverallUsage" },
  //  	{ id: "11", label: "ATFeedbackView", shortLabel: "Feedback" },
  //  	{ id: "12", label: "ATUsageBarChartATStatsView", shortLabel: "UBCStats" },
  //	{ id: "13", label: "ATInfoView", shortLabel: "Info" },
  //	{ id: "14", label: "ATUsageBarChartATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
  //	{ id: "15", label: "ATTaskView", shortLabel: "Task" }
  	]; 	
 
	// UseStop only dictionary
  var dict_UseStop = [
  //	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
  //	{ id: "1", label: "TermsAndConditions", shortLabel: "TC" },
  //	{ id: "2", label: "ATMainView", shortLabel: "Main" },
  //	{ id: "3", label: "ATOverallUsageView", shortLabel: "OverallUsage" },
  //	{ id: "4", label: "ATStackedBarsView", shortLabel: "StackedBars" },
  //	{ id: "5", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" }, 
  //  	{ id: "6", label: "ATAppsInPeriodView", shortLabel: "AppsInPeriod" },
  //  	{ id: "7", label: "ATSettingsView", shortLabel: "Settings" },
    	{ id: "8", label: "UseStop", shortLabel: "UseStop" },
  //  	{ id: "9", label: "ATStatsView", shortLabel: "Stats" },
  //  	{ id: "10", label: "ATUsageBarChartATOverallUsageView", shortLabel: "UBCOverallUsage" },
  //  	{ id: "11", label: "ATFeedbackView", shortLabel: "Feedback" },
  //  	{ id: "12", label: "ATUsageBarChartATStatsView", shortLabel: "UBCStats" },
  //	{ id: "13", label: "ATInfoView", shortLabel: "Info" },
  //	{ id: "14", label: "ATUsageBarChartATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
  //	{ id: "15", label: "ATTaskView", shortLabel: "Task" }
  	];
  	
	// 8 states dictionary
  var dict_8statesL1 = [
  //	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
  //	{ id: "1", label: "TermsAndConditions", shortLabel: "TC" },
  //	{ id: "2", label: "ATMainView", shortLabel: "Main" },
  	{ id: "3", label: "ATOverallUsageView", shortLabel: "OverallUsage" },
  	{ id: "4", label: "ATStackedBarsView", shortLabel: "StackedBars" },
  	{ id: "5", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" }, 
  	{ id: "6", label: "ATAppsInPeriodView", shortLabel: "AppsInPeriod" },
  //  	{ id: "7", label: "ATSettingsView", shortLabel: "Settings" },
  //  	{ id: "8", label: "UseStop", shortLabel: "UseStop" },
   	{ id: "9", label: "ATStatsView", shortLabel: "Stats" },
  	{ id: "10", label: "ATUsageBarChartATOverallUsageView", shortLabel: "UBCOverallUsage" },
  //  	{ id: "11", label: "ATFeedbackView", shortLabel: "Feedback" },
  	{ id: "12", label: "ATUsageBarChartATStatsView", shortLabel: "UBCStats" },
  //	{ id: "13", label: "ATInfoView", shortLabel: "Info" },
	{ id: "14", label: "ATUsageBarChartATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
  //	{ id: "15", label: "ATTaskView", shortLabel: "Task" }
  	];
  	
	// 8 states dictionary
  var dict_UBCstates = [
  //	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
  //	{ id: "1", label: "TermsAndConditions", shortLabel: "TC" },
  //	{ id: "2", label: "ATMainView", shortLabel: "Main" },
  //	{ id: "3", label: "ATOverallUsageView", shortLabel: "OverallUsage" },
  //	{ id: "4", label: "ATStackedBarsView", shortLabel: "StackedBars" },
  //	{ id: "5", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" }, 
  //	{ id: "6", label: "ATAppsInPeriodView", shortLabel: "AppsInPeriod" },
  //  	{ id: "7", label: "ATSettingsView", shortLabel: "Settings" },
  //  	{ id: "8", label: "UseStop", shortLabel: "UseStop" },
  // 	{ id: "9", label: "ATStatsView", shortLabel: "Stats" },
  	{ id: "10", label: "ATUsageBarChartATOverallUsageView", shortLabel: "UBCOverallUsage" },
  //  	{ id: "11", label: "ATFeedbackView", shortLabel: "Feedback" },
  	{ id: "12", label: "ATUsageBarChartATStatsView", shortLabel: "UBCStats" },
  //	{ id: "13", label: "ATInfoView", shortLabel: "Info" },
	{ id: "14", label: "ATUsageBarChartATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
  //	{ id: "15", label: "ATTaskView", shortLabel: "Task" }
  	];  	

  var dict_twolevels = [
  //	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
  //	{ id: "1", label: "TermsAndConditions", shortLabel: "TC" },
  	{ id: "2", label: "ATMainView", shortLabel: "Main" },
  	{ id: "3", label: "ATOverallUsageView", shortLabel: "OverallUsage" },
  	{ id: "4", label: "ATStackedBarsView", shortLabel: "StackedBars" },
  	{ id: "5", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" }, 
  	{ id: "6", label: "ATAppsInPeriodView", shortLabel: "AppsInPeriod" },
  //  	{ id: "7", label: "ATSettingsView", shortLabel: "Settings" },
	{ id: "9", label: "ATStatsView", shortLabel: "Stats" },
  	{ id: "8", label: "UseStop", shortLabel: "UseStop" },
  //  	{ id: "10", label: "ATUsageBarChartATOverallUsageView", shortLabel: "UBCOverallUsage" },
  //  	{ id: "11", label: "ATFeedbackView", shortLabel: "Feedback" },
  //  	{ id: "12", label: "ATUsageBarChartATStatsView", shortLabel: "UBCStats" },
  //	{ id: "13", label: "ATInfoView", shortLabel: "Info" },
  //	{ id: "14", label: "ATUsageBarChartATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
  //	{ id: "15", label: "ATTaskView", shortLabel: "Task" }
  	]; 	

  // Dictionary for properties computing probabilities or expected cumulated rewards between two states
  var dict_threelevels = [
  //	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
  //	{ id: "1", label: "TermsAndConditions", shortLabel: "TC" },
  	{ id: "2", label: "ATMainView", shortLabel: "Main" },
  	{ id: "3", label: "ATOverallUsageView", shortLabel: "OverallUsage" },
  	{ id: "4", label: "ATStackedBarsView", shortLabel: "StackedBars" },
  	{ id: "5", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" }, 
  	{ id: "6", label: "ATAppsInPeriodView", shortLabel: "AppsInPeriod" },
  //  	{ id: "7", label: "ATSettingsView", shortLabel: "Settings" },
	{ id: "9", label: "ATStatsView", shortLabel: "Stats" },
  	{ id: "8", label: "UseStop", shortLabel: "UseStop" },
  	{ id: "10", label: "ATUsageBarChartATOverallUsageView", shortLabel: "UBCOverallUsage" },
  //  	{ id: "11", label: "ATFeedbackView", shortLabel: "Feedback" },
  	{ id: "12", label: "ATUsageBarChartATStatsView", shortLabel: "UBCStats" },
  //	{ id: "13", label: "ATInfoView", shortLabel: "Info" },
  	{ id: "14", label: "ATUsageBarChartATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
  //	{ id: "15", label: "ATTaskView", shortLabel: "Task" }
  	]; 	


  var dict;
  if (dictType.indexOf("5statesL1") == 0) {
  	dict = dict_5statesL1;
  }
  else if (dictType.indexOf("UseStop") == 0) {
  	dict = dict_UseStop;
  }
  else if (dictType.indexOf("8statesL1") == 0) {
  	dict = dict_8statesL1;
  }
  else if (dictType.indexOf("UBCstates") == 0) {
  	dict = dict_UBCstates;
  }
  else if (dictType.indexOf("twolevels") == 0) {
  	dict = dict_twolevels;
  }  
  else if (dictType.indexOf("threelevels") == 0) {
  	dict = dict_threelevels;
  }  
  else {
  	console.log("Incorrect choice of dictionary option!");
  	return;
  }
  var nStates = dict.length;

  var fullDict = [
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
  var table_headerMAP_VP1 = "\\begin{table}\n\\center\n\\caption{MAP property \VisitProbInit\ for GPAM(" + K + ") of AppTracker1}\\label{table:AT1_MAP_VP1_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{|c|";

  // Property MAP_SC1_1
  var table_headerMAP_SC1_1 = "\\begin{table}\n\\center\n\\caption{MAP property \StepCountInit\ (counting any type of steps) for GPAM(" + K + ") of AppTracker1}\\label{table:AT1_MAP_SC1_1_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{|c|";

  // Property MAP_SC1_2
  var table_headerMAP_SC1_2 = "\\begin{table}\n\\center\n\\caption{MAP property \StepCountInit\ (counting only steps in each pattern) for GPAM(" + K + ") of AppTracker1}\\label{table:AT1_MAP_SC1_2_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{|c|";

  // Property MAP_VC1
  var table_headerMAP_VC1 = "\\begin{table}\n\\center\n\\caption{MAP property \VisitCountInit\ for GPAM(" + K + ") of AppTracker1}\\label{table:AT1_MAP_VC1_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{|c|";

  // Property MAP_PG3_SteadyState
  var table_headerMAP_PG3 = "\\begin{table}\n\\center\n\\caption{MAP property SteadyState for GPAM(" + K + ") of AppTracker1}\\label{table:AT1_MAP_SteadyState_K" + K + "}\n{\\footnotesize\n\\begin{tabular}{|c|";

  var table_headerMAP_VPbtw = "\\begin{table}\n\\center\n\\caption{MAP property \VisitProbBetween\ for GPAM(" + K + ") and the time interval [" + timecut_start + ", " + timecut_end + "] of AppTracker1}\\label{table:AT1_MAP_VPbtw_K" + K + "_" + timecut_start + "_" + timecut_end + "}\n{\\footnotesize\n\\begin{tabular}{|c|";

  var table_headerMAP_SCbtw_1 = "\\begin{table}\n\\center\n\\caption{MAP property any \StepCountBetween\ for GPAM(" + K + ") and the time interval [" + timecut_start + ", " + timecut_end + "] of AppTracker1}\\label{table:AT1_MAP_SCbtw_1_K" + K + "_" + timecut_start + "_" + timecut_end + "}\n{\\footnotesize\n\\begin{tabular}{|c|";
  var table_headerMAP_SCbtw_2 = "\\begin{table}\n\\center\n\\caption{MAP property specific pattern \StepCountBetween\ for GPAM(" + K + ") and the time interval [" + timecut_start + ", " + timecut_end + "] of AppTracker1}\\label{table:AT1_MAP_SCbtw_2_K" + K + "_" + timecut_start + "_" + timecut_end + "}\n{\\footnotesize\n\\begin{tabular}{|c|";
    
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
    
  var strMAP_VP1 = table_headerMAP_VP1 + table_header;
  var strMAP_SC1_1 = table_headerMAP_SC1_1 + table_header;
  var strMAP_SC1_2 = table_headerMAP_SC1_2 + table_header;
  var strMAP_VC1 = table_headerMAP_VC1 + table_header;
  var strMAP_PG3 = table_headerMAP_PG3 + table_header;

  var strMAP_VPbtw = table_headerMAP_VPbtw + table_header_extra;
  var strMAP_SCbtw_1 = table_headerMAP_SCbtw_1 + table_header_extra;
  var strMAP_SCbtw_2 = table_headerMAP_SCbtw_2 + table_header_extra;
  

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
  
  
  // Define array of results for property MAP_VP1
  var tableMAP_VP1 = new Array(nTimecuts);
  for (var i = 0; i < nTimecuts; i++) {
  	tableMAP_VP1[i] = new Array(K*nStates);
  }

  // Define array of results for property MAP_SC1_1
  var tableMAP_SC1_1 = new Array(nTimecuts);
  for (var i = 0; i < nTimecuts; i++) {
  	tableMAP_SC1_1[i] = new Array(K*nStates);
  }

  // Define array of results for property MAP_SC1_2
  var tableMAP_SC1_2 = new Array(nTimecuts);
  for (var i = 0; i < nTimecuts; i++) {
  	tableMAP_SC1_2[i] = new Array(K*nStates);
  }
  
  var tableMAP_VC1 = new Array(nTimecuts);
  for (var i = 0; i < nTimecuts; i++) {
  	tableMAP_VC1[i] = new Array(K*nStates);
  }

  var tableMAP_PG3 = new Array(nTimecuts);
  for (var i = 0; i < nTimecuts; i++) {
  	tableMAP_PG3[i] = new Array(K*nStates);
  }
  
  var tableMAP_VPbtw = new Array(K*nStates);
  for (var i = 0; i < K*nStates; i++) {
  	tableMAP_VPbtw[i] = new Array(K*nStates);
  }
  
  var tableMAP_SCbtw_1 = new Array(K*nStates);
  for (var i = 0; i < K*nStates; i++) {
  	tableMAP_SCbtw_1[i] = new Array(K*nStates);
  }

  var tableMAP_SCbtw_2 = new Array(K*nStates);
  for (var i = 0; i < K*nStates; i++) {
  	tableMAP_SCbtw_2[i] = new Array(K*nStates);
  }
  
    
  // Fill in arrays with results for each property, each line corresponds to a time cut
  var index = 0;
  var indextimecut = -1;
  var patternId = 0;
  var patternIdSource = 0;
  var patternIdTarget = 0;
  var pctlName;
  data.forEach(function(entry) {
  	if (entry.pctl.name.indexOf("VP2_1") == 0) {
  		indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		index = parseInt(indexStateDictionary(entry.result.j2));
  		patternId = parseInt(entry.result.i2);
  		if (index != -1) {
	  		//console.log("j2= " + entry.result.j2 + " in pattern " + patternId + " at current dictIndex " + index);
  			index = index * K + patternId - 1;
  			//tableMAP_VP1[indextimecut][index] = (Number(entry.result.value)).toFixed(2);
  			if (entry.result.value == null){
  				tableMAP_VP1[indextimecut][index] = "---";;
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableMAP_VP1[indextimecut][index] = "---";
  			}
  			else if (entry.result.value === "ErrorNotConverge") {
  				tableMAP_VP1[indextimecut][index] = "---";
  			}
  			else {
  				//tableMAP_VP1[indextimecut][index] = parseFloat(entry.result.value);
	  			tableMAP_VP1[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  				//console.log("Table entry at " + indextimecut + ", " + index + " is " + tableMAP_VP1[indextimecut][index]);
  			}
  		}
  	}
	
	// To Do: adapt from SAP to MAP -- Check if it works! -- undefined entry for 
  	// VP2_5: filter(state,P=?[!"UseStop" U<=N (x=i2 & y=j2)],x=i0 & y=j0)
  	// probability to reach state j2 in pattern i2 (row state) from j0 in pattern i0 (column state)
  	if (entry.pctl.name.indexOf("VP2_5") == 0 && parseInt(entry.timecut.start) == timecut_start && parseInt(entry.timecut.end) == timecut_end) {
  		if(parseInt(indexStateDictionary(entry.result.j2)) != -1 && parseInt(indexStateDictionary(entry.result.j0)) != -1) {
  			patternIdSource = parseInt(entry.result.i0);
  			patternIdTarget = parseInt(entry.result.i2);
	  		indexRow = parseInt(indexStateDictionary(entry.result.j2)) * K + patternIdTarget - 1;
  			indexCol = parseInt(indexStateDictionary(entry.result.j0)) * K + patternIdSource - 1;
  			if (entry.result.value == null){
  				tableMAP_VPbtw[indexRow][indexCol] = "---";;
	  		}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableMAP_VPbtw[indexRow][indexCol] = "---";
	  		}	
  			else {
	  			tableMAP_VPbtw[indexRow][indexCol] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
	  			//console.log("Table entry at " + indextimecut + ", " + indexRow + ", " + indexCol + " is " + tableMAP_VPbtw[indexRow][indexCol]);
  			}
  		}
  	}

	
 	if (entry.pctl.name.indexOf("SC2_1") == 0) { 
        //console.log("Initial state (j0,i0) = (" + entry.result.j0 + ", " + entry.result.i0 + ") " + JSON.stringify(entry));
  	if (isUseStart(entry.result.j0) && parseInt(entry.result.i0) === 0) {
  	    //console.log("Initial state j0 = " + entry.result.j0 + " to reach in pattern " + entry.result.i1 + " state at current dictIndex " + entry.result.j1 + "   " + parseInt(indexStateDictionary(entry.result.j1)));
  		indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		index = parseInt(indexStateDictionary(entry.result.j1));
  		patternId = parseInt(entry.result.i1);
		if (index != -1) {
		//console.log("j1= " + entry.result.j1 + " in pattern " + patternId + " at current dictIndex " + index);
			index = index * K + patternId - 1;
		  	if (entry.result.value == null) {
  				tableMAP_SC1_1[indextimecut][index] = "---";//"$\\infty$";
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableMAP_SC1_1[indextimecut][index] = "---";
  			}
  			else if (entry.result.value === "ErrorNotConverge") {
  				tableMAP_SC1_1[indextimecut][index] = "---";
  			}
  			else {
  				tableMAP_SC1_1[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  				//console.log("Table entry at " + indextimecut + ", " + index + " is " + tableMAP_SC1_1[indextimecut][index]);
  			}
  		}
  	}}

  	if (entry.pctl.name.indexOf("SC2_2") == 0) {
  	if (isUseStart(entry.result.j0) && parseInt(entry.result.i0) == 0) {
  		indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		index = parseInt(indexStateDictionary(entry.result.j1));
  		pctlName = entry.pctl.name;
  		patternId = parseInt(pctlName.substr(pctlName.indexOf("AP") + 2));
		if (index != -1) {
			index = index * K + patternId - 1;
		  	if (entry.result.value == null) {
  				tableMAP_SC1_2[indextimecut][index] = "---";//"$\\infty$";
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableMAP_SC1_2[indextimecut][index] = "---";
  			}
   			else if (entry.result.value === "ErrorNotConverge") {
  				tableMAP_SC1_1[indextimecut][index] = "---";
  			}
 			else {
  				tableMAP_SC1_2[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  			}
  		}
  	}}
	
  	// MAP: filter(state,R{\"r_Steps\"}=?[F (x=i1 & y=j1)],x=i0 & y=j0)
  	// probability to reach j1 (row state/target) from j0 (column state)
  	if (entry.pctl.name.indexOf("SC2_1") == 0 && parseInt(entry.timecut.start) == timecut_start && parseInt(entry.timecut.end) == timecut_end && parseInt(entry.result.i0) > 0) {
  		if(parseInt(indexStateDictionary(entry.result.j1)) != -1 && parseInt(indexStateDictionary(entry.result.j0)) != -1) {
  			patternIdSource = parseInt(entry.result.i0);
  			patternIdTarget = parseInt(entry.result.i1);
  			indexRow = parseInt(indexStateDictionary(entry.result.j1)) * K + patternIdTarget - 1;
  			indexCol = parseInt(indexStateDictionary(entry.result.j0)) * K + patternIdSource - 1;
  			
  			if (entry.result.value == null){
  				tableMAP_SCbtw_1[indexRow][indexCol] = "---";
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableMAP_SCbtw_1[indexRow][indexCol] = "---";
  			}
  			else {
	  			tableMAP_SCbtw_1[indexRow][indexCol] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  				//console.log("Table entry at " + indexRow + ", " + indexCol + " is " + tableMAP_SCbtw_1[indexRow][indexCol]);
  			}
  		}
  	}
  	 
  	// MAP: filter(state,R{\"r_Steps\"}=?[F (x=i1 & y=j1)],x=i0 & y=j0)
  	// probability to reach j2 (row state) from j0 (column state)
  	if (entry.pctl.name.indexOf("SC2_2") == 0 && parseInt(entry.timecut.start) == timecut_start && parseInt(entry.timecut.end) == timecut_end && parseInt(entry.result.i0) > 0) {
  		if(parseInt(indexStateDictionary(entry.result.j1)) != -1 && parseInt(indexStateDictionary(entry.result.j0)) != -1) {
  			patternIdSource = parseInt(entry.result.i0);
  			patternIdTarget = parseInt(entry.result.i1);
  			indexRow = parseInt(indexStateDictionary(entry.result.j1)) * K + patternIdTarget - 1;
  			indexCol = parseInt(indexStateDictionary(entry.result.j0)) * K + patternIdSource - 1;
  			if (entry.result.value == null){
  				tableMAP_SCbtw_2[indexRow][indexCol] = "---";;
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableMAP_SCbtw_2[indexRow][indexCol] = "---";
  			}
  			else {
	  			tableMAP_SCbtw_2[indexRow][indexCol] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  				//console.log("Table entry at " + indextimecut + ", " + index + " is " + tableMAP_SCbtw_2[indexRow][indexCol]);
  			}
  		}
  	}
  	  	 	
  	if (entry.pctl.name.indexOf("VC2_1_2") == 0) {
  	if (isUseStart(entry.result.j0)) {
  		indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		index = parseInt(indexStateLabelDict_VC2_1_2(entry.pctl.name));
  		pctlName = entry.pctl.name;
  		patternId = parseInt(pctlName.substr(pctlName.indexOf("AP") + 2));
  		if (index != -1) {
  			//console.log("State label " + entry.pctl.name.substring(8) + " in pattern " + patternId + " at current dictIndex " + index);
  			index = index * K + patternId - 1;
  			//console.log("Val: " + entry.result.value);
  			if (entry.result.value == null) {
  				tableMAP_VC1[indextimecut][index] = "---";
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableMAP_VC1[indextimecut][index] = "---";
  			}
  			else if (entry.result.value === "ErrorNotConverge") {
  				tableMAP_VC1[indextimecut][index] = "---";
  			}
  			else {
	  			//tableMAP_VC1[indextimecut][index] = parseFloat(entry.result.value);
  				tableMAP_VC1[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  				//console.log("Table entry at " + indextimecut + ", " + index + " is " + tableMAP_VC1[indextimecut][index]);
  			}
  		}
  	 }}	

  	if (entry.pctl.name.indexOf("PG3_SteadyState") == 0) {
  		indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		index = 0;
  		patternId = parseInt(entry.result.i);
		index = index * K + patternId - 1;
		if (entry.result.value == null){
			tableMAP_PG3[indextimecut][index] = "---";;
		}
		else if (entry.result.value === "ErrorFilterInit") {
			tableMAP_PG3[indextimecut][index] = "---";
		}
		else if (entry.result.value === "ErrorNotConverge") {
			tableMAP_PG3[indextimecut][index] = "---";
		}
		else {
 			tableMAP_PG3[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
		}
  	}

  });
  
  //console.log(JSON.stringify(tableMAP_VC1));

  var Kcolouring = new Array(K);

// Printing results into a latex table

// Property MAP_VP1
  for (var l=0; l<nTimecuts; l++){
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
	strMAP_VP1 += "[" + timecuts[l].start + "," + timecuts[l].end + "]";
  	
  	// colouring
  	for(var s=0; s<nStates*K-K+1; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				if (tableMAP_VP1[l][x] === "---" && tableMAP_VP1[l][y] === "---" ) {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableMAP_VP1[l][x] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y]++;
  				} else if (tableMAP_VP1[l][y] === "---") {
  					Kcolouring[x]++;
  					Kcolouring[y] = -1;
  				
  				} else {
  					if (parseFloat(tableMAP_VP1[l][y]) > parseFloat(tableMAP_VP1[l][x])) { 
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableMAP_VP1[l][y]) < parseFloat(tableMAP_VP1[l][x])) { 
	  					Kcolouring[x]++;
  					} else { 
  						Kcolouring[y]++; Kcolouring[x]++;
  					}	
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strMAP_VP1 += " & " + orderingColourHighBest(Kcolouring[x],K) + tableMAP_VP1[l][x] + "}"; 
  		}  		
  	}
//		// no colouring 	
//  	for (var i=0; i<nStates*K; i++) {
//  		strMAP_VP1 +=  " & " + tableMAP_VP1[l][i];
//  	}

  	strMAP_VP1 += "\\\\ \\hline \n";
  }
  strMAP_VP1 += "\\end{tabular}\n}\n\\end{table}";	

/*  var csvMAP_VP1 = csv_header;
  for (var i=0; i<nStates; i++) {
  	csvMAP_VP1 += i + "," + dict[i] + "," + tableMAP_VP1[i].join(",") + "\n";
  }  
 */ 
 
  var csvMAP_VP1 = csv_header_init;
  for (var l=0; l<nTimecuts; l++) {
  	csvMAP_VP1 += l + "," + "[" + timecuts[l].start + "," + timecuts[l].end + "]" + "," + tableMAP_VP1[l].join(",") + "\n";
  }  
  
   
  var csvMAP_VPbtw = csv_header_btw;
  for (var l=0; l<nStates; l++) {
  	for (var k=1; k<=K; k++) {
  		csvMAP_VPbtw += (l*K + k) + "," + dict[l].shortLabel + "/AP" + k + "," + tableMAP_VPbtw[l].join(",") + "\n";
  	}
  }  


// Property MAP_SC1_1
  for (var l=0; l<nTimecuts; l++){
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
	strMAP_SC1_1 += "[" + timecuts[l].start + "," + timecuts[l].end + "]" ;
	
	// colouring
  	for(var s=0; s<nStates*K-K+1; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				if (tableMAP_SC1_1[l][x] === "---" && tableMAP_SC1_1[l][y] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableMAP_SC1_1[l][x] === "---") {
  					Kcolouring[x] = -1;
  					//Kcolouring[y]++;
  				} else if (tableMAP_SC1_1[l][y] === "---") {
  					//Kcolouring[x]++;
  					Kcolouring[y] = -1;
  				} else {
  					if (parseFloat(tableMAP_SC1_1[l][y]) > parseFloat(tableMAP_SC1_1[l][x])) { 
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableMAP_SC1_1[l][y]) < parseFloat(tableMAP_SC1_1[l][x])) { 
	  					Kcolouring[x]++;
  					} else { 
  						Kcolouring[y]++; Kcolouring[x]++;
  					}	
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strMAP_SC1_1 += " & " + orderingColourLowBest(Kcolouring[x],K) + tableMAP_SC1_1[l][x] + "}"; 
  		}  		
  	}
  	strMAP_SC1_1 += "\\\\ \\hline \n";
  }
  strMAP_SC1_1 += "\\end{tabular}}\n\n\\end{table}";	

// Property MAP_SC1_2
  for (var l=0; l<nTimecuts; l++){
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
	strMAP_SC1_2 += "[" + timecuts[l].start + "," + timecuts[l].end + "]" ;
	
	// colouring
  	for(var s=0; s<nStates*K-K+1; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				if (tableMAP_SC1_2[l][x] === "---" && tableMAP_SC1_2[l][y] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableMAP_SC1_2[l][x] === "---") {
  					Kcolouring[x] = -1;
  					//Kcolouring[y]++;
  				} else if (tableMAP_SC1_2[l][y] === "---") {
  					//Kcolouring[x]++;
  					Kcolouring[y] = -1;
  				} else {
  					if (parseFloat(tableMAP_SC1_2[l][y]) > parseFloat(tableMAP_SC1_2[l][x])) { 
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableMAP_SC1_2[l][y]) < parseFloat(tableMAP_SC1_2[l][x])) { 
	  					Kcolouring[x]++;
  					} else { 
  						Kcolouring[y]++; Kcolouring[x]++;
  					}	
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strMAP_SC1_2 += " & " + orderingColourLowBest(Kcolouring[x],K) + tableMAP_SC1_2[l][x] + "}"; 
  		}  		
  	}
  	strMAP_SC1_2 += "\\\\ \\hline \n";
  }
  strMAP_SC1_2 += "\\end{tabular}}\n\n\\end{table}";	


  var csvMAP_SC1_1 = csv_header_init;
  for (var l=0; l<nTimecuts; l++) {
  	csvMAP_SC1_1 += l + "," + "[" + timecuts[l].start + "," + timecuts[l].end + "]" + "," + tableMAP_SC1_1[l].join(",") + "\n";
  }  

  var csvMAP_SC1_2 = csv_header_init;
  for (var l=0; l<nTimecuts; l++) {
  	csvMAP_SC1_2 += l + "," + "[" + timecuts[l].start + "," + timecuts[l].end + "]" + "," + tableMAP_SC1_2[l].join(",") + "\n";
  }  

  var csvMAP_SCbtw_1 = csv_header_btw;
  for (var l=0; l<nStates; l++) {
  	for (var k=1; k<=K; k++) {
  		csvMAP_SCbtw_1 += (l*K + k) + "," + dict[l].shortLabel + "/AP" + k + "," + tableMAP_SCbtw_1[l].join(",") + "\n";
  	}
  }  

  var csvMAP_SCbtw_2 = csv_header_btw;
  for (var l=0; l<nStates; l++) {
  	for (var k=1; k<=K; k++) {
  		csvMAP_SCbtw_2 += (l*K + k) + "," + dict[l].shortLabel + "/AP" + k + "," + tableMAP_SCbtw_2[l].join(",") + "\n";
  	}
  }  


 // Property MAP_VC1 
  for (var l=0; l<nTimecuts; l++){
    for (var i=0; i<nStates*K; i++) 
    	Kcolouring[i] = 0;
	strMAP_VC1 += "[" + timecuts[l].start + "," + timecuts[l].end + "]";

  	// colouring
  	// "---" does not change colour from default (worse result)
  	for(var s=0; s<nStates*K-K+1; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				//console.log("Compare " + tableMAP_VC1[l][x] + " and " + tableMAP_VC1[l][y]);
  				//console.log("Compare parsed " + parseFloat(tableMAP_VC1[l][x]) + " and " + parseFloat(tableMAP_VC1[l][y])); 
  				if (tableMAP_VC1[l][x] === "---" && tableMAP_VC1[l][y] === "---" ) {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableMAP_VC1[l][x] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y]++;
  				} else if (tableMAP_VC1[l][y] === "---") {
  					Kcolouring[x]++;
  					Kcolouring[y] = -1;
  				} else {
  					if (parseFloat(tableMAP_VC1[l][y]) > parseFloat(tableMAP_VC1[l][x])) { 
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableMAP_VC1[l][y]) < parseFloat(tableMAP_VC1[l][x])) { 
  						Kcolouring[x]++;
  					} else { 
  						Kcolouring[y]++; Kcolouring[x]++;
  					}
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strMAP_VC1 += " & " + orderingColourHighBest(Kcolouring[x],K) + tableMAP_VC1[l][x] + "}"; 
  		}  		
  	}
  	strMAP_VC1 += "\\\\ \\hline \n";
  }
  strMAP_VC1 += "\\end{tabular}}\n\\end{table}";
    
  
/*  var csvMAP_VC1 = csv_header;
  for (var i=0; i<nStates; i++) {
  	csvMAP_VC1 += i + "," + dict[i] + "," + tableMAP_VC1[i].join(",") + "\n";
  } 
*/      	
  var csvMAP_VC1 = csv_header_init;
  for (var l=0; l<nTimecuts; l++) {
  	csvMAP_VC1 += l + "," + "[" + timecuts[l].start + "," + timecuts[l].end + "]" + "," + tableMAP_VC1[l].join(",") + "\n";
  }  
  
  
// Property MAP_PG3
  for (var l=0; l<nTimecuts; l++){
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
	strMAP_PG3 += "[" + timecuts[l].start + "," + timecuts[l].end + "]";
  	
  	// colouring
  	for(var s=0; s<nStates*K-K+1; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				if (tableMAP_PG3[l][x] === "---" && tableMAP_PG3[l][y] === "---" ) {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableMAP_PG3[l][x] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y]++;
  				} else if (tableMAP_PG3[l][y] === "---") {
  					Kcolouring[x]++;
  					Kcolouring[y] = -1;
  				
  				} else {
  					if (parseFloat(tableMAP_PG3[l][y]) > parseFloat(tableMAP_PG3[l][x])) { 
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableMAP_PG3[l][y]) < parseFloat(tableMAP_PG3[l][x])) { 
	  					Kcolouring[x]++;
  					} else { 
  						Kcolouring[y]++; Kcolouring[x]++;
  					}	
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strMAP_PG3 += " & " + orderingColourHighBest(Kcolouring[x],K) + tableMAP_PG3[l][x] + "}"; 
  		}  		
  	}
//		// no colouring 	
//  	for (var i=0; i<nStates*K; i++) {
//  		strMAP_PG3 +=  " & " + tableMAP_PG3[l][i];
//  	}

  	strMAP_PG3 += "\\\\ \\hline \n";
  }
  strMAP_PG3 += "\\end{tabular}\n}\n\\end{table}";	  
   
  
  if (fileType.indexOf("latex") == 0) {
  	if (propType.indexOf("VP1") == 0) {
  		console.log(strMAP_VP1 + "\n\n");
  	}
  	if (propType.indexOf("SC1_1") == 0) {
  		console.log(strMAP_SC1_1 + "\n\n");
  	}
  	if (propType.indexOf("SC1_2") == 0) {
  		console.log(strMAP_SC1_2 + "\n\n");
  	}
  	if (propType.indexOf("VC1") == 0) {
    	console.log(strMAP_VC1 + "\n\n");
    }
  	if (propType.indexOf("PG3") == 0) {
    	console.log(strMAP_PG3 + "\n\n");
    }
  }
  else if (fileType.indexOf("csv") == 0) {
  	if (propType.indexOf("VP1") == 0) { console.log(csvMAP_VP1); }
  	if (propType.indexOf("SC1_1") == 0) { console.log(csvMAP_SC1_1); }
  	if (propType.indexOf("SC1_2") == 0) { console.log(csvMAP_SC1_2); }
  	if (propType.indexOf("VC1") == 0) { console.log(csvMAP_VC1); }
  	if (propType.indexOf("VPbtw") == 0) { console.log(csvMAP_VPbtw); }
  	if (propType.indexOf("SCbtw_1") == 0) { console.log(csvMAP_SCbtw_1); }
  	if (propType.indexOf("SCbtw_2") == 0) { console.log(csvMAP_SCbtw_2); } 	
  }
  
  //console.log(strMAP_VP1 + "\n\n");
  //console.log(strMAP_SC1_1 + "\n\n");
  //console.log(strMAP_SC1_2 + "\n\n");
  //console.log(strMAP_VC1 + "\n\n");
  
  //console.log(csvMAP_VP1);  
  //console.log(csvMAP_SC1_1);
  //console.log(csvMAP_SC1_2);
  //console.log(csvMAP_VC1);
  
  
 function indexStateLabelDict_VC2_1_2(pctlName) {
  	var prefix = "VC2_1_2_";
  	pctlName = pctlName.substring(prefix.length);
  	var stateLabel = pctlName.substring(0,pctlName.indexOf("_"));
  	for (var l=0; l<nStates; l++) {
  		if(dict[l].label.indexOf(stateLabel) == 0) {
  			return l;
  		}
  	}
  	return -1;
  }	

  
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
  
  /*
  function colourK2(n) {
  	switch(n) {
  		case 1: return "{\\bf "; // "\\textcolor{red}{";
  		case 0: return "{ "; // "\\textcolor{blue}{" ;
  	}
  }

  function colourK3(n) {
  	switch(n) {
  		case 2: return "{\\bf ";//"\\textcolor{red}{";
  		case 1: return "{\\em ";//"\\textcolor{blue}{" ;
  		case 0: return "{ ";//"\\textcolor{teal}{" ;
  	}
  }

  function colourK4(n) {
  	switch(n) {
  		case 3: return "{\\bf ";//"\\textcolor{red}{";
  		case 2: return "{\\bf\\em "//"\\textcolor{blue}{" ;
  		case 1: return "{\\em "//"\\textcolor{teal}{" ;
  		case 0: return "{ ";//"\\textcolor{black}{" ;
  	}
  }

  function colourK5(n) {
  	switch(n) {
  	    case 4: return "{\\sc ";//"\\textcolor{pink}{";
  		case 3: return "{\\bf ";//"\\textcolor{red}{";
  		case 2: return "{\\bf\\em "//"\\textcolor{blue}{" ;
  		case 1: return "{\\em "//"\\textcolor{teal}{" ;
  		case 0: return "{ ";//"\\textcolor{black}{" ;
  	}
  }
  */
  
});
