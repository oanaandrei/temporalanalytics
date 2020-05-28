// Oana Andrei 2018-2020


var fs = require('fs');

// \definecolor{fgreen}{rgb}{0.07, 0.53, 0.03}

if (process.argv.length<7) {
  console.log('Usage: node jsonResults2tables_AT2_MAP.js results_GPAM_AT2_K2.json K [latex|csv] [level1Dict|UseStop|level2Dict|level3Dict]) [VPVCSCinit|VP1|VC1|SC1_1|SC1_2|SteadyState]');
  // the option VPVCSCinit is only for the table
  // each of the options VP1, VC1, SC1_1, SC1_2 are only for csv tables
  // the option SteadyState is only for the latex table
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
  
  // test if the arguments are correct
  
  var MAX_STEPS_REWARD = 2000.00;
  
  // states at level 1 in the hierarchical menu
  var dict_6statesL1 = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	//{ id: "1", label: "ATMainView", shortLabel: "MainView" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TC" },
  	//{ id: "3", label: "ATSettingsView", shortLabel: "Settings" },  	
  	//{ id: "4", label: "ATInfoView", shortLabel: "InfoView"},
  	{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OveallUsageAllTime" }, 
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
  	//{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OveallUsageAllTime" }, 
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

  	
	// 11 states dictionary
  var dict_10statesL1 = [
	//{ id: "0", label: "UseStart", shortLabel: "UseStart" },
	//{ id: "1", label: "ATMainView", shortLabel: "MainView" },
	//{ id: "2", label: "TermsAndConditions", shortLabel: "TC" },
  	//{ id: "3", label: "ATSettingsView", shortLabel: "Settings" },  	
  	//{ id: "4", label: "ATInfoView", shortLabel: "InfoView"},
  	{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OveallUsageAllTime" }, 
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
  	{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OveallUsageAllTime" }, 
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
  	{ id: "5", label: "ATOverallUsageView_AllTime", shortLabel: "OveallUsageAllTime" }, 
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

  // Property MAP_VP1
  var tableHeader_MAP_VPVCSCinit = "\\begin{table}\n\\center\n\\caption{Properties \\VisitProbInit, \\VisitCountInit, \\StepCountInit\\ (counting steps in GPAM), and \\StepCountInit 2 (counting steps in a pattern) for GPAM(" + K + ") model of AppTracker2}\\label{table:MAP_AT2_VPVCSC_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{cc";

  // Property MAP_PG3_SteadyState
  var table_headerMAP_PG3 = "\\begin{table}\n\\center\n\\caption{Property \\LongRunPattern\\ for GPAM(" + K + ") model of AppTracker2}\\label{table:MAP_AT2_PG3_K" + K + "}\n{\\footnotesize\n\\begin{tabular}{c";
  
  var table_header = "";
  
  var terms1 = [];
  for (var s=0; s<nStates; s++) {
	  terms1.push("r");
	  for (var k=1; k<K; k++) {
  		terms1.push("r");
  	  }
  }
    
  if (terms1.length>0) {
    table_header += terms1.join("") + "}\n\\toprule\n {\\bf \\scriptsize Property} & {\\bf \\scriptsize Time} & ";
  }
  
  var terms3 = [];
  for (var l=0; l<nStates-1; l++) {
  	terms3.push("\\multicolumn{" + K + "}{c}{\\bf \\scriptsize \\" + dict[l].shortLabel + "}");
  }
  terms3.push("\\multicolumn{" + K + "}{c}{\\bf \\scriptsize \\" + dict[nStates-1].shortLabel + "}");
  if (terms3.length>0) {
    table_header += terms3.join(" & ") + "\\\\  \n";
  }

  var terms4 = [];
  var endCline = 0;
  for (l=3; l<=nStates*K; ) {
  	endCline = l + (K - 1);
  	terms4.push("\\cmidrule(lr){" + l + "-" + endCline + "}");
  	l = endCline + 1;
  }
  if (terms4.length>0) {
    table_header += terms4.join(" ") + " & {\\bf \\scriptsize interval} & ";
  }
  
  var terms2 = [];
  for (var l=0; l<nStates; l++) {
  	for (var k=0; k<K; k++) {
  		terms2.push("{\\bf \\scriptsize AP" + (k+1) + "}");
  	}
  }
  
  if (terms2.length>0) {
    table_header += terms2.join(" & ") + "\\\\ \n \\midrule \n";
  }
  
  var strMAP_VPVCSCinit = tableHeader_MAP_VPVCSCinit + table_header;
  var strMAP_PG3 = table_headerMAP_PG3 + table_header;

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
  
  // Fill in arrays with results for each property, each line corresponds to a time cut
  var index = 0;
  var indextimecut = -1;
  var patternId = 0;
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
  	 }
  	 }	

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
  strMAP_VPVCSCinit += "\\VisitProbInit";
  for (var l=0; l<nTimecuts; l++){
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
	strMAP_VPVCSCinit += " & [" + timecuts[l].start + "," + timecuts[l].end + "]";
  	
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
  			strMAP_VPVCSCinit += " & " + orderingColourHighBest(Kcolouring[x],K) + tableMAP_VP1[l][x] + "}"; 
  		}  		
  	}
//		// no colouring 	
//  	for (var i=0; i<nStates*K; i++) {
//  		strMAP_VP1 +=  " & " + tableMAP_VP1[l][i];
//  	}

  	strMAP_VPVCSCinit += "\\\\ \n";
  }
  strMAP_VPVCSCinit += "\\midrule\n ";	

/*  var csvMAP_VP1 = csv_header;
  for (var i=0; i<nStates; i++) {
  	csvMAP_VP1 += i + "," + dict[i] + "," + tableMAP_VP1[i].join(",") + "\n";
  }  
 */ 

 // Property MAP_VC1 
 strMAP_VPVCSCinit += "\\VisitCountInit" ;
  for (var l=0; l<nTimecuts; l++){
    for (var i=0; i<nStates*K; i++) 
    	Kcolouring[i] = 0;
	strMAP_VPVCSCinit += " & [" + timecuts[l].start + "," + timecuts[l].end + "]";

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
  			strMAP_VPVCSCinit += " & " + orderingColourHighBest(Kcolouring[x],K) + tableMAP_VC1[l][x] + "}"; 
  		}  		
  	}
  	strMAP_VPVCSCinit += "\\\\ \n";
  }
  strMAP_VPVCSCinit += "\\midrule \n";
    
  
