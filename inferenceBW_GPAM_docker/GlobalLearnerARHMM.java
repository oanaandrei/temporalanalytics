// 2016 Matthew Higgs 

import java.util.ArrayList;
import java.io.IOException;
import java.io.FileWriter;
import java.io.PrintWriter;

import java.util.Arrays;

public class GlobalLearnerARHMM extends LearnerARHMM {
	
	public GlobalLearnerARHMM(int statNumb, int obsvNumb, ArrayList<int[]> sequenceList){
		super(statNumb,obsvNumb,sequenceList);
	}
	
	public void globalEM(int numRestarts, int numIterRestarts, int numIterFinal, double epsilon, double tol, double tau_stat, double tau_obsv) throws IOException {
		// Pre-allocate "best-so-far" model
		LearnerARHMM best = new LearnerARHMM(statNumb,obsvNumb,sequenceList);
		PrintWriter pw = new PrintWriter(new FileWriter("./output/globalEM_loglikelihood.txt"));
		
		for(int r=1; r<=numRestarts; r++){
			System.out.println("Restart:"+r);
			generateParams();
			em(numIterRestarts, epsilon, tol, "./output/em_restart_"+r+"_loglikelihood.txt");
			if(logLikelihood>best.getLogLikelihood()){
				best.updateParams(initProb,tranProb,obsvProb);	
			}	
			pw.println(r+","+best.getLogLikelihood());
		}
		best.em(numIterFinal, epsilon, tol, "./output/em_best_loglikelihood.txt");
		System.out.println("Iterate best:");
		pw.println((numRestarts+1)+","+best.getLogLikelihood());
		
		System.out.println("Sparsify best:");
		best.sparsify(tau_stat,tau_obsv);
		pw.println((numRestarts+2)+","+best.getLogLikelihood());
		pw.close();
		
		// Print individual parameters to 
		PrintWriter pwIP = new PrintWriter(new FileWriter("./output/globalEM_InitProb.txt"));
		pwIP.println(Arrays.toString(best.getInitProb()));
		pwIP.close();
		PrintWriter pwTP = new PrintWriter(new FileWriter("./output/globalEM_TranProb.txt"));
		pwTP.println(Arrays.deepToString(best.getTranProb()));
		pwTP.close();
		PrintWriter pwOP = new PrintWriter(new FileWriter("./output/globalEM_ObsvProb.txt"));
		pwOP.println(Arrays.deepToString(best.getObsvProb()));
		pwOP.close();
	}
}
