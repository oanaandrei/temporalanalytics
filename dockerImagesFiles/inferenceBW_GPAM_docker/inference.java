// 2016 Matthew Higgs 

// Import packages as required
import cc.mallet.util.*;
import cc.mallet.types.*;
import cc.mallet.pipe.*;
import cc.mallet.pipe.iterator.*;
import cc.mallet.topics.*;

import java.util.*;
import java.util.regex.*;
import java.io.*;

import java.util.Arrays;
import java.util.ArrayList;

public class inference {
	public static void main(String[] args) throws Exception{
		
		// Organise input parameters
		//=========================
		// -- Data, MODEL, number of states
		String DATAFILE = args[0];
		int STATNUMB = Integer.parseInt(args[1]);
		
		// -- Subsample, TRUNCATIONation
		int SAMPLESIZE = Integer.parseInt(args[2]);
		int TRUNCATION = Integer.parseInt(args[3]);
		
		// -- EM parameters 
		int NUM_RESTARTS = Integer.parseInt(args[4]); 
		int NUM_ITER_RESTARTS = Integer.parseInt(args[5]);
		int NUM_ITER_FINAL = Integer.parseInt(args[6]);
		double EPSILON = Double.parseDouble(args[7]);
		double TOLERANCE = Double.parseDouble(args[8]);
		
		// -- Sparisfy
		double TAU_STAT = Double.parseDouble(args[9]);
		double TAU_OBSV = Double.parseDouble(args[10]);
		
		
		// Prepare training data 
		//========================
		// -- Create file reader
		Reader fileReader = new InputStreamReader(new FileInputStream(new File(DATAFILE)), "UTF-8");
		CsvIterator iterator = new CsvIterator (fileReader, Pattern.compile("^(\\S*)[\\s,]*(.*)$"),2, 1, 1);
		
		// -- Add some pre-processing pipes to pre-processing pipeline
		ArrayList<Pipe> pipeList = new ArrayList<Pipe>();
		pipeList.add(new Input2CharSequence("UTF-8"));
		pipeList.add(new CharSequence2TokenSequence(Pattern.compile("\\p{L}[\\p{L}\\p{P}]+\\p{L}")));
		pipeList.add(new TokenSequence2FeatureSequence());
		
		// -- Create instance list and add through pre-processing pipeline
		InstanceList instances = new InstanceList (new SerialPipes(pipeList));
		instances.addThruPipe(iterator);
		Alphabet alphabet = instances.getAlphabet();
		int OBSVNUMB = alphabet.size();
		
		// -- Sub-sample users
		InstanceList sample = new InstanceList (new SerialPipes(pipeList));
		for(int n=0; n<Math.min(SAMPLESIZE,instances.size()); n++){
			sample.add(instances.get(n));
		}

		// -- Trim sequences
		ArrayList<int[]> training = new ArrayList<int[]>();
		for(Instance instance : sample){
			FeatureSequence tokens = (FeatureSequence) instance.getData();
			int[] sequence = tokens.getFeatures();
			int trim = Math.min(TRUNCATION,sequence.length);
			int[] sequenceTrimmed = new int[trim];
			for(int t=0; t<trim; t++){
				sequenceTrimmed[t] = sequence[t];
			}
			training.add(sequenceTrimmed);
			//System.out.println(Arrays.toString(sequenceTrimmed));
		}
		
		// Perform inference
		// =============================
		GlobalLearnerARHMM globalLearnerARHMM = new GlobalLearnerARHMM(STATNUMB,OBSVNUMB,training);
		globalLearnerARHMM.globalEM(NUM_RESTARTS,NUM_ITER_RESTARTS,NUM_ITER_FINAL,EPSILON,TOLERANCE,TAU_STAT,TAU_OBSV);

		PrintWriter pwA = new PrintWriter(new FileWriter("./output/globalEM_Alphabet.txt"));
		pwA.println(Arrays.toString(alphabet.toArray()));
		pwA.close();
		
	}
}