/*  var csvMAP_VC1 = csv_header;
  for (var i=0; i<nStates; i++) {
  	csvMAP_VC1 += i + "," + dict[i] + "," + tableMAP_VC1[i].join(",") + "\n";
  } 
*/      	
  

// Property MAP_SC1_1
  strMAP_VPVCSCinit += "\\StepCountInit" ;
  for (var l=0; l<nTimecuts; l++){
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
	strMAP_VPVCSCinit += " & [" + timecuts[l].start + "," + timecuts[l].end + "]" ;
	
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
  			strMAP_VPVCSCinit += " & " + orderingColourLowBest(Kcolouring[x],K) + tableMAP_SC1_1[l][x] + "}"; 
  		}  		
  	}
  	strMAP_VPVCSCinit += "\\\\ \n";
  }
  strMAP_VPVCSCinit += "\\midrule\n";	

// Property MAP_SC1_2
  strMAP_VPVCSCinit += "\\StepCountInit 2" ;
  for (var l=0; l<nTimecuts; l++){
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
	strMAP_VPVCSCinit += " & [" + timecuts[l].start + "," + timecuts[l].end + "]" ;
	
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
  			strMAP_VPVCSCinit += " & " + orderingColourLowBest(Kcolouring[x],K) + tableMAP_SC1_2[l][x] + "}"; 
  		}  		
  	}
  	strMAP_VPVCSCinit += "\\\\ \n";
  }
  strMAP_VPVCSCinit += "\\bottomrule\n\\end{tabular}}\n\\end{table}";	



// Property MAP_PG3
  for (var l=0; l<nTimecuts; l++){
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
	strMAP_PG3 += "\\ [" + timecuts[l].start + "," + timecuts[l].end + "]";
  	
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
 
  	strMAP_PG3 += "\\\\ \n";
  }
  strMAP_PG3 += "\\bottomrule\n\\end{tabular}\n}\n\\end{table}";	  
   
  
  if (fileType.indexOf("latex") == 0) {
  	if (propType.indexOf("VPVCSCinit") == 0) {
  		console.log(strMAP_VPVCSCinit + "\n\n");
  	}
  	if (propType.indexOf("SteadyState") == 0) {
    	console.log(strMAP_PG3 + "\n\n");
    }
  }
  else if (fileType.indexOf("csv") == 0) {
  	if (propType.indexOf("VP1") == 0) { console.log(csvMAP_VP1); }
  	if (propType.indexOf("SC1_1") == 0) { console.log(csvMAP_SC1_1); }
  	if (propType.indexOf("SC1_2") == 0) { console.log(csvMAP_SC1_2); }
  	if (propType.indexOf("VC1") == 0) { console.log(csvMAP_VC1); }
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
 	// VC2_1_2_ATUsageBarChart_ATStatsView_AP1
  	var prefix = "VC2_1_2_";
  	var stateLabel = pctlName.substring(prefix.length,pctlName.lastIndexOf("_"));
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
