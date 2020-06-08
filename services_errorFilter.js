// devs: Mattias Rost (2015-2016), Dan Protopopescu (2017-2018), Oana Andrei (2016-2020) 

angular.module('app')

.factory('EM', function ($rootScope, Analysis) {
  var status = {
    running: false,
    status: '',
    lastOutput: '',
  };

  function run(models, options) {

    console.log('running EM', options);

    status.running = true;
    status.error = false;
    status.status = "running";

    return Analysis.em(models, options).then(function (result) {
      $rootScope.$apply(() => {
        status.running = false;

        //        status.lastOutput = result[1];
        status.status = "done";
      });
      return result;
    }).catch(function (error) {
      $rootScope.$apply(() => {
        status.running = false;
        status.error = true;
        if (error.output) {
          status.lastOutput = error.output;
        } else {
          status.lastOutput = "error talking to the server";
        }

        status.status = "error";
        status.cut = cut;

      });
    });
  }

  function userAdmixturePRISM(emparams, dictionary, thetaOneUserTrace) {

    var params = emparams;
    var thetas = params.theta;

    console.log("Called services:userAdmixturePRISM with thetaOneUserTrace=" + thetaOneUserTrace);

    var A = thetaOneUserTrace;
    var B = params.phi;
    var numHStates = A.length;
    var numOStates = B[0].length;
    var iota = thetaOneUserTrace;

    var str = "\ndtmc\n\n";

    str += "const init_y = " + dictionary.indexOf("UseStart") + ";\n";

    str += "\nmodule DTMC\n";

    str += "  x:[0.." + A.length + "] init 0;\n";

    // init value for y should be the id of UseStart on the alphabet
    str += "  y:[0.." + (B[0].length - 1) + "] init init_y;\n";
    str += "\n";

    var terms1 = [];
    str += "  [] (x=0) & (y=init_y) -> ";

    for (var k = 0; k < numHStates; k++) {
      if (iota[k] !== 0) {
        terms1.push(iota[k] + ":(x'=" + (k + 1) + ") & (y'=init_y)");
      }
    }

    if (terms1.length > 0) {
      str += terms1.join(" + ") + ";\n";
    }

    for (var k = 0; k < numHStates; k++) {
      for (var i = 0; i < numOStates; i++) {
        var terms = [];
        for (var l = 0; l < numHStates; l++) {
          for (var j = 0; j < numOStates; j++) {
            if (A[l] * B[l][i][j] !== 0.0) {
              terms.push(A[l] * B[l][i][j] + ":(x'=" + (l + 1) + ")&(y'=" + j + ")");
            }
          }
        }

        if (terms.length > 0) {
          str += "  [] (x=" + (k + 1) + ") & (y=" + i + ") -> " + terms.join(" + ") + ";\n";
        }
      }
    }

    str += "endmodule\n";
    str += "\n";

    dictionary.forEach(function (word, i) {
      str += "label \"" + word + "\" = (x=" + i + ");\n";
    });

    str += "\n";

    dictionary.forEach(function (word, i) {
      str += "rewards \"r_" + word + "\"\n";
      str += "  (x=" + i + ") : 1;\n";
      str += "endrewards\n\n";
    });

    str += "rewards \"r_Steps\"\n";
    str += "	[] true : 1;\n";
    str += "endrewards\n";

    function round(m) {
      return m.map(function (r) {
        var row = r.map(function (v) { return (Number(v)).toFixed(2); });

        var sum = d3.sum(row);
        return row.map(function (v) { return v / sum; });
      });
    }

    return str;
  }

  function getStatusObject() {
    return status;
  }

  return {
    run: run,
    getStatusObject: getStatusObject,
    userAdmixturePRISM: userAdmixturePRISM,
  };
})

.factory('ARHMM', function ($rootScope) {
  var status = {
    running: false,
    status: '',
    lastOutput: '',
  };

  function ARHMM(parameters, cut) {

    console.log('calling ARHMM');

    status.running = true;
    status.status = "running";
    status.error = false;

    return new Promise((resolve, reject) => {

      var inputData = cut.data.map(
        user => user.deviceid + ' ' +
          user.sessions.map(
            session => session.map(use => use.data).join(' ')
          ).join(' ')
      ).join('\n');

      $.post(
        'http://127.0.0.1/docker.php',
        {
          files: [
            {
              name: 'input.txt',
              content: inputData,
            },
            {
              name: 'args.json',
              content: JSON.stringify(parameters),
            },
          ],
          timecut: JSON.stringify(cut),
          image: 'arhmm',
          cmd: '',
          outputs: [
              'globalEM_InitProb.txt',
              'globalEM_TranProb.txt',
              'globalEM_ObsvProb.txt',
              'globalEM_Alphabet.txt',
              'args.json',
              'input.txt',
          ],
        }
      ).then(
        res => (
          {
            args: res['args.json'],
            InitProb: JSON.parse(res['globalEM_InitProb.txt']),
            TranProb: JSON.parse(res['globalEM_TranProb.txt']),
            ObsvProb: JSON.parse(res['globalEM_ObsvProb.txt']),
            Alphabet: res['globalEM_Alphabet.txt'].split(/, /).map(s => s.replace(/\[|\]|\n/g, '')),
          }
        ),
        err => reject(err)
      ).then(result => {
        console.log('arhmm finished');
        resolve(result);
      });
    });
  }

  function run(parameters, cut) {
    return ARHMM(parameters, cut).then(function (result) {
	$rootScope.$apply(() => {
	    status.running = false;
	    
	    // status.lastOutput = result[1];
	    status.status = "done";
	});
	return result;
    }).catch(function (error) {
	$rootScope.$apply(() => {
	    status.running = false;
	    status.error = true;
	    if (error.output) {
		status.lastOutput = error.output;
	    } else {
		status.lastOutput = "error talking to the server";
	    }
	    
	    status.status = "error";
	    status.cut = cut;	    
	});
    });
  }
    
  function getStatusObject() {
    return status;
  }

  return {
    run: run,
    getStatusObject: getStatusObject,
  };
})

