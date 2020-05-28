// devs: Mattias Rost (2015-2016), Dan Protopopescu (2017-2018), Oana Andrei (2016-2020) 

angular.module('app')

.factory('Analysis', function () {
  return {
    createDictionary: function (data) {
      var dictionary = [];
      data.forEach(
        user => user.sessions.forEach(
          session => session.forEach(
            use => getDictionaryIndex(use.data)
          )
        )
      );

      console.log('dictionary:'+dictionary);

      return dictionary;

      function getDictionaryIndex(word) {
        var i = dictionary.indexOf(word);
        if (i === -1) {
          dictionary.push(word);
          return dictionary.length - 1;
        } else {
          return i;
        }
      }
    },

      dtmc2prism: function (dtmc) {

	  function round(m) {
	      return m.map(function (r) {
      		  var row = r.map(v => (Number(v)).toFixed(2));
      		  var sum = d3.sum(row);
      		  return row.map(function (v) { return v / sum; });
    	      });
  	  }
	  dtmc = round(dtmc);

	  var str = "\ndtmc\n\n";
	  str += "const init_x = " + dictionary.indexOf("UseStart") + ";\n";
	  str += "\nmodule DTMC\n";
	  str += "  x:[0.." + (dtmc.length - 1) + "] init init_x;\n";
	  str += "\n";

	  for (var i = 0; i < dtmc.length; i++) {
	      var terms = [];
	      for (var j = 0; j < dtmc[i].length; j++) {
		  if (dtmc[i][j] != 0.0)
		      terms.push(dtmc[i][j] + ":(x'=" + j + ")");
	      }

	      if (terms.length > 0)
		  str += "  [] (x=" + i + ") -> " + terms.join(" + ") + ";\n";
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

	  return str;
    },

    createUserModels: function(cut) {
      var data = cut.data;
      var dictionary = [];
      data.forEach(
        user => user.sessions.forEach(
          session => session.forEach(
            use => getDictionaryIndex(use.data)
          )
        )
      );

      var matrixes = [];

      data.forEach(function(d) {
        var userTrace = concatSessions(d.sessions);
        var matrix = createEmptyMatrix();

        for (var i=0;i<userTrace.length-1;i++) {
            var from = getDictionaryIndex(userTrace[i].data);
            var to = getDictionaryIndex(userTrace[i+1].data);
            if (from==-1) console.log("missing ", userTrace[i].data);
            if (to==-1) console.log("missing ", userTrace[i+1].data);
            matrix[from][to]++;
        }

        matrixes.push(matrix);
      });

      return matrixes;

      function getDictionaryIndex(word) {
        var i = dictionary.indexOf(word);
        if (i === -1) {
          dictionary.push(word);
          return dictionary.length - 1;
        } else {
          return i;
        }
      }

      function createEmptyMatrix() {
          var m = [];
          for (var i=0;i<dictionary.length;i++) {
              var mm = [];
              for (var j=0;j<dictionary.length;j++) {
                  mm.push(0);
              }
              m.push(mm);
          }
          return m;
      }

      function concatSessions(sessions) {
          var trace = [];
          sessions.forEach(function(session) {
              session.forEach(function(action) {
                  trace.push(action);
              });
          });

          return trace;
      }

    },

    em: function (userModels, options) {

      console.log('running now EM');

      var k = options.k || 3;
      var restarts = options.restart || 100;
      var iterations = options.iterations || 100;

      return new Promise((resolve, reject) => {
        $.post(
          'https://..../docker.php',
          {
            task: 'em',
            files: [
              {
                name: 'data.json',
                content: JSON.stringify(userModels),
              },
            ],
            image: 'eminference',
	    emk: `${k}`,
            restarts: `${restarts}`,
            iterations: `${iterations}`,
            cmd: `/code/run.sh /data/data.json ${k} ${restarts} ${iterations}`,
            outputs: [
		// 
		'globalEM_parameters.txt',
		'globalEM_phi.txt',
		'globalEM_theta.txt',
		'globalEM_Alphabet.txt',
            ],
          }
        ).then(
          response => {
              var data = JSON.parse(response['stdout']);
              data.phi = data.phi.map(matrix => round(matrix));
              data.theta = round(data.theta);
              console.log(data);
              resolve(data);
          },
	    // 
	  res => (
	      {
		  phi: JSON.parse(res['globalEM_phi.txt']),
		  theta: JSON.parse(res['globalEM_theta.txt']),
		  dictionary: res['globalEM_Alphabet.txt'].split(/, /).map(s => s.replace(/\[|\]|\n/g, '')),
	      }),
          err => reject(err)
        );
      });

    },
  };
});


Promise.map = function (array, f) {
  return new Promise((resolve, reject, notify) => {
    var as = array.slice();
    var results = [];
    var i = 0;

    loop();

    function loop() {
      if (as.length > 0) {
        var a = as.splice(0,1)[0];
        f(a, i++).then(result => {
          results.push(result);
          loop();
        }).catch((e) => reject(e));
      } else {
        resolve(results);
      }
    }
  });
};

// removes user traces consisting of empty sessions, i.e., only UseStart and UseStop
function cleanData(data) {
  return data.filter(user => (
    user.sessions.filter(
      session => session.filter(
        use => use.data !== 'UseStart' && use.data !== 'UseStop'
      ).length > 0
    ).length > 0
  ));
}

function createCuts(timecuts, data) {
  return timecuts.map(cut => (
    {
      start: cut.start,
      end: cut.end,
      mindays: cut.mindays,
      data: cutData(data, cut),
    }
  ));

  function cutData(data, cut) {
    return data.map(user => {
      return {
        deviceid: user.deviceid,
        firstSeen: user.firstSeen,
        lastSeen: user.lastSeen,
        sessions: daydifference(user.firstSeen, user.lastSeen)>=cut.mindays ?
          user.sessions.filter(session => {
            var daysIn = days(session[0]);
            return daysIn >= cut.start && daysIn <= cut.end;
          }) :
          [],
      };
      function days(use) {
        return daydifference(user.firstSeen, use.timestamp);
      }
    }).filter(user => user.sessions.length > 0);

    function daydifference(t1, t2) {
      return Math.ceil((
        new Date(t2).getTime() -
        new Date(t1).getTime()
      ) / (24 * 3600 * 1000));
    }
  }
}

function round(m) {
  return m.map(function (r) {
    var row = r.map(function (v) { return (Number(v)).toFixed(2); });

    var sum = d3.sum(row);
    return row.map(function (v) { return v / sum; });
  });
}

var arhmmCounter = 0;
function performARHMM(arhmmParameters, cut) {

  console.log('called performARHMM(arhmmParameters, cut)');

  $('.progress').text('ARHMM ' + ++arhmmCounter + " / " + timecuts.length);
  return new Promise((resolve, reject) => {

    var inputData = cut.data.map(
      user => user.deviceid + ' ' +
        user.sessions.map(
          session => session.map(use => use.data).join(' ')
        ).join(' ')
    ).join('\n');

    $.post(
      'https://.../docker.php',
      {
        task: 'arhmm',
        files: [
          {
            name: 'input.txt',
            content: inputData,
          },
          {
            name: 'args.json',
            content: JSON.stringify(arhmmParameters),
          },
        ],
	timecut: JSON.stringify(timecuts),
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
      console.log('ok, arhmm done');
      resolve(result);
    });
  });
}

var counter = 0;
function PRISM(pctl, model) {
  console.log('running prism', pctl);
  $('.progress').text('PRISM ' + ++counter + ' / ' + (timecuts.length * PCTLs.length));
  return new Promise((resolve, reject) => {
    var prism = (model);
    var props = pctl.properties; //'const N;\nP = ? [F<=N y=4]\n';
    var args = pctl.arguments; //'-const N=50';
    $.post(
      'https://.../docker.php',
      {
        task: 'prism',
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
        // cmd: `prism /data/prism.model /data/prism.props ${args} -maxiters 100000 -exportresults /data/output.txt`,
        cmd: `/data/run.sh`,
        outputs: [
            'output.txt',
        ],
      }
    ).then(
      response => {
        if (response['output.txt'] === false) {
          reject({output: response['stdout']});

          return;
        }

        var lines = response['output.txt'].split('\n');

        var consts = lines[0].split('\t').slice(0, -1);

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

function makePRISMfromARHMM(data) {
var A = data.TranProb;
var B = data.ObsvProb;
var iota = data.InitProb;
var dictionary = data.Alphabet;

var str = "\ndtmc\n\n";

str += "const init_y = " + dictionary.indexOf("UseStart") + ";\n";

str += "\nmodule DTMC\n";

str += "  x:[0.." + A.length + "] init 0;\n";
// init value for y should be the id of UseStart on the alphabet
str += "  y:[0.." + (B[0].length-1) + "] init init_y;\n";
str += "\n";

var numHStates = A.length;
var numOStates = B[0].length;

var terms1 = [];
str += "  [] (x=0) & (y=init_y) -> ";

for (var k=0; k<numHStates; k++) {
    if (iota[k] !== 0) {
        terms1.push(iota[k] + ":(x'=" + (k+1) + ") & (y'=init_y)");
    }
}

if (terms1.length>0) {
    str += terms1.join(" + ") + ";\n";
}

for (var k=0;k<numHStates;k++) {
  for (var i=0;i<numOStates;i++) {
    var terms = [];
    for (var l=0;l<numHStates;l++) {
        for (var j=0;j<numOStates;j++) {
            if (A[k][l]*B[l][i][j] !== 0.0)
                terms.push(A[k][l]*B[l][i][j] + ":(x'=" + (l+1) + ")&(y'=" + j +")");
        }
    }
    if (terms.length>0) {
        str += "  [] (x=" + (k+1) + ") & (y=" + i + ") -> " + terms.join(" + ") + ";\n";
    }
  }
}
str += "endmodule\n";

str += "\n";

dictionary.forEach(function(word,i) {
    str += "label \"" + word + "\" = (y=" + i + ");\n";
});

str += "\n";

dictionary.forEach(function(word,i) {

     for (var k=0;k<numHStates;k++) {
    	str += "rewards \"r_" + word + "_AP" + (k+1) + "\"\n";
    	str += "  (y=" + i + ") & (x=" + (k+1) + ") : 1;\n";
	    str += "endrewards\n\n";
    }
});

str += "rewards \"r_Steps\"\n";
str += "	[] true : 1;\n";
str += "endrewards\n";

for (var k=0;k<numHStates;k++) {
	str += "rewards \"r_Steps_AP" + (k+1) + "\"\n";
	str += "	[] (x=" + (k+1) + ") : 1;\n";
	str += "endrewards\n\n";
}

  return str;
}

var PCTLs = 
[
  {
  	"name":"VP1_1_2",
  	"properties":"const int N; const int j2; const int j0; \nfilter(state,P=?[F<=N (y=j2)],y=j0)\n",
  	"arguments":"-const N=50,j2=0:1:15,j0=0:1:15"
  },
  {
  	"name":"VP1_3_4",
  	"properties":"const int N; const int j1; const int j2; const int j0; \nfilter(state,P=?[!(y=j1) U<=N (y=j2)],y=j0)\n",
  	"arguments":"-const N=50,j1=01:1:15,j2=0:1:15,j0=0:1:15"
  },  
  {
  	"name":"VP1_5",
  	"properties":"const int N; const int j1; const int j2; const int j0; \nfilter(state,P=?[(!(y=j1)&!\"UseStop\") U<=N (y=j2)],y=j0)\n",
  	"arguments":"-const N=50,j1=01:1:15,j2=0:1:15,j0=0:1:15"
  },
  {
  	"name":"SC1_1_2",
  	"properties":"const int N; const int j1; const int j0; \nfilter(state,R{\"r_Steps\"}=?[F (y=j1)],y=j0)\n",
  	"arguments":"-const N=50,j1=0:1:15,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_UseStart",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_UseStart\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_TermsAndConditions",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_TermsAndConditions\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATMainView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATMainView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATOverallUsageView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATOverallUsageView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATStackedBarsView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATStackedBarsView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATPeriodSelectorView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATPeriodSelectorView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATAppsInPeriodView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATAppsInPeriodView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATSettingsView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATSettingsView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_UseStop",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_UseStop\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATStatsView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATStatsView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATUsageBarChartATOverallUsageView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATUsageBarChartATOverallUsageView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATFeedbackView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATFeedbackView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATUsageBarChartATStatsView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATUsageBarChartATStatsView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATInfoView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATInfoView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATUsageBarChartATAppsInPeriodView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATUsageBarChartATAppsInPeriodView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  },  
  {
  	"name":"VC1_1_2_ATTaskView",
  	"properties":"const int N; const int j0; \nfilter(state,R{\"r_ATTaskView\"}=?[C<=N],y=j0)\n",
  	"arguments":"-const N=50,j0=0:1:15"
  } 
];

/*
var PCTLs = [

  {
    name: 'P1_ProbReach',
    properties: 'const N; const j; \nP = ? [F<=N y=j]\n',
    arguments: '-const N=50,j=0:1:15',
  },
  
  {
  	"name": "MAP_State2End",
  	"properties": "const int i; const int j; const double p; \nP>=1[F(x=i & y=j)] & P>=1[G((x=i & y=j) => P>=p[(x=i) U \"UseStop\"])]\n",
  	"arguments": "-const i=1:1:5,j=1:1:17,p=0:0.01:1"
  },
  
  {
  	"name": "MAP_State2Pattern",
  	"properties": "const int i; const int j; const int i1; const double p; \nP>=1[F(x=i & y=j)] & P>=1[F((x=i & y=j) & P>=p[X(!\"UseStop\" & x=i1)])]\n",
  	"arguments": "-const i=1:1:5,i1=1:1:5,j=1:1:17,p=0:0.01:1"
  },

 // hard-coded states for AppTracker1, be aware when analysing AppTracker2 models
 {
  	"name":"MAP_Response_StackedBars_PeriodSelector",
  	"properties":"const int i; const double p; \nP>=1[F ((y=4) & (x=i))] & P>=1[F ((y=5) & (x=i))] & P>=1[F((! ((y=4) & (x=i)) & !((y=5) & (x=i))) U P>=1[(((y=4) & (x=i)) & !((y=5) & (x=i))) U P>=p[X ((y=5) & (x=i))] ])]\n",
  	"arguments":"-const i=1:1:2,p=0:0.01:1"
  },

 // hard-coded states for AppTracker1, be aware when analysing AppTracker2 models
 {
  	"name":"MAP_Response_PeriodSelector_StackedBars",
  	"properties":"const int i; const double p; \nP>=1[F ((y=5) & (x=i))] & P>=1[F ((y=4) & (x=i))] & P>=1[F((! ((y=5) & (x=i)) & !((y=4) & (x=i))) U P>=1[(((y=5) & (x=i)) & !((y=4) & (x=i))) U P>=p[X ((y=4) & (x=i))] ])]\n",
  	"arguments":"-const i=1:1:2,p=0:0.01:1"
  },
  {
    name: 'P1_ProbReach_GPAM',
    properties: 'const N; const j; const i; \nP = ? [F<=N x=i & y=j]\n',
    arguments: '-const N=50,j=0:1:15,i=1:1:2',
  },

  {
  	name: 'P4_ReachFromStateToStateDuringSameSession_wPatterns',
  	properties: 'const j1; const j0; const i0; const i1; \nfilter(state, P=? [ (!y=7) U (x=i1 & y=j1)], x=i0 & y=j0)\n',
  	arguments: '-const j1=0:1:15,j0=0:1:15,i0=1:1:2,i1=1:1:2',
  },

  {
    name: 'P2_AvgSteps',
    properties: 'const j; \nR{"r_Steps"} = ? [F y=j]\n',
    arguments: '-const j=0:1:15',
  },

  {
    name: 'P2_AvgSteps_GPAM',
    properties: 'const j; const i; \nR{"r_Steps"} = ? [F x=i & y=j]\n',
    arguments: '-const j=0:1:15,i=1:1:2',
  },
  {
    name: 'P2_AvgSteps_GPAM_AP1',
    properties: 'const j; \nR{"r_Steps_AP1"} = ? [F x=1 & y=j]\n',
    arguments: '-const j=0:1:15',
  },
  {
    name: 'P2_AvgSteps_GPAM_AP2',
    properties: 'const j; \nR{"r_Steps_AP2"} = ? [F x=2 & y=j]\n',
    arguments: '-const j=0:1:15',
  },


  {
    name: 'P3_UseStart_GPAM_AP1',
    properties: 'const N; \nR{"r_UseStart_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_UseStart_GPAM_AP2',
    properties: 'const N; \nR{"r_UseStart_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },

  {
    name: 'P3_TermsAndConditions_GPAM_AP1',
    properties: 'const N; \nR{"r_TermsAndConditions_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_TermsAndConditions_GPAM_AP2',
    properties: 'const N; \nR{"r_TermsAndConditions_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },

  {
    name: 'P3_ATMainView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATMainView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATMainView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATMainView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },

  {
    name: 'P3_ATOverallUsageView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATOverallUsageView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATOverallUsageView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATOverallUsageView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },


  {
    name: 'P3_ATStackedBarsView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATStackedBarsView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATStackedBarsView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATStackedBarsView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },


  {
    name: 'P3_ATPeriodSelectorView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATPeriodSelectorView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATPeriodSelectorView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATPeriodSelectorView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },


  {
    name: 'P3_ATAppsInPeriodView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATAppsInPeriodView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATAppsInPeriodView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATAppsInPeriodView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },


  {
    name: 'P3_ATSettingsView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATSettingsView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATSettingsView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATSettingsView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },


  {
    name: 'P3_UseStop_GPAM_AP1',
    properties: 'const N; \nR{"r_UseStop_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_UseStop_GPAM_AP2',
    properties: 'const N; \nR{"r_UseStop_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },


  {
    name: 'P3_ATStatsView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATStatsView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATStatsView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATStatsView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },


  {
    name: 'P3_ATUsageBarChartATOverallUsageView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATUsageBarChartATOverallUsageView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATUsageBarChartATOverallUsageView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATUsageBarChartATOverallUsageView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },


  {
    name: 'P3_ATUsageBarChartATStatsView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATUsageBarChartATStatsView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATUsageBarChartATStatsView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATUsageBarChartATStatsView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },



  {
    name: 'P3_ATFeedbackView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATFeedbackView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATFeedbackView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATFeedbackView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },



  {
    name: 'P3_ATUsageBarChartATAppsInPeriodView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATUsageBarChartATAppsInPeriodView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATUsageBarChartATAppsInPeriodView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATUsageBarChartATAppsInPeriodView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },


  {
    name: 'P3_ATInfoView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATInfoView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATInfoView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATInfoView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },


  {
    name: 'P3_ATTaskView_GPAM_AP1',
    properties: 'const N; \nR{"r_ATTaskView_AP1"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },
  {
    name: 'P3_ATTaskView_GPAM_AP2',
    properties: 'const N; \nR{"r_ATTaskView_AP2"} = ? [C<=N]\n',
    arguments: '-const N=50',
  },


  {
  	name: 'P5a_AvgStepsFromStateToState',
  	properties: 'const j1; const j0; const i0; \nfilter(state, R{"r_Steps"}=?[F y=j1], y=j0 & x=i0)\n',
  	arguments: '-const j1=0:1:15,j0=0:1:15,i0=1:1:2',
  },
  {
  	name: 'P5b_AvgStepsFromStateToState_GPAM_bis',
  	properties: 'const j1; const j0; const i0; const i1; \nfilter(state, R{"r_Steps"}=?[F x=i1 & y=j1], x=i0 & y=j0)\n',
  	arguments: '-const j1=0:1:15,j0=0:1:15,i0=1:1:2,i1=1:1:2',
  },
  {
  	name: 'P5c_AvgStepsFromStateToState_GPAM_AP1',
  	properties: 'const j1; const j0; const i1; \nfilter(state, R{"r_Steps_AP1"}=?[F x=i1 & y=j1], x=1 & y=j0)\n',
  	arguments: '-const j1=0:1:15,j0=0:1:15,i1=1:1:2',
  },
  {
  	name: 'P5d_AvgStepsFromStateToState_GPAM_AP2',
  	properties: 'const j1; const j0; const i1; \nfilter(state, R{"r_Steps_AP2"}=?[F x=i1 & y=j1], x=2 & y=j0)\n',
  	arguments: '-const j1=0:1:15,j0=0:1:15,i1=1:1:2',
  },

];
*/ 




var timecuts = [
  {
    start: 0,
    end: 1,
    mindays: 1,
  },
//  {
//   start: 31,
//    end: 60,
//    mindays: 60,
//  },
];

var arhmmParameters = {
  "STATNUMB": 3,
  "NUM_RESTARTS": 200,
  "NUM_ITER_RESTARTS": 100,
  "NUM_ITER_FINAL": 100,
};
