# temporalanalytics
Temporal usage analytics for interactive systems

Current developer: Oana Andrei (2016 - 2020)
Previous developers: Mattias Rost (2015 - 2016), Dan Protopopescu (2017 - 2018)

This README documents whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary: Temporal analytics of software usage models
* Version 

### How do I get set up? ###

 * Set up Docker containers
 	* Create docker image for the inference algorithm Expectation-Maximisation (image em) from the folder ./inferenceEM_PAM_docker/ 
 	* Create docker image for the inference algorithm Baum-Welch (image arhmm) from the folder ./inferenceBW_GPAM_docker/ 
 	* Pull the image mseve/prism from the Docker hub to create a container locally.

 * In the following files set up the appropriate local/remote server location (url) to run the docker containers for the 3 images (em, arhmm, prism):
 	* in the file analysis.js line 157 : look for the line "'http://.../docker.php'" in the code block including the line "task: 'em'".
 	* in the file analysis.js line 298 : look for the line "'http://.../docker.php'" in the code block including the line "task: 'arhmm'"
 	* in the file analysis.js line 350 : look for the line "'http://.../docker.php'" in the code block including the line "task: 'prism'"
 	* in the file services_errorFilter.js line 167 : look for the line "'http://.../docker.php'" in the code block including the line "image: 'arhmm'"
 	* in the file services_errorFilter.js line 269 : look for the line "'http://.../docker.php'" in the code block including the line "image: 'mseve/prism'"
 	* in the file services.js line 167 : look for the line "'http://.../docker.php'" in the code block including the line "image: 'arhmm'"
 	* in the file services.js line 270 : look for the line "'http://.../docker.php'" in the code block including the line "image: 'mseve/prism'"
 	

 * If you are not running a server on your computer, then install one. 
 * Start the server.
 * We recommend Chrome as browser and it needs to be opened (from the terminal) with the option "--allow-file-access-from-files".


### Running the analysis ###

 * Open index.html
 * Select the type of model in the top-left corner: either PAM or GPAM
	* Input the data file
 	* Set the time cut: starting day, end day, and the minimum number of days of usage
 	* Set parameters for the chosen inference algorithm:
 		* for Expectation-Maximisation (EM) the default parameters are: K=2, number of restarts=200, number of iterations=100
 		* for Baum-Welch (BW) the default parameters are: K=2, number of restarts=200, number of iteration restarts=100, number of iterations=100,
 		* in the source code the value of these parameters is set up at the beginning of the file index.js 
 	* Press "Start modelling" button
 	* Save the graphs for each activity pattern
 	* Save the model parameters by pressing "Download model(s)" for either a PAM (resulting from EM algorithm) or a GPAM (resulting from BW algorithm)
 * Select the PRISM option for PRISM analysis
 	* Input the model parameters file from either PAM or GPAM
 	* Add manually PCTL properties or load them from a .json file, which can be found in the folders ./propertiesAppTracker1/ and ./propertiesAppTracker2/ .  
 	* Select the type of analysis:
 		* Patterns PAM for analysing each pattern
 		* GPAM for analysing the flattened GPAM
 	* Press "Download results"
 * To translate the results into tables in csv format or latex format, select a script from the folder ./json2tables/ 
 * Select the PLOTS option for plotting the results for exploratory analysis of partial results
 	* Choose file with PRISM results
 	* Set the Title, Filter, Group accessor, Label accessor of the plot
 	* Download the chart as PNG
 	* Optionally you can add more charts