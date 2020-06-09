# temporalanalytics
Temporal usage analytics for interactive systems

* The folder wwwrootfiles/ contains all source files for running the temporal analytics and a README file on how to set it up and run it. 

* The folder dockerImagesFiles/ contains the source files for the two inference algorithms, Expectation-Maximization and Baum-Welch. These are needed for creating Docker images to be used alongside the code in wwwrootfiles/ .

* The folder testdata/ contains an example dataset with AppTracker1 user traces. 

* The folder SAPandMAPproperties/ contains examples of SAP and MAP properties for AppTracker1 and for AppTracker2 mobile application analysis.

* The folder json2table/ contains scripts for translating the analytics results from the PRISM model checker into csv files and/or latex formated tables. 
