var child_process = require('child_process');

var options = require('/data/args.json');

var DATAFILE='/data/input.txt';
var STATNUMB = options.STATNUMB || 8;
var SAMPLESIZE=options.SAMPLESIZE || 500;
var TRUNCATION=options.TRUNCATION || 500;
var NUM_RESTARTS=options.NUM_RESTARTS || 5;
var NUM_ITER_RESTARTS=options.NUM_ITER_RESTARTS || 100;
var NUM_ITER_FINAL=options.NUM_ITER_FINAL || 100;
var EPSILON=options.EPSILON || 10e-6;
var TOLERANCE=options.TOLERANCE || 10e-8;
var TAU_STAT=options.TAU_STAT || 10e-4;
var TAU_OBVS=options.TAU_OBVS || 10e-4;

// rm ./output/*

var args = [
	'-cp',
	'.:mallet.jar:trove-2.0.2.jar:gson-2.3.jar',
	'inference',
	DATAFILE,
	STATNUMB,
	SAMPLESIZE,
	TRUNCATION,
	NUM_RESTARTS,
	NUM_ITER_RESTARTS,
	NUM_ITER_FINAL,
	EPSILON,
	TOLERANCE,
	TAU_STAT,
	TAU_OBVS
];

child_process.execFile('java', args);

