#temporalanalytics

Processing the results from model checking SAP and MAP properties as latex or csv tables

SAP properties
==============
VisitProbInit, StepCountInit, VisitProbBtw, StepCountBtw, Session characteristics (VisitProbInit(Session), SessionLength, SessionCount), VisitCountInit_[stateLabel]

1. generate the json results of the PRISM property in the tool interface for each time interval and value of K for PAM/GPAM models
2. collate the PRISM results files prism_[PAM|GPAM]_[timeInterval]_K[value].json into results_[PAM|GPAM]_K[value].json using the script file collate_results_[PAM|GPAM]_by_K
3. run the command: 
node jsonResults2tables_AT1.js results_Pattern_PAM_K2.json K [latex|csv] [4statesL1|UseStop|8statesL1|twolevels|4statesL2|threelevels|alt|full] [VisitProbInit|StepCountInit|VisitCountInit|VisitProbBtw|StepCountBtw|Session] 
** The script contains different subsets of the full dictionary (observed state labels) of the mobile app AppTracker 1 (AT1). For each set of execution traces analysed, you need to change the dictionary. 

MAP properties
==============

For LongRunPattern:
1. generate the json results of the PRISM property in the tool interface for each time interval and value of K 
2. collate the PRISM results files prism_GPAM_[timeInterval]_K[value].json into results_GPAM_K[value].json using the script file collate_results_GPAM_by_K
3. to get the latex or csv table for a value of K, run the command: node jsonResults2tables_AT1_MAP_LongRunPattern.js results_GPAM_K2.json K [latex|csv] 


For StateToPattern:
1. generate the json results of the PRISM property in the tool interface for each time interval and value of K
2. collate the prismResultsGPAM_State2Pattern_[timeInterval]_K[value].json into prismResultsGPAM_State2Pattern_K[value].json to contain the results for all time intervals for the same value of K -- use the script file collate_results_GPAM_State2Pattern_by_K 
3. use the script filter_MAP_State2Pattern which calls the JavaScript file filter_MAP_State2Pattern.js on files prismResultsGPAM_State2Pattern_K[value].json so that it only keeps those results for which the probability p for which the property is true is the maximum
4. generate the latex table or csv table using the JavaScript file jsonResults2tables_AT1_MAP_State2Pattern.js which also takes as input a label for the set of states considered. One can use the script generateLatexTables_MAP_State2Pattern to generate the latex tables for all values of K 


Use the same sequence of steps for the StateToStop and Response.
For the MAP property StateToStop use the following scripts:
- collate_results_GPAM_State2End_by_K
- filter_MAP_State2End.js
- jsonResults2tables_AT1_MAP_State2End.js 
- generateLatexTables_MAP_State2End

In the specification of the property Response_PS_SB/Response_SB_PS, the identifiers of the two observed states are hard coded, i.e. the values of the variable y in the two state properties phi1 and phi2. 

The script jsonResults2tables_AT1_MAP_draft.js can be used for the properties specified in MAP_properties_draft_AT1_16states_K[2|3|4|5].json . These properties reason over flattened GPAMs and are variants of the VisitProb, StepCount, and VisitCount properties. 
 