.factory('PRISM', function ($rootScope) {

  var status = {
    running: false,
    status: '',
    error: false,
    lastOutput: 'not run yet',
  };

  // var queue = [];
  // var running = false;

  function PRISM(pctl, model) {

    return new Promise((resolve, reject) => {
      var prism = model;
      var props = pctl.properties; //'const N;\nP = ? [F<=N y=4]\n';
      var args = pctl.arguments; //'-const N=50';

//      $rootScope.$apply(() => {
        status.running = true;
        status.error = false;
//      });

      $.post(
        'http://127.0.0.1/docker.php',
        {
          files: [
            {
              name: 'prism.model',
              content: prism,
            },
            {
              name: 'prism.props',
              content: props,
            },
            {
              name: 'run.sh',
              content: '#!/bin/sh\n\nrm /data/output.txt\n' +
                `prism /data/prism.model /data/prism.props ${args} -maxiters 100000 -exportresults /data/output.txt`,
              mode: 0777,
            },
          ],
          image: 'mseve/prism',
          cmd: `/data/run.sh`,
          outputs: [
              'output.txt',
          ],
        }
      ).then(
        response => {
          if (response['output.txt'] === false) {
            reject({ output: response.stdout });

            return;
          }

          var lines = response['output.txt'].split('\n');

          var consts = lines[0].split('\t').slice(0, -1);

/*
		// TESTING
	    //console.log(JSON.stringify(lines));

        var results = lines.slice(1).map(line => {
          var col = line.split('\t');
          //console.log("S: Col " + JSON.stringify(col));
          var o = {};
          if (col.length > 1) {
            consts.forEach((c, i) => { o[c] = col[i]; });
            //o.value = parseFloat(col[col.length - 1]);
            o.value = col[col.length - 1];
            o.value = parseFloat(o.value);
            if (Number.isNaN(o.value)) { 
//            	console.log("S: NaN");
            	o.value = "ErrorFilter";
            }
           // console.log("S: Value of o " + JSON.stringify(o.value));
            return o;
          } else if (col.length === 1) {
            return parseFloat(col[col.length - 1]);;
          } else {
            // return null;
            // Test with -1 instead of null
            // console.log("S: Null value, return -1");
            return null;
          }
        }).filter(val => val !== null && !Number.isNaN(val));

        if (results.length === 1) {
          results = results[0];
        }

        resolve(results);
      },
*/
        var results = lines.slice(1).map(line => {
          var col = line.split('\t');
          if (col.length > 1) {
            var o = {};
            consts.forEach((c, i) => { o[c] = col[i]; });
            o.value = parseFloat(col[col.length - 1]);
            return o;
          } else if (col.length === 1) {
            return parseFloat(col[col.length - 1]);;
          } else {
            return null;
          }
        }).filter(val => val !== null && !Number.isNaN(val));

        if (results.length === 1) {
          results = results[0];
        }

        resolve(results);
      },

        err => reject(err)
      );
    });
  }

  function run(pctl, model) {
//    $rootScope.$apply(() => {
      status.status = "running";
      status.running = true;
      status.error = false;
      console.log('prism status changed', status);
//    });
    return PRISM(pctl, model).then(function (result) {
      $rootScope.$apply(() => {
        status.running = false;
        status.lastOutput = result[1];
        status.status = "done";
        console.log('prism status changed', status);
      });
      return result[0];
    }).catch(function (error) {
      $rootScope.$apply(() => {
        status.running = false;
        if (error.output) {
          status.lastOutput = error.output;
        } else {
          status.lastOutput = "error talking to the server";
        }

        status.error = true;
        status.status = "error";
        status.model = model;
        status.pctl = pctl;

        console.log('prism status changed', status);
      });
    });
  }

  function getStatusObject() {
    return status;
  }

  return {
    run: run,
    getStatusObject: getStatusObject,
  };
});
