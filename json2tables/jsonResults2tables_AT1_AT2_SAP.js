// Oana Andrei 2016-2020

// VisitProbInit, StepCountInit, VisitCountInit for activity patterns in GPAM models for a given set of states
// VisitProbInit(UseStop), SessionLength, SessionCount in GPAMs
// VisitProbBtw and StepCountBtw in GPAMs

var fs = require('fs');

// \definecolor{fgreen}{rgb}{0.07, 0.53, 0.03}

if (process.argv.length<7) {
  console.log('Usage: node jsonResults2tables_AT1_AT2_SAP.js results_Pattern_[PAM|GPAM]_K[valueK].json [valueK] [latex|csv] [AT1_4statesL1|AT1_UseStop|AT1_8statesL1|AT1_twolevels|AT1_4statesL2|AT1_threelevels|AT1_alt|AT1_full|AT2_6statesL1|AT2_UseStop|AT2_10statesL1|AT2_extra8] [VisitProbInit|StepCountInit|VisitCountInit|VisitProbBtw|StepCountBtw|Session]');
  // for VisitProbBtw and StepCountBtw input also the time interval; only works with the dictionary options [twolevels|threelevels]
  console.log('Usage: node jsonResults2tables_AT1_AT2_SAP.js results_Pattern_[PAM|GPAM]_K[valueK].json [valueK] [latex] [AT1_twolevels|AT1_threelevels|AT2_extra8] [VisitProbBtw|StepCountBtw] [startInterval] [endInterval]');
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
  if (propType.indexOf("StepCountBtw") == 0 || propType.indexOf("VisitProbBtw") == 0) {
  	if (process.argv.length<9) {
  		console.log('Usage: node jsonResults2tables_AT1_AT2_SAP.js results_Pattern_[PAM|GPAM]_K[valueK].json [valueK] [latex] [AT1_twolevels] [VisitProbBtw|StepCountBtw] [startInterval] [endInterval]');
  		return;
  	}
	timecut_start = process.argv[7];
	timecut_end = process.argv[8];
  }

  var MAX_STEPS_REWARD = 2000.00;

  var dict;

  var fullDictAT1 = [
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


  // default dictionary OverallUsage, StackedBars, PeriodSelectors, Stats - states at level 1 in the hierarchical menu
  var dictAT1_4statesL1 = [
  //	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
  //	{ id: "1", label: "TermsAndConditions", shortLabel: "TC" },
  //	{ id: "2", label: "ATMainView", shortLabel: "Main" },
  	{ id: "3", label: "ATOverallUsageView", shortLabel: "OverallUsage" },
  	{ id: "4", label: "ATStackedBarsView", shortLabel: "StackedBars" },
  	{ id: "5", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" },
  //  	{ id: "6", label: "ATAppsInPeriodView", shortLabel: "AppsInPeriod" },
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
  var dictAT1_UseStop = [
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
  var dictAT1_8statesL1 = [
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

	// 4 states dictionary, level 2+
  var dictAT1_4statesL2 = [
  //	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
  //	{ id: "1", label: "TermsAndConditions", shortLabel: "TC" },
  //	{ id: "2", label: "ATMainView", shortLabel: "Main" },
  //	{ id: "3", label: "ATOverallUsageView", shortLabel: "OverallUsage" },
  //	{ id: "4", label: "ATStackedBarsView", shortLabel: "StackedBars" },
  //	{ id: "5", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" },
  	{ id: "6", label: "ATAppsInPeriodView", shortLabel: "AppsInPeriod" },
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

  var dictAT1_twolevels = [
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
  var dictAT1_threelevels = [
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


  // Dictionary with less "interesting" states
  var dictAT1_alt = [
  //	{ id: "0", label: "UseStart", shortLabel: "UseStart" },
  	{ id: "1", label: "TermsAndConditions", shortLabel: "TC" },
  	{ id: "2", label: "ATMainView", shortLabel: "Main" },
  //	{ id: "3", label: "ATOverallUsageView", shortLabel: "OverallUsage" },
  //	{ id: "4", label: "ATStackedBarsView", shortLabel: "StackedBars" },
  //	{ id: "5", label: "ATPeriodSelectorView", shortLabel: "PeriodSelector" },
  //	{ id: "6", label: "ATAppsInPeriodView", shortLabel: "AppsInPeriod" },
    	{ id: "7", label: "ATSettingsView", shortLabel: "Settings" },
//	{ id: "9", label: "ATStatsView", shortLabel: "Stats" },
  //	{ id: "8", label: "UseStop", shortLabel: "UseStop" },
 // 	{ id: "10", label: "ATUsageBarChartATOverallUsageView", shortLabel: "UBCOverallUsage" },
    	{ id: "11", label: "ATFeedbackView", shortLabel: "Feedback" },
  //	{ id: "12", label: "ATUsageBarChartATStatsView", shortLabel: "UBCStats" },
  	{ id: "13", label: "ATInfoView", shortLabel: "Info" },
  //	{ id: "14", label: "ATUsageBarChartATAppsInPeriodView", shortLabel: "UBCAppsInPeriod" },
  	{ id: "15", label: "ATTaskView", shortLabel: "Task" }
  	];


    // states at level 1 in the hierarchical menu
    var dictAT2_6statesL1 = [
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
    var dictAT2_UseStop = [
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
    var dictAT2_10statesL1 = [
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

    var dictAT2_extra8 = [
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

    var level1DictAT2 = [
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

    var level2DictAT2 = [
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

    var level3DictAT2 = [
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

    var fullDictAT2 = [
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



  if (dictType.indexOf("AT1_4statesL1") == 0) {
  	dict = dictAT1_4statesL1;
  }
  else if (dictType.indexOf("AT1_UseStop") == 0) {
  	dict = dictAT1_UseStop;
  }
  else if (dictType.indexOf("AT1_8statesL1") == 0) {
  	dict = dictAT1_8statesL1;
  }
  else if (dictType.indexOf("AT1_4statesL2") == 0) {
  	dict = dictAT1_4statesL2;
  }
  else if (dictType.indexOf("AT1_twolevels") == 0) {
  	dict = dictAT1_twolevels;
  }
  else if (dictType.indexOf("AT1_threelevels") == 0) {
  	dict = dictAT1_threelevels;
  }
  else if (dictType.indexOf("AT1_alt") == 0) {
  	dict = dictAT1_alt;
  }
  else if (dictType.indexOf("AT1_full") == 0) {
  	dict = fullDictAT1;
  }
  else if (dictType.indexOf("AT2_6statesL1") == 0) {
  	dict = dictAT2_6statesL1;
  }
  else if (dictType.indexOf("AT2_UseStop") == 0) {
  	dict = dictAT2_UseStop
  }
  else if (dictType.indexOf("AT2_10statesL1") == 0) {
  	dict = dictAT2_10statesL1;
  }
  else if (dictType.indexOf("AT2_extra8") == 0) {
  	dict = dictAT2_extra8;
  }
  else {
  	console.log("Incorrect choice of dictionary option!");
  	return;
  }
  var nStates = dict.length;



  var timecuts = [
  	{ start: 0, end: 1, mindays: 1 },
  	{ start: 0, end: 7, mindays: 7 },
  	{ start: 0, end: 30, mindays: 30 },
  	{ start: 30, end: 60, mindays: 60 },
  	{ start: 60, end: 90, mindays: 90 },
  ];
  var nTimecuts = timecuts.length;


  // Generic table header
  var table_header = "";
  var table_header_extra = "";
  var table_header_session = "";

  var terms1 = [];
  var terms1_sess = [];
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

  for (var s=0; s<3; s++) {
	  terms1_sess.push("|r");
	  for (var k=1; k<K; k++) {
  		terms1_sess.push("r");
  	  }
  }
  if (terms1_sess.length>0) {
    table_header_session += terms1_sess.join("|") + "|}\n\\hline\n{\\bf \\scriptsize Time} & ";
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
  var terms3_sess = [];
  var terms3_extra = [];
  for (var l=0; l<nStates-1; l++) {
  	terms3.push("\\multicolumn{" + K + "}{@{}c@{}||}{\\bf \\scriptsize \\" + dict[l].shortLabel + "}");
  }
  terms3.push("\\multicolumn{" + K + "}{@{}c@{}|}{\\bf \\scriptsize \\" + dict[nStates-1].shortLabel + "}");

  terms3_sess.push("\\multicolumn{" + K + "}{@{}c@{}||}{\\bf \\scriptsize \\" + "VisitProbInit(UseStop)" + "}");
  terms3_sess.push("\\multicolumn{" + K + "}{@{}c@{}||}{\\bf \\scriptsize \\" + "SessionLength" + "}");
  terms3_sess.push("\\multicolumn{" + K + "}{@{}c@{}||}{\\bf \\scriptsize \\" + "SessionCount" + "}");

  if (nStates > 2) {
	  for (var l=0; l<nStates-2; l++) {
  		terms3_extra.push("\\multicolumn{" + K + "}{@{}c@{}||}{\\bf \\scriptsize \\" + dict[l].shortLabel + "}");
  	  }
  	  terms3_extra.push("\\multicolumn{" + K + "}{@{}c@{}|}{\\bf \\scriptsize \\" + dict[nStates-2].shortLabel + "}");
  }
  else {
  	 terms3_extra.push("\\multicolumn{" + K + "}{@{}c@{}|}{\\bf \\scriptsize \\" + dict[0].shortLabel + "}");
  }


  if (terms3.length>0) {
    table_header += terms3.join(" & ") + "\\\\  \n";
  }
  if (terms3_sess.length>0) {
    table_header_session += terms3_sess.join(" & ") + "\\\\  \n";
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
    table_header_session += terms4.join(" ") + " {\\bf \\scriptsize interval} & ";
  }
  if (terms4_extra.length>0) {
    //table_header_extra += terms4.join(" ") + " {\\bf \\scriptsize interval} & ";
    table_header_extra += terms4_extra.join(" ") + " & ";
  }

  var terms2 = [];
  for (var l=0; l<nStates; l++) {
  	for (var k=0; k<K; k++) {
  		terms2.push("{\\bf \\scriptsize AP" + (k+1) + "}");
  	}
  }
  var terms2_sess = [];
  for (var l=0; l < 3; l++) {
  	for (var k=0; k < K; k++) {
  		terms2_sess.push("{\\bf \\scriptsize AP" + (k+1) + "}");
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
  if (terms2_sess.length>0) {
    table_header_session += terms2_sess.join(" & ") + "\\\\ \n \\hline\\hline \n";
  }
  if (terms2_extra.length>0) {
    table_header_extra += terms2_extra.join(" & ") + "\\\\ \n \\hline\\hline \n";
  }

  // end generic table header


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

  // to review the header and first column
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


  // end output in .csv format


  // Fill in arrays with results for each property, each line corresponds to a time cut for VisitProbInit, VisitCountInit, and StepCountInit. For VisitProbBtw and StepCountBtw each line corresponds to a pair (j0,APk)
  var index = 0;
  var indextimecut = -1;
  var patternId = 0;
  var indexRow = 0;
  var indexCol = 0;
  var Kcolouring = new Array(K);

  //////////////////////////////////////////////////////////////////
  // Session characteristics table: VisitProbInit(UseStop), SessionLength, SessionCount
  if (propType.indexOf("Session") == 0) {
    //dict = dictAT1_UseStop;
    var strSAP_Session = "\\begin{table}\n\\center\n\\caption{Characteristics of sessions: SAP properties VisitProbInit for UseStop, SessionLength, and SessionCount in GPAM(" + K + ").}\\label{table:SAP_VisitProbInit_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{|@{}c@{}|";
    strSAP_Session += table_header_session;

    var tableSAP_Session = new Array(nTimecuts);
    for (var i=0; i < nTimecuts; i++) {
      tableSAP_Session[i] = new Array(3*K);
    }
    data.forEach(function(entry) {
      if (entry.pctl.name.indexOf("VisitProbInit") == 0 && isUseStopState(entry.result.j)) {
        indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
        index = 0;
        patternId = parseInt(entry.k);
        // Only if we found an entry for a state among the ones to be listed in the table: this is successful if the dictionary selected based on the input option contains the UseStop state
        //console.log("j= " + entry.result.j + " in pattern " + patternId + " at current dictIndex " + index);
          index = index * K + patternId - 1;
          if (entry.result.value == null){
            tableSAP_Session[indextimecut][index] = "---";;
          }
          else if (entry.result.value === "ErrorFilterInit") {
            tableSAP_Session[indextimecut][index] = "---";
          }
          else {
            tableSAP_Session[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
            //console.log("Table entry at " + indextimecut + ", " + index + " is " + tableSAP_Session[indextimecut][index]);
          }
        }

        if (entry.pctl.name.indexOf("SessionLength") == 0) {
          indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
          index = 0;
          // to do
          index = K + index*K + patternId - 1;
          if (entry.result.value == null) {
            tableSAP_Session[indextimecut][index] = "---";//"$\\infty$";
          }
          else if (entry.result.value === "ErrorFilterInit") {
            tableSAP_Session[indextimecut][index] = "---";
          }
          else {
            tableSAP_Session[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
            //console.log("Table entry at " + indextimecut + ", " + index + " is " + tableSAP_Session[indextimecut][index]);
          }
        }
        if (entry.pctl.name.indexOf("SessionCount") == 0) {
          indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
          index = 0;
          // to do
          index = 2*K + index*K + patternId - 1;
          if (entry.result.value == null) {
  					tableSAP_Session[indextimecut][index] = "---";
  				}
	  			else if (entry.result.value === "ErrorFilterInit") {
  					tableSAP_Session[indextimecut][index] = "---";
  				}
	  			else {
  					tableSAP_Session[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
            //console.log("Table entry at " + indextimecut + ", " + index + " is " + tableSAP_Session[indextimecut][index]);
  				}
        }
    });
    //console.log("Session table: " + tableSAP_Session);

    if (fileType.indexOf("latex") == 0) {
      // Printing results into a latex table
      //strSAP_Session +=
    	for (var l=0; l<nTimecuts; l++){
    		strSAP_Session += "[" + timecuts[l].start + "," + timecuts[l].end + "]";

      		// colouring
    	  	for(var i=0; i < 3*K; i++){
      				strSAP_Session += " & " + tableSAP_Session[l][i];
      		}

    	  	strSAP_Session += "\\\\ \\hline \n";
      	}
      	strSAP_Session += "\\end{tabular}\n}\n\\end{table}";

        console.log(strSAP_Session + "\n\n");

    } else if (fileType.indexOf("csv") == 0) {
      //Printing results into csv format
      var csv_header_session = "Id,TimeIntvl,";
      var terms_csv_session = [];
      for (k=0; k<K; k++) {
        terms_csv_session.push("VisitProbInit(UseStop)" + "/AP" + (k+1));
      }
      for (k=0; k<K; k++) {
        terms_csv_session.push("SessionLength" + "/AP" + (k+1));
      }
      for (k=0; k<K; k++) {
        terms_csv_session.push("SessionCount" + "/AP" + (k+1));
      }
      if (terms_csv_session.length>0) {
        csv_header_session += terms_csv_session.join(",") + "\n";
      }
      var csvSAP_Session = csv_header_session;
    	for (var l=0; l<nTimecuts; l++) {
    		csvSAP_Session += l + "," + "[" + timecuts[l].start + "," + timecuts[l].end + "]" + "," + tableSAP_Session[l].join(",") + "\n";
    	}
      console.log(csvSAP_Session);
    }
    else {
      console.log("File type can only take the values latex or csv, not " + fileType + ".");
    }
  }

  //////////////////////////////////////////////////////////////////
  // VisitProbInit results
  if (propType.indexOf("VisitProbInit") == 0)  {
    	  // Table header for the property SAP_VisitProbInit
    	  var table_headerSAP_VisitProbInit = "\\begin{table}\n\\center\n\\caption{SAP property VisitProbInit for K = " + K + "}\\label{table:SAP_VisitProbInit_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{|@{}c@{}|";
    	  var strSAP_VisitProbInit = table_headerSAP_VisitProbInit + table_header;
      	  // Define array for results of model checking the property SAP_VisitProbInit
    	  var tableSAP_VisitProbInit = new Array(nTimecuts);
    	  for (var i = 0; i < nTimecuts; i++) {
    	  	tableSAP_VisitProbInit[i] = new Array(K*nStates);
      	  }

      	data.forEach(function(entry) {
    		// VisitProbInit
    	  	if (entry.pctl.name.indexOf("VisitProbInit") == 0) {
      			indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
      			index = parseInt(indexStateDictionary(entry.result.j));
    	  		patternId = parseInt(entry.k);
      			// Only if we found an entry for a state among the ones to be listed in the table
      			if (index != -1) {
    	  			//console.log("j= " + entry.result.j + " in pattern " + patternId + " at current dictIndex " + index);
    	  			index = index * K + patternId - 1;
      				//tableSAP_VisitProbInit[indextimecut][index] = (Number(entry.result.value)).toFixed(2);
      				if (entry.result.value == null){
    	  				tableSAP_VisitProbInit[indextimecut][index] = "---";;
      				}
      				else if (entry.result.value === "ErrorFilterInit") {
      					tableSAP_VisitProbInit[indextimecut][index] = "---";
      				}
    	  			else {
      					//tableSAP_VisitProbInit[indextimecut][index] = parseFloat(entry.result.value);
    	  				tableSAP_VisitProbInit[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
      					//console.log("Table entry at " + indextimecut + ", " + index + " is " + tableSAP_VisitProbInit[indextimecut][index]);
      				}
      			}
      		}
      	});

  	// Printing results into a latex table
  	for (var l=0; l<nTimecuts; l++){
  		for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
  		strSAP_VisitProbInit += "[" + timecuts[l].start + "," + timecuts[l].end + "]";

    		// colouring
  	  	for(var s=0; s<nStates*K-K+1; s=s+K){
    			for (var x=s; x<s+K-1; x++) {
    				for (var y=x+1; y<s+K; y++) {
    					if (tableSAP_VisitProbInit[l][x] === "---" && tableSAP_VisitProbInit[l][y] === "---" ) {
    						Kcolouring[x] = -1;
    						Kcolouring[y] = -1;
  	  				} else if (tableSAP_VisitProbInit[l][x] === "---") {
    						Kcolouring[x] = -1;
    						Kcolouring[y]++;
    					} else if (tableSAP_VisitProbInit[l][y] === "---") {
    						Kcolouring[x]++;
    						Kcolouring[y] = -1;
  	  				} else {
    						if (parseFloat(tableSAP_VisitProbInit[l][y]) > parseFloat(tableSAP_VisitProbInit[l][x])) {
    							Kcolouring[y]++;
  	  					} else if (parseFloat(tableSAP_VisitProbInit[l][y]) < parseFloat(tableSAP_VisitProbInit[l][x])) {
  	  						Kcolouring[x]++;
    						} else {
    							Kcolouring[y]++; Kcolouring[x]++;
  	  					}
    					}
    				}
    			}
  	  		for (var x=s; x<s+K; x++) {
    				strSAP_VisitProbInit += " & " + orderingColourHighBest(Kcolouring[x],K) + tableSAP_VisitProbInit[l][x] + "}";
    			}
    		}

  	  	strSAP_VisitProbInit += "\\\\ \\hline \n";
    	}
    	strSAP_VisitProbInit += "\\end{tabular}\n}\n\\end{table}";

    	var csvSAP_VisitProbInit = csv_header_init;
    	for (var l=0; l<nTimecuts; l++) {
    		csvSAP_VisitProbInit += l + "," + "[" + timecuts[l].start + "," + timecuts[l].end + "]" + "," + tableSAP_VisitProbInit[l].join(",") + "\n";
    	}

      if (fileType.indexOf("latex") == 0) {
      		console.log(strSAP_VisitProbInit + "\n\n");
      } else if (fileType.indexOf("csv") == 0) {
      	console.log(csvSAP_VisitProbInit);
      }
      else {
        console.log("File type can only take the values latex or csv, not " + fileType + ".");
      }

  }
//////////////////////////////////////////////////////////////////

	// VisitProbBtw within the same session: VisitProb of state j2 from state j1 without visiting UseStop
  if (propType.indexOf("VisitProbBtw") == 0)  {
	  // Table header for the property VisitProbBtw
	  var table_headerSAP_VisitProbBtw = "\\begin{table}\n\\center\n\\caption{SAP property VisitProb within the same session for K = " + K + " and time interval [" + timecut_start + ", " + timecut_end + "]}\\label{table:SAP_VisitProbBtw_K" + K + "_" + timecut_start + "_" + timecut_end + "}\n{\\footnotesize\n\\begin{tabular}{|c|";
	  var strSAP_VisitProbBtw = table_headerSAP_VisitProbBtw + table_header_extra;
	  var tableSAP_VisitProbBtw = new Array(nStates);
	  for (var i = 0; i < nStates; i++) {
	  	tableSAP_VisitProbBtw[i] = new Array(K*nStates);
	  }


	data.forEach(function(entry) {
	// filter(state,P=?[!"UseStop" U<=N (y=j2)],y=j1)
	// probability to reach j2 (row state) from j1 (column state) without passing through UseStop (i.e. within the same session)
	if (entry.pctl.name.indexOf("VisitProbBtw") == 0 && parseInt(entry.timecut.start) == timecut_start && parseInt(entry.timecut.end) == timecut_end) {
	  if(parseInt(indexStateDictionary(entry.result.j2)) != -1 && parseInt(indexStateDictionary(entry.result.j1)) != -1) {
    	patternId = parseInt(entry.k);
	    indexRow = parseInt(indexStateDictionary(entry.result.j2));
	    indexCol = parseInt(indexStateDictionary(entry.result.j1)) * K + patternId - 1;
	    if (entry.result.value == null){
	      tableSAP_VisitProbBtw[indexRow][indexCol] = "---";;
	    }
    	else if (entry.result.value === "ErrorFilterInit") {
	      tableSAP_VisitProbBtw[indexRow][indexCol] = "---";
    	}
	    else {
    	  //tableSAP_VisitProbBtw[indexRow][indexCol] = parseFloat(entry.result.value);
	      tableSAP_VisitProbBtw[indexRow][indexCol] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
    	  //console.log("Table entry at " + indextimecut + ", " + index + " is " + tableSAP_VisitProbBtw[indexRow][indexCol]);
	    }
  	  }
	 }
	});

  for (var l=0; l<nStates; l++){
	strSAP_VisitProbBtw += "{\\bf \\scriptsize \\" + dict[l].shortLabel + "}";
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;

  	// colouring
  	for(var s=0; s<nStates*K-K+1; s=s+K){
  		for (var x=s; x<s+K-1; x++) {
  			for (var y=x+1; y<s+K; y++) {
  				if (tableSAP_VisitProbBtw[l][x] === "---" && tableSAP_VisitProbBtw[l][y] === "---" ) {
  					Kcolouring[x] = -1;
  					Kcolouring[y] = -1;
  				} else if (tableSAP_VisitProbBtw[l][x] === "---") {
  					Kcolouring[x] = -1;
  					Kcolouring[y]++;
  				} else if (tableSAP_VisitProbBtw[l][y] === "---") {
  					Kcolouring[x]++;
  					Kcolouring[y] = -1;

  				} else {
  					if (parseFloat(tableSAP_VisitProbBtw[l][y]) > parseFloat(tableSAP_VisitProbBtw[l][x])) {
  						Kcolouring[y]++;
	  				} else if (parseFloat(tableSAP_VisitProbBtw[l][y]) < parseFloat(tableSAP_VisitProbBtw[l][x])) {
	  					Kcolouring[x]++;
  					} else {
  						Kcolouring[y]++; Kcolouring[x]++;
  					}
  				}
  			}
  		}
  		for (var x=s; x<s+K; x++) {
  			strSAP_VisitProbBtw += " & " + orderingColourHighBest(Kcolouring[x],K) + tableSAP_VisitProbBtw[l][x] + "}";
  		}
  	}

  	strSAP_VisitProbBtw += "\\\\ \\hline \n";
  }
  strSAP_VisitProbBtw += "\\end{tabular}\n}\n\\end{table}";



  var csvSAP_VisitProbBtw = csv_header_btw;
  for (var l=0; l<nStates; l++) {
  	csvSAP_VisitProbBtw += l + "," + dict[l].shortLabel + "," + tableSAP_VisitProbBtw[l].join(",") + "\n";
  }


    if (fileType.indexOf("latex") == 0) {
    		console.log(strSAP_VisitProbBtw + "\n\n");
    } else if (fileType.indexOf("csv") == 0) {
    	console.log(csvSAP_VisitProbBtw);
    }
    else {
      console.log("File type can only take the values latex or csv, not " + fileType + ".");
    }


  }

/////////////////////////////////////////////////////////////////////////


  // StepCountInit
  if (propType.indexOf("StepCountInit") == 0)  {
	  // Table header for the property SAP_StepCountInit
	  var table_headerSAP_StepCountInit = "\\begin{table}\n\\center\n\\caption{SAP property StepCountInit for K = " + K + "}\\label{table:SAP_StepCountInit_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{|@{}c@{}|";
	  var strSAP_StepCountInit = table_headerSAP_StepCountInit + table_header;
	  // Define array for results of model checking the property SAP_StepCountInit
	  var tableSAP_StepCountInit = new Array(nTimecuts);
	  for (var i = 0; i < nTimecuts; i++) {
	  	tableSAP_StepCountInit[i] = new Array(K*nStates);
	  }


	  data.forEach(function(entry) {
  	  if (entry.pctl.name.indexOf("StepCountInit") == 0) {
  		indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
  		index = parseInt(indexStateDictionary(entry.result.j));
  		patternId = parseInt(entry.k);
		if (index != -1) {
			index = index * K + patternId - 1;
		  	if (entry.result.value == null) {
  				tableSAP_StepCountInit[indextimecut][index] = "---";//"$\\infty$";
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableSAP_StepCountInit[indextimecut][index] = "---";
  			}
  			else {
  				//tableSAP_StepCountInit[indextimecut][index] = parseFloat(entry.result.value);
  				tableSAP_StepCountInit[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  			}
  		}
  	  }
  	  });


	for (var l=0; l<nTimecuts; l++){
		for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;
		strSAP_StepCountInit += "[" + timecuts[l].start + "," + timecuts[l].end + "]" ;

		for(var s=0; s<nStates*K-K+1; s=s+K){
  			for (var x=s; x<s+K-1; x++) {
	  			for (var y=x+1; y<s+K; y++) {
  					if (tableSAP_StepCountInit[l][x] === "---" && tableSAP_StepCountInit[l][y] === "---") {
  						Kcolouring[x] = -1;
  						Kcolouring[y] = -1;
  					} else if (tableSAP_StepCountInit[l][x] === "---") {
  						Kcolouring[x] = -1;
  						//Kcolouring[y]++;
	  				} else if (tableSAP_StepCountInit[l][y] === "---") {
  						//Kcolouring[x]++;
  						Kcolouring[y] = -1;
	  				} else {
  						if (parseFloat(tableSAP_StepCountInit[l][y]) > parseFloat(tableSAP_StepCountInit[l][x])) {
  							Kcolouring[y]++;
	  					} else if (parseFloat(tableSAP_StepCountInit[l][y]) < parseFloat(tableSAP_StepCountInit[l][x])) {
	  						Kcolouring[x]++;
  						} else {
	  						Kcolouring[y]++; Kcolouring[x]++;
  						}
  					}
  				}
	  		}
  			for (var x=s; x<s+K; x++) {
  				strSAP_StepCountInit += " & " + orderingColourLowBest(Kcolouring[x],K) + tableSAP_StepCountInit[l][x] + "}";
	  		}
  		}
  		strSAP_StepCountInit += "\\\\ \\hline \n";
	  }
	  strSAP_StepCountInit += "\\end{tabular}}\n\n\\end{table}";

	  var csvSAP_StepCountInit = csv_header_init;
	  for (var l=0; l<nTimecuts; l++) {
  		csvSAP_StepCountInit += l + "," + "[" + timecuts[l].start + "," + timecuts[l].end + "]" + "," + tableSAP_StepCountInit[l].join(",") + "\n";
	  }

      if (fileType.indexOf("latex") == 0) {
      	console.log(strSAP_StepCountInit + "\n\n");
	  } else if (fileType.indexOf("csv") == 0) {
    	console.log(csvSAP_StepCountInit);
      }
      else {
        console.log("File type can only take the values latex or csv, not " + fileType + ".");
      }

  }
///////////////////////////////////////////////////////////////////


  // StepCountBtw
  if (propType.indexOf("StepCountBtw") == 0)  {
	  // Table header for the property StepCountBtw
	  var table_headerSAP_StepCountBtw = "\\begin{table}\n\\center\n\\caption{SAP property StepCount within the same session for K = " + K + " and time interval [" + timecut_start + ", " + timecut_end + "]}\\label{table:SAP_StepCountBtw_K" + K + "_" + timecut_start + "_" + timecut_end + "}\n{\\footnotesize\n\\begin{tabular}{|c|";
	  var strSAP_StepCountBtw = table_headerSAP_StepCountBtw + table_header_extra;
	  var tableSAP_StepCountBtw = new Array(nStates);
	  for (var i = 0; i < nStates; i++) {
	  	tableSAP_StepCountBtw[i] = new Array(K*nStates);
  	}

	data.forEach(function(entry) {
  	// filter(state,R{"r_Steps"}=?[F (y=j2)],y=j1)
  	// probability to reach j2 (row state) from j1 (column state)
  	if (entry.pctl.name.indexOf("StepCountBtw") == 0 && parseInt(entry.timecut.start) == timecut_start && parseInt(entry.timecut.end) == timecut_end) {
  		if(parseInt(indexStateDictionary(entry.result.j2)) != -1 && parseInt(indexStateDictionary(entry.result.j1)) != -1) {
  			patternId = parseInt(entry.k);
  			indexRow = parseInt(indexStateDictionary(entry.result.j2));
  			indexCol = parseInt(indexStateDictionary(entry.result.j1)) * K + patternId - 1;
  			if (entry.result.value == null){
  				tableSAP_StepCountBtw[indexRow][indexCol] = "---";;
  			}
  			else if (entry.result.value === "ErrorFilterInit") {
  				tableSAP_StepCountBtw[indexRow][indexCol] = "---";
  			}
  			else {
  				//tableSAP_StepCountBtw[indexRow][indexCol] = parseFloat(entry.result.value);
	  			tableSAP_StepCountBtw[indexRow][indexCol] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  				//console.log("Table entry at " + indextimecut + ", " + index + " is " + tableSAP_StepCountBtw[indexRow][indexCol]);
  			}
  		}
  	}
	});

 	 // start from l=1 because we're not interested in steps to reach Main
    for (var l=1; l<nStates; l++){
	strSAP_StepCountBtw += "{\\bf \\scriptsize \\" + dict[l].shortLabel + "}";
	for (var i=0; i<nStates*K; i++) Kcolouring[i] = 0;

		// colouring
		// UseStop position is hard coded: the last -K from the upper bound is due to un-needed UseStop on the last column
  		for(var s=0; s<nStates*K-K+1-K; s=s+K){
  			for (var x=s; x<s+K-1; x++) {
	  			for (var y=x+1; y<s+K; y++) {
  					if (tableSAP_StepCountBtw[l][x] === "---" && tableSAP_StepCountBtw[l][y] === "---") {
  						Kcolouring[x] = -1;
  						Kcolouring[y] = -1;
  					} else if (tableSAP_StepCountBtw[l][x] === "---") {
	  					Kcolouring[x] = -1;
  						//Kcolouring[y]++;
  					} else if (tableSAP_StepCountBtw[l][y] === "---") {
  						//Kcolouring[x]++;
  						Kcolouring[y] = -1;
	  				} else {
  						if (parseFloat(tableSAP_StepCountBtw[l][y]) > parseFloat(tableSAP_StepCountBtw[l][x])) {
  							Kcolouring[y]++;
	  					} else if (parseFloat(tableSAP_StepCountBtw[l][y]) < parseFloat(tableSAP_StepCountBtw[l][x])) {
	  						Kcolouring[x]++;
  						} else {
	  						Kcolouring[y]++; Kcolouring[x]++;
  						}
  					}
  				}
	  		}
  			for (var x=s; x<s+K; x++) {
  				strSAP_StepCountBtw += " & " + orderingColourLowBest(Kcolouring[x],K) + tableSAP_StepCountBtw[l][x] + "}";
	  		}
  		}
  		strSAP_StepCountBtw += "\\\\ \\hline \n";
    }
    strSAP_StepCountBtw += "\\end{tabular}}\n\n\\end{table}";

    var csvSAP_StepCountBtw = csv_header_btw;
    for (var l=0; l<nStates; l++) {
  	  csvSAP_StepCountBtw += l + "," + dict[l].shortLabel + "," + tableSAP_StepCountBtw[l].join(",") + "\n";
    }

    if (fileType.indexOf("latex") == 0) {
    		console.log(strSAP_StepCountBtw + "\n\n");
    } else if (fileType.indexOf("csv") == 0) {
    	console.log(csvSAP_StepCountBtw);
    }
    else {
      console.log("File type can only take the values latex or csv, not " + fileType + ".");
    }

  }

//////////////////////////////////////////////////////////////////


 // VisitCountInit
 if (propType.indexOf("VisitCountInit") == 0)  {
	  // Table header for the property SAP_VisitCountInit
	  var table_headerSAP_VisitCountInit = "\\begin{table}\n\\center\n\\caption{SAP property VisitCountInit for K = " + K + "}\\label{table:SAP_VisitCountInit_K" + K + "_" + dictType + "}\n{\\footnotesize\n\\begin{tabular}{|@{}c@{}|";
	  var strSAP_VisitCountInit = table_headerSAP_VisitCountInit + table_header;
	  var tableSAP_VisitCountInit = new Array(nTimecuts);
	  for (var i = 0; i < nTimecuts; i++) {
	  	tableSAP_VisitCountInit[i] = new Array(K*nStates);
  	}


 	data.forEach(function(entry) {
   		if (entry.pctl.name.indexOf("VisitCountInit") == 0 ) {
  			indextimecut = indexTimecut(parseInt(entry.timecut.start),parseInt(entry.timecut.end));
	  		index = parseInt(indexStateLabelDict_VisitCountInit(entry.pctl.name));
  			patternId = parseInt(entry.k);
  			if (index != -1) {
  				//console.log("State label " + entry.pctl.name.substring(8) + " in pattern " + patternId + " at current dictIndex " + index);
	  			index = index * K + patternId - 1;
  				if (entry.result.value == null) {
  					tableSAP_VisitCountInit[indextimecut][index] = "---";
  				}
	  			else if (entry.result.value === "ErrorFilterInit") {
  					tableSAP_VisitCountInit[indextimecut][index] = "---";
  				}
	  			else {
  					tableSAP_VisitCountInit[indextimecut][index] = (Math.floor(parseFloat(entry.result.value) * 100) / 100).toFixed(2);
  				}
  			}
	  	 }
	  });

	for (var l=0; l<nTimecuts; l++){
    	for (var i=0; i<nStates*K; i++)
    		Kcolouring[i] = 0;
		strSAP_VisitCountInit += "[" + timecuts[l].start + "," + timecuts[l].end + "]";

  		// colouring
	  	// "---" does not change colour from default (worse result)
  		for(var s=0; s<nStates*K-K+1; s=s+K){
  			for (var x=s; x<s+K-1; x++) {
  				for (var y=x+1; y<s+K; y++) {
  					//console.log("Compare " + tableSAP_VisitCountInit[l][x] + " and " + tableSAP_VisitCountInit[l][y]);
	  				//console.log("Compare parsed " + parseFloat(tableSAP_VisitCountInit[l][x]) + " and " + parseFloat(tableSAP_VisitCountInit[l][y]));
  					if (tableSAP_VisitCountInit[l][x] === "---" && tableSAP_VisitCountInit[l][y] === "---" ) {
  						Kcolouring[x] = -1;
  						Kcolouring[y] = -1;
  					} else if (tableSAP_VisitCountInit[l][x] === "---") {
	  					Kcolouring[x] = -1;
  						Kcolouring[y]++;
  					} else if (tableSAP_VisitCountInit[l][y] === "---") {
  						Kcolouring[x]++;
  						Kcolouring[y] = -1;
	  				} else {
  						if (parseFloat(tableSAP_VisitCountInit[l][y]) > parseFloat(tableSAP_VisitCountInit[l][x])) {
  							Kcolouring[y]++;
	  					} else if (parseFloat(tableSAP_VisitCountInit[l][y]) < parseFloat(tableSAP_VisitCountInit[l][x])) {
  							Kcolouring[x]++;
  						} else {
  							Kcolouring[y]++; Kcolouring[x]++;
	  					}
  					}
  				}
	  		}
  			for (var x=s; x<s+K; x++) {
  				strSAP_VisitCountInit += " & " + orderingColourHighBest(Kcolouring[x],K) + tableSAP_VisitCountInit[l][x] + "}";
  			}
	  	}
  		strSAP_VisitCountInit += "\\\\ \\hline \n";
	  }
  	strSAP_VisitCountInit += "\\end{tabular}}\n\\end{table}";

    var csvSAP_VisitCountInit = csv_header_init;
    for (var l=0; l<nTimecuts; l++) {
  	  csvSAP_VisitCountInit += l + "," + "[" + timecuts[l].start + "," + timecuts[l].end + "]" + "," + tableSAP_VisitCountInit[l].join(",") + "\n";
    }

    if (fileType.indexOf("latex") == 0) {
    		console.log(strSAP_VisitCountInit + "\n\n");
    } else if (fileType.indexOf("csv") == 0) {
    	console.log(csvSAP_VisitCountInit);
    }
    else {
      console.log("File type can only take the values latex or csv, not " + fileType + ".");
    }

}
//////////////////////////////////////////////////////////////////


  //console.log(strSAP_VisitProbInit + "\n\n");
  //console.log(strSAP_StepCountInit + "\n\n");
  //console.log(strSAP_VisitCountInit + "\n\n");

  //console.log(csvSAP_VisitProbInit);
  //console.log(csvSAP_StepCountInit);
  //console.log(csvSAP_VisitCountInit);


 function indexStateLabelDict_VisitCountInit(pctlName) {
  	var prefix = "VisitCountInit_";
  	var stateLabel = pctlName.substring(prefix.length);
  	for (var l=0; l<nStates; l++) {
  		if(dict[l].label.indexOf(stateLabel) == 0) {
  			return l;
  		}
  	}
  	return -1;
  }

  function isUseStopState(stateIndex_j){
  	//console.log(stateIndex_j);
  	if (fullDictAT1[parseInt(stateIndex_j)].label.indexOf("UseStop") == 0) {
		    return true;
	  }
    if (fullDictAT2[parseInt(stateIndex_j)].label.indexOf("UseStop") == 0) {
        return true;
    }
    return false;
  }

  function isInitialState(stateIndex_j){
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
