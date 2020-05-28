// devs: Mattias Rost (2015-2016), Dan Protopopescu (2017-2018), Oana Andrei (2016-2020) 

angular.module('app', [])

.controller('StartController', function ($scope, Analysis, PRISM, ARHMM, EM) {
  $scope.model = {
    rawfile: undefined,
    resfile: undefined,
    pctlfile: undefined,
    chartfile: undefined,
    data: null,
    pctls: PCTLs,
    timecuts: timecuts,
    arhmmParameters: {
      "STATNUMB": 2,
      "NUM_RESTARTS": 200, // SHOULD BE 200,
      "NUM_ITER_RESTARTS": 100, // SHOULD BE 100
      "NUM_ITER_FINAL": 100, // SHOULD BE 100
    },
    emParameters: {
      "k": 2,
      "restarts": 200, // SHOULD BE 200
      "iterations": 100, // SHOULD BE 100
    },
  };

  $scope.oneUserTrace = {
      theta: [0.32, 0.57, 0.11], // sample input for K=3
  }

  $scope.prismanalysis = {
      type: 'GPAM', // This can be Pattern_PAM, UAM, GPAM, Pattern_GPAM
  }

  $scope.fs = {
    dtmc2prism: undefined,
  };

  $scope.charts = [
    {
      counter: 0,
      title: "",
    },
  ];

  $scope.stacks = [
    {
      counter: 0,
      title: "",
    },
  ];

  $scope.model.models = [];

  $scope.sampleData = []; //[{"timecut":{"start":0,"end":1},"pctl":{"name":"Prop 1","properties":"const N;\nP = ? [F<=N y=4]\n","arguments":"-const N=50","$$hashKey":"object:14"},"result":{"value":0.9999864968453416},"$$hashKey":"object:41"},{"timecut":{"start":0,"end":1,"$$hashKey":"object:5"},"pctl":{"name":"Prop 2","properties":"const N;\nP = ? [F<=N y=2]\n","arguments":"-const N=50","$$hashKey":"object:15"},"result":{"value":0.7447036070999433},"$$hashKey":"object:42"},{"timecut":{"start":0,"end":7,"$$hashKey":"object:6"},"pctl":{"name":"Prop 1","properties":"const N;\nP = ? [F<=N y=4]\n","arguments":"-const N=50","$$hashKey":"object:14"},"result":{"value":0.9999894348795845},"$$hashKey":"object:43"},{"timecut":{"start":0,"end":7,"$$hashKey":"object:6"},"pctl":{"name":"Prop 2","properties":"const N;\nP = ? [F<=N y=2]\n","arguments":"-const N=50","$$hashKey":"object:15"},"result":{"value":0.7074208681113434},"$$hashKey":"object:44"}];

  $scope.toggleServices = () => {
    $('.services').toggleClass('collapsed');
  };

  $scope.updateStack = (index) => {
    $scope.stacks[index].counter++;
    console.log('updating stack chart');
  }

  $scope.updateChart = (index) => {
    $scope.charts[index].counter++;
    console.log('updating chart');
  };

  $scope.addChart = () => {
    $scope.charts.push({
      counter: 0,
      title: 'Chart ' + $scope.charts.length,
    });
  };

  $scope.parameterKeys = function (obj) { return Object.keys(obj); };

  $scope.arhmmKeys = function () { return Object.keys($scope.model.arhmmParameters); };

  $scope.removePCTL = function (index) {
    $scope.model.pctls.splice(index, 1);
  };

  $scope.removeTimecut = function (index) {
    $scope.model.timecuts.splice(index, 1);
  };

  $scope.addTimecut = function () {
    $scope.model.timecuts.push({ start: 0, end: 10 });
  };

  $scope.addPCTL = function () {
    $scope.model.pctls.push({ properties: "", arguments: "" });
  };

  $scope.startCalculations = startCalculations;

  $scope.$watch('model.rawfile', function (content) {
    if (!content) return;

    try {
      $scope.model.data = JSON.parse(content);
    } catch (e) {
      $scope.model.error = "Unable to parse file as JSON";
    }
  });

    $scope.$watch('model.pctlfile', function (content3) {
    if (!content3) return;

    try {
	var data = JSON.parse(content3);
	//console.log(data);
	for(var i in data){
	    //console.log('data[' + i + '] = {"' + data[i].name + '", "'+ data[i].properties + '", "' + data[i].arguments + '"}');
	    $scope.model.pctls.push({
		name: data[i].name,
		properties: data[i].properties,
                arguments: data[i].arguments
	    });
	}
        console.log('Loaded PCTLs');
    } catch (e) {
      $scope.model.error = "Unable to parse PCTLs file as JSON";
    }
  });

  $scope.$watch('model.resfile', function (content2) {
    if (!content2) return;

    try {
	$scope.model.models = JSON.parse(content2);
	//console.log($scope.model.models);
	if($scope.model.models[0].hasOwnProperty('emmodel')){
	    $scope.model.emAnalysis = true;
	    $scope.prismanalysis.type = "Pattern_PAM";
	    console.log('Got a PAM model');
	} else {
	    $scope.model.emAnalysis = false;
	    $scope.prismanalysis.type = "GPAM";
	    console.log('Got a GPAM model');
	}

    } catch (e) {
      $scope.model.error = "Unable to parse file as JSON";
    }
  });

  $scope.$watch('model.chartfile', function (content1) {
    if (!content1) return;

    try {
      $scope.model.chartdata = JSON.parse(content1);
    } catch (e) {
      $scope.model.error = "Unable to parse chart data file as JSON";
    }
  });

  $scope.$watch('model.tabledata', function (output) {
    console.log('tabledata changed', output);
    if (!output) return;

    $scope.model.tabledataexport = JSON.stringify($scope.model.tabledata.map(d => {
      var d2 = Object.assign({}, d);
      delete d2.timecut.data;
      return d2;
    }));
  }, true);

  function performPCTLs(PCTLs) {
    return (model) => (
      Promise.map(PCTLs, pctl => PRISM.run(pctl, model))
    );
  }

  $scope.checkOneUserTraceValue = checkOneUserTraceValue;

  function checkOneUserTraceValue() {

      var K, ana = $scope.prismanalysis.type;

      // Convert string to array if necessary
      if(typeof $scope.oneUserTrace.theta === 'string'){
	  $scope.oneUserTrace.theta = JSON.parse("[" + $scope.oneUserTrace.theta + "]");
      }
      var theta_array = $scope.oneUserTrace.theta;

      var N = theta_array.length;
      if(ana=="UAM" || ana=="Pattern_PAM"){
          K = $scope.model.models[0].emmodel.phi.length;
      } else {
	  K = $scope.model.models[0].arhmmmodel.TranProb.length;
      }
      if((K-N)!=0){
	  console.log("Error in oneUserTrace.theta: Incorrect array size K=" + K + " and N=" + N);
	  return 88;
      }
      var sum = 0.0;
      for (var i in theta_array) {
	  sum += theta_array[i];
      }
      if(sum<0.9999999 || sum>1.00000001){
	  console.log("Error in oneUserTrace.theta: Probabilities don't add up to unity Sum P(i)=" + sum);
	  return 99;
      }

      return 0;
  }

  $scope.startModelling = startModelling;

  function startModelling() {

     console.log('calling startModelling()');

    var data = $scope.model.data.slice();
    var cleaned = cleanData(data);
    $scope.model.cleaned = cleaned;

    var dictionary = Analysis.createDictionary(cleaned);
    var cuts = createCuts($scope.model.timecuts, cleaned);

    // work with 1 timecut only
    dictionary = Analysis.createDictionary(cuts[0].data);
    console.log("Dictionary for timecut data: " + dictionary);
    console.log("Number of user traces in the timecut data: " + cuts[0].data.length);
    $scope.model.dictionary = dictionary;

    // add a standard dictionary for all time cuts
    var stdDictionary = makeStandardDictionary($scope.model.data);
    console.log("Standard dictionary: " + stdDictionary);
    $scope.model.stdDictionary = stdDictionary;

    function makeStandardDictionary(dataS) {
	     var dictS = [];
	     data.forEach(
	     user => user.sessions.forEach(
		      session => session.forEach(
		         event => getStdDictionaryIndex(event.data,dictS)
		        )
	    )
	);
	return dictS;
    }

    function getStdDictionaryIndex(word,dictS) {
	     var i = dictS.indexOf(word);
	     if (i === -1) {
	       dictS.push(word);
	       return dictS.length - 1;
	     } else {
	     return i;
	     }
    }

    // begin mapping each DTMC/activity patterns learnt by EM, each phi[k] arranged according to dictionary,
    // to a new matrix arranged according to stdDictionary
    function rearrangeDTMC2stdDictionaryEM(emResult){
	var sizeDictionary = dictionary.length;
	var sizeStdDictionary = stdDictionary.length;
	var x = 0;
	var y = 0;
	var phiBefore = emResult.phi;

	var phiAfter = new Array();
	for (var k=0; k<phiBefore.length; k++) {
	    phiAfter[k] = new Array();
	    for (var i=0; i<sizeStdDictionary; i++) {
		phiAfter[k][i] = new Array();
		for (var j=0; j<sizeStdDictionary; j++) {
		    phiAfter[k][i][j] = 0;
		}
	    }
	}
	for (var k=0; k<phiBefore.length; k++) {
	    for (var i=0; i<sizeStdDictionary; i++) {
		for (var j=0; j<sizeStdDictionary; j++) {
		    x = dictionary.indexOf(stdDictionary[i]);
		    y = dictionary.indexOf(stdDictionary[j]);
		    if (x > -1 && y > -1) {
			phiAfter[k][i][j] = phiBefore[k][x][y];
		    }
		}
	    }
	}
	emResult.phi = phiAfter;
	return emResult;
    } // end mapping

    // begin mapping each DTMC/activity patterns learnt by ARHMM, each ObsvProb[k] arranged according to dictionary,
    // to a new matrix arranged according to stdDictionary
    // The dictionary for the cut should be the same as Alphabet
    function rearrangeDTMC2stdDictionaryARHMM(arhmm){
		    var sizeDictionary = dictionary.length;
        console.log("size dictionary " + sizeDictionary);
        console.log("dictionary " + dictionary);
		    var sizeStdDictionary = stdDictionary.length;
        console.log("stdDictionary " + stdDictionary.length);
		    var x = 0;
		    var y = 0;
		    var ObsvProbBefore = arhmm.ObsvProb;
        console.log("arhmm.ObsvProb " + arhmm.ObsvProb);

		    console.log("Test if the following two are the same!");
	      console.log("Alphabet before: " + arhmm.Alphabet);
		    console.log("Dictionary for the time interval: " + dictionary);
		    console.log("stdDictionary: " + stdDictionary);

		var ObsvProbAfter = new Array();
		for (var k=0; k<ObsvProbBefore.length; k++) {
	    	ObsvProbAfter[k] = new Array();
		    for (var i=0; i<sizeStdDictionary; i++) {
				      ObsvProbAfter[k][i] = new Array();
				      for (var j=0; j<sizeStdDictionary; j++) {
			           ObsvProbAfter[k][i][j] = 0;
				      }
	    	}
		}

		for (var k=0; k<ObsvProbBefore.length; k++) {
        console.log(ObsvProbBefore.length + " ObsvProbBefore[" + k + "] " + ObsvProbBefore[k]);
	    	for (var i=0; i<sizeStdDictionary; i++) {
				      for (var j=0; j<sizeStdDictionary; j++) {
                    console.log("before test: " + dictionary.indexOf(stdDictionary[i]) + "  " + dictionary.indexOf(stdDictionary[j]))
				            x = dictionary.indexOf(stdDictionary[i]);
				            y = dictionary.indexOf(stdDictionary[j]);
					          console.log(x + "  " + y);
				           if (x > -1 && y > -1) {
						           ObsvProbAfter[k][i][j] = ObsvProbBefore[k][x][y];
			    	       }
                   else {
                     console.log("one is -1");
                   }

				}
	    	}
		}
		arhmm.ObsvProb = ObsvProbAfter;
		arhmm.Alphabet = stdDictionary;
		console.log("Alphabet after: " + arhmm.Alphabet);
		return arhmm;
    } // end mapping

    //$scope.model.models = []; // this is global now

    var results = Promise.map(cuts, (cut, i) => (
      $scope.model.emAnalysis ?

      $scope.model.emAdmixture ?

      EM.run($scope.fs.createUserModels.f(cut, dictionary), $scope.model.emParameters)
        .then(emResult => {
          $scope.model.models.push({
            timecut: cut,
            emmodel: rearrangeDTMC2stdDictionaryEM(emResult),
            dictionary: stdDictionary, // added to models
          });

	    console.log('Done UAM and updated models');

          $scope.$apply();
        })

      :

      EM.run($scope.fs.createUserModels.f(cut, dictionary), $scope.model.emParameters)
        .then(emResult => {
          $scope.model.models.push({
            timecut: cut,
            emmodel: rearrangeDTMC2stdDictionaryEM(emResult),
	    dictionary: stdDictionary, // add to models
          });

	    console.log('Done PAM/EM and updated models, with stdDictionary');

          $scope.$apply();
        })
      :

      ARHMM.run($scope.model.arhmmParameters, cut)
        .then((arhmm) => {
          $scope.model.models.push({
            timecut: cut,
            arhmmmodel: rearrangeDTMC2stdDictionaryARHMM(arhmm),
            //arhmmmodel: arhmm,
	    dictionary: stdDictionary, // add to models
          });

          console.log('Done GPAM/ARHMM and updated models, with stdDictionary');

          $scope.$apply();
        })
    ));
  }

  $scope.startPropertyAnalysis = startPropertyAnalysis;

  function startPropertyAnalysis() {
      $scope.model.tabledata = [];

      var dictionary = $scope.model.models[0].dictionary;
      console.log('startPropertyAnalysis with dictionary: ' + dictionary);

      if ($scope.model.emAnalysis && $scope.model.emAdmixture) {
	  $scope.model.models.forEach(model => {
              performPCTLs($scope.model.pctls)(
		  $scope.fs.userAdmixturePRISM.f(
		      model.emmodel,
		      dictionary,
		      $scope.oneUserTrace.theta,
		  )
              ).then(pctlResults => {
		  pctlResults.forEach((result, j) => {
		      if (Array.isArray(result)) {
			  result.forEach(value => {
			      $scope.model.tabledata.push({
				  modeltype: "UAM",
				  timecut: model.timecut,
				  pctl: $scope.model.pctls[j],
				  result: value,
			      });
			  });
		      } else {
			  $scope.model.tabledata.push({
			      modeltype: "UAM",
			      timecut: model.timecut,
			      pctl: $scope.model.pctls[j],
			      result: Array.isArray(result) ? result : { value: result },
			  });
		      }

		      $scope.$apply();
		  });
              });
	  });
      } else if ($scope.model.emAnalysis) {
	  $scope.model.models.forEach(model => {
              console.log(model.emmodel.phi);
              console.log("Dictionary for EM: " + dictionary);
              Promise.map(
		  model.emmodel.phi.map((dtmc) => $scope.fs.dtmc2prism.f(dtmc, dictionary)),
		  performPCTLs($scope.model.pctls)
              ).then(kPctlResults => {
		  kPctlResults.forEach((pctlResults, k) => {
		      pctlResults.forEach((result, j) => {
			  if (Array.isArray(result)) {
			      result.forEach(value => {
				  $scope.model.tabledata.push({
				      modeltype: "Pattern_PAM",
				      timecut: model.timecut,
				      k: k+1,
				      pctl: $scope.model.pctls[j],
				      result: value,
				  });
			      });
			  } else {
			      $scope.model.tabledata.push({
				  modeltype: "Pattern_PAM",
				  timecut: model.timecut,
				  k: k+1,
				  pctl: $scope.model.pctls[j],
				  result: Array.isArray(result) ? result : { value: result },
			      });
			  }

			  $scope.$apply();
		      });
		  });
		  return kPctlResults;
              });
	  });

    } else if ($scope.model.patternGPAM) {

	console.log('Running PRISM on each Activity Pattern');

	$scope.model.models.forEach(model => {

	    console.log("arhmmmodel.ObsvProb " + model.arhmmmodel.ObsvProb);
      dictionary = model.arhmmmodel.Alphabet;
	    console.log("Alphabet for ARHMM : " + dictionary);

	    Promise.map(
		model.arhmmmodel.ObsvProb.map((dtmc) => $scope.fs.dtmc2prism.f(dtmc,dictionary)),
		performPCTLs($scope.model.pctls)
            ).then(kPctlResults => {
		kPctlResults.forEach((pctlResults, k) => {
		    pctlResults.forEach((result, j) => {
			if (Array.isArray(result)) {
			    result.forEach(value => {
				$scope.model.tabledata.push({
				    modeltype: "Pattern_GPAM",
				    timecut: model.timecut,
				    k: k+1,
				    pctl: $scope.model.pctls[j],
				    result: value,
				});
			    });
			} else {
			    $scope.model.tabledata.push({
				modeltype: "Pattern_GPAM",
				timecut: model.timecut,
				k: k+1,
				pctl: $scope.model.pctls[j],
				result: Array.isArray(result) ? result : { value: result },
			    });
			}
			$scope.$apply();
		    });
		});
		return kPctlResults;
            });
	});

    } else {  // arhmm (i.e. GPAM)

	// we want to be able to analyse also either individual activity patterns (like EM)

	console.log('Calling ARHMM analysis');
	$scope.model.models.forEach(model => {
	    dictionary = model.arhmmmodel.Alphabet;

            console.log('Running PRISM on GPAM');

            performPCTLs($scope.model.pctls)($scope.fs.makePRISMfromARHMM.f(model.arhmmmodel))
		.then(pctlResults => {
		    pctlResults.forEach((result, j) => {
			if (Array.isArray(result)) {
			    result.forEach(value => {
				$scope.model.tabledata.push({
				    modeltype: "GPAM",
				    timecut: model.timecut,
				    pctl: $scope.model.pctls[j],
				    result: value,
				});
				console.log('pctl output');
			    });
			} else {
			    $scope.model.tabledata.push({
            			modeltype: "GPAM",
				timecut: model.timecut,
				pctl: $scope.model.pctls[j],
				result: Array.isArray(result) ? result : { value: result },
			    });
			    console.log('pctl output ', result);
			}

			$scope.$apply();
		    });
		    console.log('pctlResults done');
		    return pctlResults;
		});
	});
    }
  }

  $scope.savePrismResults = savePrismResults;

  function savePrismResults(){
    var json = $scope.model.tabledataexport;
    var blob = new Blob([json], {type: "application/json"});
    var url  = URL.createObjectURL(blob);
    var a = document.createElement('a');

    // Encode model, TC and analysis type in file name
    var tc = $scope.model.models[0].timecut.start + '_'
          + $scope.model.models[0].timecut.end + '_'
          + $scope.model.models[0].timecut.mindays;
    var K, ana = $scope.prismanalysis.type;
    if(ana=="UAM" || ana=="Pattern_PAM"){
        K = $scope.model.models[0].emmodel.phi.length;
    } else {
	K = $scope.model.models[0].arhmmmodel.TranProb.length;
    }
    a.download = "prism_" + ana + '_' + tc + '_K' + K + ".json";
    //console.log(json);

    a.href = url;
    //a.textContent = "Download prism_results.json";
    console.log('Output file is prism_results.json');
    //document.getElementById('intdata').appendChild(a);
    a.click();
    delete a;
  }

  $scope.exportGraph = exportGraph;

  function exportGraph(name){

      console.log('Called exportGraph("'+name+'")');

      var svg = document.getElementById('graph_' + name);
      var canvas = document.getElementById('canvas_' + name);
      var ctx = canvas.getContext('2d');

      var data = (new XMLSerializer()).serializeToString(svg);
      var svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
      var url = URL.createObjectURL(svgBlob);

      // Encode model type, TC and K in filename
      var type = "GPAM";
      var K = $scope.model.arhmmParameters.STATNUMB;
      if($scope.model.emAnalysis){
          K = $scope.model.emParameters.k;
	  type = "PAM";
      }
      var tc = $scope.model.models[0].timecut.start + '_'
          + $scope.model.models[0].timecut.end + '_'
          + $scope.model.models[0].timecut.mindays;

      // PNG dimensions (see dimensions in graphs.js)
      var save_width  = 480; // 2*svg.width
      var save_height = 525; // 2*svg.height

      var img = new Image();
      img.src = url;
      img.onload = function() {
	  ctx.clearRect(0, 0, save_width, save_height);
	  ctx.drawImage(img, 0, 0, save_width, save_height);
	  var a = document.createElement("a");
	  a.download = 'graph_' + name + '_' + type + '_' + tc + '_K' + K + ".png";
	  a.href = canvas.toDataURL("image/png");
	  a.click();
      };
  }

  $scope.saveModel = saveModel;

  function saveModel(type){
      var json = JSON.stringify($scope.model.models.map(d => {
	  var d2 = Object.assign({}, d);
	  delete d2.timecut.data;
	  return d2;
      }));
      //console.log(json);
      var blob = new Blob([json], {type: "application/json"});
      var url  = URL.createObjectURL(blob);
      var a = document.createElement('a');

      // Encode timecut and k in file name
      var K = $scope.model.arhmmParameters.STATNUMB;
      if(type=="pam"){
	  K = $scope.model.emParameters.k;
      }
      var tc = $scope.model.models[0].timecut.start + '_'
	  + $scope.model.models[0].timecut.end + '_'
          + $scope.model.models[0].timecut.mindays;
      a.download = type + '_' + tc + '_K' + K + ".json";

      a.href = url;
      console.log('Output file is '+ a.download);
      a.click();
      delete a;
  }

  $scope.savePCTLs = savePCTLs;

  function savePCTLs(){
    var pctls = JSON.stringify($scope.model.pctls);
    var blob = new Blob([pctls], {type: "application/json"});
    var url  = URL.createObjectURL(blob);
    var a = document.createElement('a');

    // Encode number of PCTLs in file name
    var anatype = $scope.analysis.type;
    var num = $scope.model.pctls.length;
    a.download    = num + anatype + "_pctls.json";
    console.log('PCTLs file is ' + a.download);

    a.href        = url;
    a.click();
    delete a;
  }

  function startCalculations() {

      // not used (?)

    $scope.working = true;

    var data = $scope.model.data.slice();
    var cleaned = cleanData(data);
    $scope.model.cleaned = cleaned;

    var dictionary = Analysis.createDictionary(cleaned);
    var cuts = createCuts($scope.model.timecuts, cleaned);

    $scope.model.dictionary = dictionary;
    $scope.model.tabledata = [];
    var results = Promise.map(cuts, (cut, i) => (
      $scope.model.emAnalysis ?

      $scope.model.emAdmixture ?

      EM.run($scope.fs.createUserModels.f(cut, dictionary), $scope.model.emParameters)
        .then(emResult => (
          performPCTLs($scope.model.pctls)(
            $scope.fs.userAdmixturePRISM.f(
              emResult,
              //Analysis.createDictionary(cut.data)
              dictionary
            )
          )
        ))
        .then(pctlResults => {
          pctlResults.forEach((result, j) => {
            if (Array.isArray(result)) {
              result.forEach(value => {
                $scope.model.tabledata.push({
                  timecut: cut,
                  pctl: $scope.model.pctls[j],
                  result: value,
                });
              });
            } else {
              $scope.model.tabledata.push({
                timecut: cut,
                pctl: $scope.model.pctls[j],
                result: Array.isArray(result) ? result : { value: result },
              });
            }

            $scope.$apply();
          });
          console.log('pctlResults done');
          return pctlResults;
        }).then(results => {
          console.log('done', results);
          return results;
        })

      :

      EM.run($scope.fs.createUserModels.f(cut, dictionary), $scope.model.emParameters)
        .then(emResult => {
          $scope.model.emResults = emResult;
          return Promise.map(
            emResult.phi.map((dtmc) => $scope.fs.dtmc2prism.f(dtmc, dictionary)),
            performPCTLs($scope.model.pctls)
          ).then(kPctlResults => {
            kPctlResults.forEach((pctlResults, k) => {
              pctlResults.forEach((result, j) => {
                if (Array.isArray(result)) {
                  result.forEach(value => {
                    $scope.model.tabledata.push({
                      timecut: cut,
                      k: k,
                      pctl: $scope.model.pctls[j],
                      result: value,
                    });
                  });
                } else {
                  $scope.model.tabledata.push({
                    timecut: cut,
                    k: k,
                    pctl: $scope.model.pctls[j],
                    result: Array.isArray(result) ? result : { value: result },
                  });
                }

                $scope.$apply();
              });
            });
            return kPctlResults;
          });
        }).then(results => {
          console.log('done', results);
          return results;
        })

      :

      // performARHMM($scope.model.arhmmParameters, cut)
      ARHMM.run($scope.model.arhmmParameters, cut)
        .then($scope.fs.makePRISMfromARHMM.f)
        .then(performPCTLs($scope.model.pctls))
        .then(pctlResults => {
          pctlResults.forEach((result, j) => {
            if (Array.isArray(result)) {
              result.forEach(value => {
                $scope.model.tabledata.push({
                  timecut: cut,
                  pctl: $scope.model.pctls[j],
                  result: value,
                });
              });
            } else {
              $scope.model.tabledata.push({
                timecut: cut,
                pctl: $scope.model.pctls[j],
                result: Array.isArray(result) ? result : { value: result },
              });
            }

            $scope.$apply();
          });
          console.log('pctlResults done');
          return pctlResults;
        }).then(results => {
          console.log('done', results);
          return results;
        })

    )).then(() => {
      console.log('done', $scope.model.tabledata);
      $scope.working = false;
      $scope.$apply();
    });
  }
});
