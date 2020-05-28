// Oana Andrei 2018-2020

var fs = require('fs');

// \definecolor{fgreen}{rgb}{0.07, 0.53, 0.03}

if (process.argv.length<7) {
  console.log('Usage: node jsonResults2tables_AT2.js results_Pattern_PAM_AT2_K2.json K [latex|csv] [6statesL1|UseStop|10statesL1|extra8] [VP1|SC1|VC1|VP2|SC2]');
  // for VP2 and SC2 input also the time interval
  console.log('Usage: node jsonResults2tables_AT2.js results_Pattern_PAM_AT2_K2.json K latex extra8 [VP2|SC2] start end');
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
  if (propType.indexOf("SC2") == 0 || propType.indexOf("VP2") == 0) {
  	if (process.argv.length<9) {
  		console.log('Usage: node jsonResults2tables_AT2.js results_Pattern_PAM_AT2_K2.json K latex extra8 [VP2|SC2] start end');
  		return;
  	}
	timecut_start = process.argv[7];
	timecut_end = process.argv[8];
  }
  
  var MAX_STEPS_REWARD = 2000.00;

  // states at level 1 in the hierarchical menu
  var dict_6statesL1 = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	//{ id: "1", label: "ATMainView", shortLabel: "MainView" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TC" },
  	//{ id: "3", label: "ATSettingsView", shortLabel: "Settings" },  	
  	//{ id: "4", label: "ATInfoView", shortLabel: "InfoView"},
  	{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OverallUsageAllTime" }, 
  	{ id: "6", label: "ATInDepthMenu", shortLabel: "InDepthMenu"},
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
  	
 
	// UseStop only dictionary
  var dict_UseStop = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	//{ id: "1", label: "ATMainView", shortLabel: "MainView" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TC" },
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

  	
	// 10 states dictionary
  var dict_10statesL1 = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	//{ id: "1", label: "ATMainView", shortLabel: "MainView" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TC" },
  	//{ id: "3", label: "ATSettingsView", shortLabel: "Settings" },  	
  	//{ id: "4", label: "ATInfoView", shortLabel: "InfoView"},
  	{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OverallUsageAllTime" }, 
  	{ id: "6", label: "ATInDepthMenu", shortLabel: "InDepthMenu"},
  	//{ id: "7", label: "UseStop", shortLabel: "UseStop" },
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
  
  var dict_extra8 = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	{ id: "1", label: "ATMainView", shortLabel: "MainView" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TC" },
  	//{ id: "3", label: "ATSettingsView", shortLabel: "Settings" },  	
  	//{ id: "4", label: "ATInfoView", shortLabel: "InfoView"},
  	{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OverallUsageAllTime" }, 
  	{ id: "6", label: "ATInDepthMenu", shortLabel: "InDepthMenu"},
  	{ id: "7", label: "UseStop", shortLabel: "UseStop" },
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

  var level1Dict = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	//{ id: "1", label: "ATMainView", shortLabel: "MainView" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TC" },
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
	//{ id: "1", label: "ATMainView", shortLabel: "MainView" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TC" },
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
	//{ id: "1", label: "ATMainView", shortLabel: "MainView" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TC" },
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
  	
  var dict;
  if (dictType.indexOf("6statesL1") == 0) {
  	dict = dict_6statesL1;
  }
  else if (dictType.indexOf("UseStop") == 0) {
  	dict = dict_UseStop
  }
  else if (dictType.indexOf("10statesL1") == 0) {
  	dict = dict_10statesL1;
  }
  else if (dictType.indexOf("extra8") == 0) {
  	dict = dict_extra8;
  }  
  else {
  	console.log("Incorrect choice of dictionary option!");
  	return;
  }
  var nStates = dict.length;

  var fullDict = [
	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	{ id: "1", label: "ATMainView", shortLabel: "MainView" },
	{ id: "2", label: "TermsAndConditions", shortLabel: "TC" },
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

  var timecuts = [
  	{ start: 0, end: 1, mindays: 1 },
  	{ start: 0, end: 7, mindays: 7 },
  	{ start: 0, end: 30, mindays: 30 },
  	{ start: 30, end: 60, mindays: 60 },
  	{ start: 60, end: 90, mindays: 90 },
  ];
  var nTimecuts = timecuts.length;

  // Create the header of the table for one property only

  // Property SAP_VP1
  var table_headerSAP_VP1 = "\\begin{table}\n\\center\n\\caption{Property \\VPinitAP\\ for K = " + K + "}\\label{table:AT2_SAP_VP1_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{c";

  // Property SAP_SC1
  var table_headerSAP_SC1 = "\\begin{table}\n\\center\n\\caption{Property \\SCinitAP\\ for K = " + K + "}\\label{table:AT2_SAP_SC1_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{c";

  // Property SAP_VC1
  var table_headerSAP_VC1 = "\\begin{table}\n\\center\n\\caption{Property \\VCinitAP\\ for K = " + K + "}\\label{table:AT2_SAP_VC1_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{c";
  
  var table_headerSAP_VP2 = "\\begin{table}\n\\center\n\\caption{Property \\VPsessionAP\\ for K = " + K + " and timecut [" + timecut_start + ", " + timecut_end + "]}\\label{table:AT2_SAP_VP2_K" + K + "_" + timecut_start + "_" + timecut_end + "}\n{\\footnotesize\n\\begin{tabular}{c";

  var table_headerSAP_SC2 = "\\begin{table}\n\\center\n\\caption{Property \\SCStateToStateAP\\ for K = " + K + " and timecut [" + timecut_start + ", " + timecut_end + "]}\\label{table:AT2_SAP_SC2_K" + K + "_" + timecut_start + "_" + timecut_end + "}\n{\\footnotesize\n\\begin{tabular}{c";
  
  var table_header = "";
  var table_header_extra = "";
  
  var terms1 = [];
  var terms1_extra = [];
  for (var s=0; s<nStates; s++) {
	  terms1.push("r");
	  for (var k=1; k<K; k++) {
  		terms1.push("r");
  	  }
  }
  if (terms1.length>0) {
    table_header += terms1.join("") + "}\n\\toprule\n{\\bf \\scriptsize Time} & ";
  }
    
  for (var s=0; s<nStates-1; s++) {
	  terms1_extra.push("r");
	  for (var k=1; k<K; k++) {
  		terms1_extra.push("r");
  	  }
  }
  if (terms1_extra.length>0) {
    table_header_extra += terms1_extra.join("") + "}\n\\toprule\n{\\bf \\scriptsize Target state}  & ";
  }
  
    
  var terms3 = [];
  var terms3_extra = [];
  for (var l=0; l<nStates-1; l++) {
  	terms3.push("\\multicolumn{" + K + "}{c}{\\bf \\scriptsize \\" + dict[l].shortLabel + "}");
  }
  terms3.push("\\multicolumn{" + K + "}{c}{\\bf \\scriptsize \\" + dict[nStates-1].shortLabel + "}");

  for (var l=0; l<nStates-2; l++) {
  	terms3_extra.push("\\multicolumn{" + K + "}{c}{\\bf \\scriptsize \\" + dict[l].shortLabel + "}");
  }
  if (nStates > 2) {
  	terms3_extra.push("\\multicolumn{" + K + "}{c}{\\bf \\scriptsize \\" + dict[nStates-2].shortLabel + "}");
  }
  
  if (terms3.length>0) {
    table_header += terms3.join(" & ") + "\\\\  \n";
  }
  if (terms3_extra.length>0) {
    table_header_extra += terms3_extra.join(" & ") + "\\\\  \n";
  }

  var terms4 = [];
  var terms4_extra = [];
  var endCline = 0;
  for (l=2; l<=nStates*K; ) {
  	endCline = l + (K - 1);
  	terms4.push("\\cmidrule(lr){" + l + "-" + endCline + "}");
  	l = endCline + 1;
  }
  for (l=2; l<=(nStates-1)*K; ) {
  	endCline = l + (K - 1);
  	terms4_extra.push("\\cmidrule(lr){" + l + "-" + endCline + "}");
  	l = endCline + 1;
  }
  
  if (terms4.length>0) {
    table_header += terms4.join(" ") + " {\\bf \\scriptsize interval} & ";
  }
  if (terms4_extra.length>0) {
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
    table_header += terms2.join(" & ") + "\\\\ \n \\midrule \n";
  }
  if (terms2_extra.length>0) {
    table_header_extra += terms2_extra.join(" & ") + "\\\\ \n \\midrule \n";
  }
  
  var strSAP_VP1 = table_headerSAP_VP1 + table_header;
  var strSAP_SC1 = table_headerSAP_SC1 + table_header;
  var strSAP_VC1 = table_headerSAP_VC1 + table_header;

  var strSAP_VP2 = table_headerSAP_VP2 + table_header_extra;
  var strSAP_SC2 = table_headerSAP_SC2 + table_header_extra;

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

  // Define array of results for property SAP_VP1
  var tableSAP_VP1 = new Array(nTimecuts);
  for (var i = 0; i < nTimecuts; i++) {
  	tableSAP_VP1[i] = new Array(K*nStates);
  }

  var tableSAP_VP2 = new Array(nStates);
  for (var i = 0; i < nStates; i++) {
  	tableSAP_VP2[i] = new Array(K*nStates);
  }

  // Define array of results for property SAP_SC1
  var tableSAP_SC1 = new Array(nTimecuts);
  for (var i = 0; i < nTimecuts; i++) {
  	tableSAP_SC1[i] = new Array(K*nStates);
  }

  var tableSAP_SC2 = new Array(nStates);
  for (var i = 0; i < nStates; i++) {
  	tableSAP_SC2[i] = new Array(K*nStates);
  }
  
  var tableSAP_VC1 = new Array(nTimecuts);
  for (var i = 0; i < nTimecuts; i++) {
  	tableSAP_VC1[i] = new Array(K*nStates);
  }
  
  // Fill in arrays with results for each property, each line corresponds to a time cut for VP1, VC1 and SC1. For VP2 and SC2 each line corresponds to a pair (j0,APk)
  var index = 0;
  var indextimecut = -1;
  var patternId = 0;
  var indexRow = 0;
  var indexCol = 0;
  data.forEach(function(entry) {
  	//if (entry.pctl.name.indexOf("VP1_1_2") == 0 && entry.result.j0.indexOf("0") == 0) {
  	if (entry.pctl.name.indexOf("VP1_1_2") == 0 && isInitialStatePAM(entry.result.j0)) {
  		indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		index = parseInt(indexStateDictionary(entry.result.j2));
  		patternId = parseInt(entry.k);
  		// Only if we found an entry for a state among the ones to be listed in the table
  		if (index != -1) {
	  		//console.log("j2= " + entry.result.j2 + " in pattern " + patternId + " at current dictIndex " + index);
  			index = index * K + patternId - 1;
  			//tableSAP_VP1[indextimecut][index] = (Number(entry.result.value)).toFixed(2);
  			if (entry.result.value == null){
  				tableSAP_VP1[indextimecut][index] = "---";;
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableSAP_VP1[indextimecut][index] = "---";
  			}
  			else {
  				//tableSAP_VP1[indextimecut][index] = parseFloat(entry.result.value);
	  			tableSAP_VP1[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  				//console.log("Table entry at " + indextimecut + ", " + index + " is " + tableSAP_VP1[indextimecut][index]);
  			}
  		}
  	}
  	// filter(state,P=?[!(y=j1) U<=N (y=j2)],y=j0)
  	// probability to reach j2 (row state) from j0 (column state)
  	if (entry.pctl.name.indexOf("VP1_3_4") == 0 && isUseStopStatePAM(entry.result.j1) && parseInt(entry.timecut.start) == timecut_start && parseInt(entry.timecut.end) == timecut_end) {
  		if(parseInt(indexStateDictionary(entry.result.j2)) != -1 && parseInt(indexStateDictionary(entry.result.j0)) != -1) {
  			patternId = parseInt(entry.k);
	  		indexRow = parseInt(indexStateDictionary(entry.result.j2));
  			indexCol = parseInt(indexStateDictionary(entry.result.j0)) * K + patternId - 1;
  			if (entry.result.value == null){
  				tableSAP_VP2[indexRow][indexCol] = "---";;
	  		}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableSAP_VP2[indexRow][indexCol] = "---";
	  		}	
  			else {
  				//tableSAP_VP2[indexRow][indexCol] = parseFloat(entry.result.value);
	  			tableSAP_VP2[indexRow][indexCol] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
	  			//console.log("Table entry at " + indextimecut + ", " + index + " is " + tableSAP_VP2[indexRow][indexCol]);
  			}
  		}
  	}
  	
  	if (entry.pctl.name.indexOf("SC1_1_2") == 0 && isInitialStatePAM(entry.result.j0)) {
  		indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		index = parseInt(indexStateDictionary(entry.result.j1));
  		patternId = parseInt(entry.k);
		if (index != -1) {
			index = index * K + patternId - 1;
		  	if (entry.result.value == null) {
  				tableSAP_SC1[indextimecut][index] = "---";//"$\\infty$";
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableSAP_SC1[indextimecut][index] = "---";
  			}
  			else {
  				//tableSAP_SC1[indextimecut][index] = parseFloat(entry.result.value);
  				tableSAP_SC1[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  			}
  		}
  	}

  	// filter(state,R{\"r_Steps\"}=?[F (y=j1)],y=j0)
  	// probability to reach j2 (row state) from j0 (column state)
  	if (entry.pctl.name.indexOf("SC1_1_2") == 0 && parseInt(entry.timecut.start) == timecut_start && parseInt(entry.timecut.end) == timecut_end) {
  		if(parseInt(indexStateDictionary(entry.result.j1)) != -1 && parseInt(indexStateDictionary(entry.result.j0)) != -1) {
  			patternId = parseInt(entry.k);
  			indexRow = parseInt(indexStateDictionary(entry.result.j1));
  			indexCol = parseInt(indexStateDictionary(entry.result.j0)) * K + patternId - 1;
  			if (entry.result.value == null){
  				tableSAP_SC2[indexRow][indexCol] = "---";;
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableSAP_SC2[indexRow][indexCol] = "---";
  			}
  			else {
  				//tableSAP_SC2[indexRow][indexCol] = parseFloat(entry.result.value);
	  			tableSAP_SC2[indexRow][indexCol] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  				//console.log("Table entry at " + indextimecut + ", " + index + " is " + tableSAP_SC2[indexRow][indexCol]);
  			}
  		}
  	}

  	  	
  	//if (entry.pctl.name.indexOf("VC1_1_2") == 0 && entry.result.j0.indexOf("0") == 0) {
  	if (entry.pctl.name.indexOf("VC1_1_2") == 0 && isInitialStatePAM(entry.result.j0)) {
  		indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		index = parseInt(indexStateLabelDict_VC1_1_2(entry.pctl.name));
  		patternId = parseInt(entry.k);
  		if (index != -1) {
  			//console.log("State label " + entry.pctl.name.substring(8) + " in pattern " + patternId + " at current dictIndex " + index);
  			index = index * K + patternId - 1;
  			//console.log("Val: " + entry.result.value);
  			if (entry.result.value == null) {
  				tableSAP_VC1[indextimecut][index] = "---";
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableSAP_VC1[indextimecut][index] = "---";
  			}
  			else {
	  			//tableSAP_VC1[indextimecut][index] = parseFloat(entry.result.value);
  				tableSAP_VC1[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  				//console.log("Table entry at " + indextimecut + ", " + index + " is " + tableSAP_VC1[indextimecut][index]);
  			}
  		}
  	 }
  	
  });
  //console.log(JSON.stringify(tableSAP_VC1));

  var Kcolouring = new Array(K);

// Printing results into a latex table

// Property SAP_VP1
  for (var l=0; l<nTimecuts; l++){
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
	strSAP_VP1 += "\\ [" + timecuts[l].start + "," + timecuts[l].end + "]";
  	
  	// colouring
  	for(var s=0; s<nStates*K-K+1; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				if (tableSAP_VP1[l][x] === "---" && tableSAP_VP1[l][y] === "---" ) {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableSAP_VP1[l][x] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y]++;
  				} else if (tableSAP_VP1[l][y] === "---") {
  					Kcolouring[x]++;
  					Kcolouring[y] = -1;
  				
  				} else {
  					if (parseFloat(tableSAP_VP1[l][y]) > parseFloat(tableSAP_VP1[l][x])) { 
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableSAP_VP1[l][y]) < parseFloat(tableSAP_VP1[l][x])) { 
	  					Kcolouring[x]++;
  					} else { 
  						Kcolouring[y]++; Kcolouring[x]++;
  					}	
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strSAP_VP1 += " & " + orderingColourHighBest(Kcolouring[x],K) + tableSAP_VP1[l][x] + "}"; 
  		}  		
  	}
//		// no colouring 	
//  	for (var i=0; i<nStates*K; i++) {
//  		strSAP_VP1 +=  " & " + tableSAP_VP1[l][i];
//  	}

  	strSAP_VP1 += "\\\\ \n";
  }
  strSAP_VP1 += "\\bottomrule \\\\ \\end{tabular}\n}\n\\end{table}";	

/*  var csvSAP_VP1 = csv_header;
  for (var i=0; i<nStates; i++) {
  	csvSAP_VP1 += i + "," + dict[i] + "," + tableSAP_VP1[i].join(",") + "\n";
  }  
 */ 

// Property SAP_VP2
  // start from l=1 because we're not intersted in probability to reach Main
  for (var l=1; l<nStates; l++){
	strSAP_VP2 += "{\\bf \\scriptsize \\" + dict[l].shortLabel + "}";
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
  	
  	// colouring
	// UseStop position is hard coded: the last -K from the upper bound is due to un-needed UseStop on the last column
  	for(var s=0; s<nStates*K-K+1-K; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				if (tableSAP_VP2[l][x] === "---" && tableSAP_VP2[l][y] === "---" ) {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableSAP_VP2[l][x] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y]++;
  				} else if (tableSAP_VP2[l][y] === "---") {
  					Kcolouring[x]++;
  					Kcolouring[y] = -1;
  				
  				} else {
  					if (parseFloat(tableSAP_VP2[l][y]) > parseFloat(tableSAP_VP2[l][x])) { 
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableSAP_VP2[l][y]) < parseFloat(tableSAP_VP2[l][x])) { 
	  					Kcolouring[x]++;
  					} else { 
  						Kcolouring[y]++; Kcolouring[x]++;
  					}	
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strSAP_VP2 += " & " + orderingColourHighBest(Kcolouring[x],K) + tableSAP_VP2[l][x] + "}"; 
  		}  		
  	}
  	
	// no colouring 	
  	//for (var i=0; i<nStates; i++) {
  	//	strSAP_VP2 +=  " & " + tableSAP_VP2[l][i];
  	//}

  	strSAP_VP2 += "\\\\ \n";
  }
  strSAP_VP2 += "\\bottomrule \\\\ \\end{tabular}\n}\n\\end{table}";	


// Property SAP_SC1
  for (var l=0; l<nTimecuts; l++){
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
	strSAP_SC1 += "\\ [" + timecuts[l].start + "," + timecuts[l].end + "]" ;
	
	// colouring
  	for(var s=0; s<nStates*K-K+1; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				if (tableSAP_SC1[l][x] === "---" && tableSAP_SC1[l][y] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableSAP_SC1[l][x] === "---") {
  					Kcolouring[x] = -1;
  					//Kcolouring[y]++;
  				} else if (tableSAP_SC1[l][y] === "---") {
  					//Kcolouring[x]++;
  					Kcolouring[y] = -1;
  				} else {
  					if (parseFloat(tableSAP_SC1[l][y]) > parseFloat(tableSAP_SC1[l][x])) { 
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableSAP_SC1[l][y]) < parseFloat(tableSAP_SC1[l][x])) { 
	  					Kcolouring[x]++;
  					} else { 
  						Kcolouring[y]++; Kcolouring[x]++;
  					}	
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strSAP_SC1 += " & " + orderingColourLowBest(Kcolouring[x],K) + tableSAP_SC1[l][x] + "}"; 
  		}  		
  	}
  	strSAP_SC1 += "\\\\ \n";
  }
  strSAP_SC1 += "\\bottomrule \\\\ \\end{tabular}}\n\n\\end{table}";	


// Property SAP_SC2
  // start from l=1 because we're not interested in steps to reach Main
  for (var l=1; l<nStates; l++){
	strSAP_SC2 += "{\\bf \\scriptsize \\" + dict[l].shortLabel + "}";
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
			
	// colouring
	// UseStop position is hard coded: the last -K from the upper bound is due to un-needed UseStop on the last column
  	for(var s=0; s<nStates*K-K+1-K; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				if (tableSAP_SC2[l][x] === "---" && tableSAP_SC2[l][y] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableSAP_SC2[l][x] === "---") {
  					Kcolouring[x] = -1;
  					//Kcolouring[y]++;
  				} else if (tableSAP_SC2[l][y] === "---") {
  					//Kcolouring[x]++;
  					Kcolouring[y] = -1;
  				} else {
  					if (parseFloat(tableSAP_SC2[l][y]) > parseFloat(tableSAP_SC2[l][x])) { 
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableSAP_SC2[l][y]) < parseFloat(tableSAP_SC2[l][x])) { 
	  					Kcolouring[x]++;
  					} else { 
  						Kcolouring[y]++; Kcolouring[x]++;
  					}	
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strSAP_SC2 += " & " + orderingColourLowBest(Kcolouring[x],K) + tableSAP_SC2[l][x] + "}"; 
  		}  		
  	}
  	strSAP_SC2 += "\\\\ \n";
  }
  strSAP_SC2 += "\\bottomrule \\\\ \\end{tabular}}\n\n\\end{table}";	



 // Property SAP_VC1 
  for (var l=0; l<nTimecuts; l++){
    for (var i=0; i<nStates*K; i++) 
    	Kcolouring[i] = 0;
	strSAP_VC1 += "\\ [" + timecuts[l].start + "," + timecuts[l].end + "]";

  	// colouring
  	// "---" does not change colour from default (worse result)
  	for(var s=0; s<nStates*K-K+1; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				//console.log("Compare " + tableSAP_VC1[l][x] + " and " + tableSAP_VC1[l][y]);
  				//console.log("Compare parsed " + parseFloat(tableSAP_VC1[l][x]) + " and " + parseFloat(tableSAP_VC1[l][y])); 
  				if (tableSAP_VC1[l][x] === "---" && tableSAP_VC1[l][y] === "---" ) {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableSAP_VC1[l][x] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y]++;
  				} else if (tableSAP_VC1[l][y] === "---") {
  					Kcolouring[x]++;
  					Kcolouring[y] = -1;
  				} else {
  					if (parseFloat(tableSAP_VC1[l][y]) > parseFloat(tableSAP_VC1[l][x])) { 
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableSAP_VC1[l][y]) < parseFloat(tableSAP_VC1[l][x])) { 
  						Kcolouring[x]++;
  					} else { 
  						Kcolouring[y]++; Kcolouring[x]++;
  					}
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strSAP_VC1 += " & " + orderingColourHighBest(Kcolouring[x],K) + tableSAP_VC1[l][x] + "}"; 
  		}  		
  	}
  	strSAP_VC1 += "\\\\ \n";
  }
  strSAP_VC1 += "\\bottomrule \\\\ \\end{tabular}}\n\\end{table}";
    
  
