// Oana Andrei July 2020
// Generate a json file with VisitCountInit properties for each state label in the dictionary taken from the PAM/GPAM model in json format as input

var fs = require('fs');


if (process.argv.length<5) {
  console.log('Usage: node model2VisitCountProps.js GPAMmodel.json [PAM|GPAM] [json|prism] N ');
  // in the GPAM model the dictionary is called "Alphabet"
  // in the PAM model the dictionary is called "dictionary"
  // N is the time bound used in the VisitCount property
  return;
}

fs.readFile(process.argv[2], function(err, data) {
  if (err) {
    console.log('error', err);
    return;
  }

  var data = JSON.parse(data);

  var modelType = process.argv[3];
  var formatType = process.argv[4];

  var N = process.argv[5];

  // number of activity patterns
  var K = 0;
  // number of observed states / DTMC labels
  var nStates = 0;
  // the set of observed state labels
  var dictionary = new Array();

  if (modelType.indexOf("GPAM") == 0) {
  	dictionary = data[0].arhmmmodel.Alphabet;
  	K = data[0].arhmmmodel.InitProb.length;
  	nStates = dictionary.length;
  }
  else if (modelType.indexOf("PAM") == 0) {
  	dictionary = data[0].dictionary;
  	K = data[0].emmodel.theta[0].length;
  	nStates = dictionary.length;
  }
  else {
	  console.log('Usage: node model2VisitCountProps.js GPAMmodel.json [PAM|GPAM] [json|prism] N ');
	  // in the GPAM model the dictionary is called "Alphabet"
	  // in the PAM model the dictionary is called "dictionary"
	  return;
  }

  var nameString;
  var propertiesString;
  var argumentsString;

  var jsonVisitCountInitProps = "[\n";

  // separate first property so that the rest of them to start with a comma
  nameString = "\"VisitCountInit\_" + dictionary[0] + "\"";
  propertiesString = "\"const int N; \\nR{" + "\\" + "\"" +  "r_" + dictionary[0] + "\\" + "\"}=?[C<=N]" + "\\n\"";
  argumentsString = "\"-const N=" + N + "\"";

  jsonVisitCountInitProps += "\t{\n" + "\t\t\"name\":"+ nameString + ",\n" + "\t\t\"properties\":" + propertiesString + ",\n" + "\t\t\"arguments\":" + argumentsString + "\n\t}";

  for (i = 1; i < nStates; i++) {
  	nameString = "\"VisitCountInit\_" + dictionary[i] + "\"";
  	propertiesString = "\"const int N; \\nR{" + "\\" + "\"" +  "r_" + dictionary[i] + "\\" + "\"}=?[C<=N]" + "\\n\"";
  	argumentsString = "\"-const N=" + N + "\"";

  	jsonVisitCountInitProps += ",\n\t{\n" + "\t\t\"name\":"+ nameString + ",\n" + "\t\t\"properties\":" + propertiesString + ",\n" + "\t\t\"arguments\":" + argumentsString + "\n\t}";
  }

  jsonVisitCountInitProps += "\n]";



  var prismVisitCountInitProps = "const int N;\n";
  for (i = 0; i < nStates; i++) {
  	prismVisitCountInitProps += "R{\"r_" + dictionary[i] + "\"}=?[C<=N]\n\n";
  }

  if (formatType.indexOf("json") == 0) {
  	console.log(jsonVisitCountInitProps);

  }
  else if (formatType.indexOf("prism") == 0) {
  	console.log(prismVisitCountInitProps);
  }
  else {
  	console.log('Usage: node model2VisitCountProps.js GPAMmodel.json [PAM|GPAM] [json|prism] N ');
  }
});
