The input file (first argument in the run.sh file) is the transition occurrence matrices for the set of user traces.

For example if the user traces are [aaaaaaaaaababab, ba], the alphabet (or state labels) is A=[a, b] then the transition occurrence matrices are 
[
	[
		[10,3],
		[2,0]
	],
	[
		[1,0],
		[0,1]
	]
]

where on the position (i,j) on the transition occurence matrix of a trace l we have the number of occurrence of the bigram A[i]A[j] in the trace l.
In this example there are 10 occurrences of aa in the first trace, 3 occurrence of ab, 2 occurrence of ba, and 0 occurrences of bb. 

When creating a docker image, name it "eminference".