/*  var csvSAP_VC1 = csv_header;
  for (var i=0; i<nStates; i++) {
  	csvSAP_VC1 += i + "," + dict[i] + "," + tableSAP_VC1[i].join(",") + "\n";
  } 
*/      	
  
  if (fileType.indexOf("latex") == 0) {
  	if (propType.indexOf("VP1") == 0) 
  		console.log(strSAP_VP1 + "\n\n");
  	if (propType.indexOf("SC1") == 0) 
  		console.log(strSAP_SC1 + "\n\n");
  	if (propType.indexOf("VC1") == 0) 
    	console.log(strSAP_VC1 + "\n\n");
  	if (propType.indexOf("VP2") == 0) 
    	console.log(strSAP_VP2 + "\n\n");
  	if (propType.indexOf("SC2") == 0) 
    	console.log(strSAP_SC2 + "\n\n");    	    	
  }
  else if (fileType.indexOf("csv") == 0) {
  	if (propType.indexOf("VP1") == 0) console.log(csvSAP_VP1);
  	if (propType.indexOf("SC1") == 0) console.log(csvSAP_SC1);
  	if (propType.indexOf("VC1") == 0) console.log(csvSAP_VC1);
  }
  
  //console.log(strSAP_VP1 + "\n\n");
  //console.log(strSAP_SC1 + "\n\n");
  //console.log(strSAP_VC1 + "\n\n");
  
  //console.log(csvSAP_VP1);  
  //console.log(csvSAP_SC1);
  //console.log(csvSAP_VC1);
  
  
 function indexStateLabelDict_VC1_1_2(pctlName) {
  	var prefix = "VC1_1_2_";
  	var stateLabel = pctlName.substring(prefix.length);
  	for (var l=0; l<nStates; l++) {
  		if(dict[l].label.indexOf(stateLabel) == 0) {
  			return l;
  		}
  	}
  	return -1;
  }	

  function isUseStopStatePAM(stateIndex_j){
  	//console.log(stateIndex_j);
  	if (fullDict[parseInt(stateIndex_j)].label.indexOf("UseStop") == 0) {
		return true;
	}
	return false;
  }
  
  function isInitialStatePAM(stateIndex_j){
  	//console.log(stateIndex_j);
  	if (fullDict[parseInt(stateIndex_j)].label.indexOf("UseStart") == 0) {
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
  	console.log("\nTime interval undefined: " + start + " " + end);
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
