// 2016 Matthew Higgs 

/* An optimised version of Learner ARHMM */
import java.util.ArrayList;
import java.util.Arrays;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.FileWriter;

public class LearnerARHMM extends ARHMM {
	int seqNumb;
	ArrayList<int[]> sequenceList;
	double[] globalInitExpect;
	double[][] globalTranExpect;
	double[][][] globalObsvExpect;
	double logLikelihood;
	double logPerplexity;
	
	public LearnerARHMM(int statNumb, int obsvNumb, ArrayList<int[]> sequenceList){
		super(statNumb,obsvNumb);
		this.statNumb = statNumb;
		this.obsvNumb = obsvNumb;
		this.seqNumb = sequenceList.size();
		this.sequenceList = sequenceList;
		this.expectation();
	}
	
	public LearnerARHMM(ARHMM arhmm, ArrayList<int[]> sequenceList){
		super(arhmm);
		this.statNumb = statNumb;
		this.obsvNumb = obsvNumb;
		this.seqNumb = sequenceList.size();
		this.sequenceList = sequenceList;
		this.expectation();
	}
	
	public int getSeqNumb(){return seqNumb;}
	public ArrayList<int[]> getSequenceList(){return sequenceList;}
	public double[] getInitExpect(){expectation(); return globalInitExpect;}
	public double[][] getTranExpect(){expectation(); return globalTranExpect;}
	public double[][][] getObsvExpect(){expectation(); return globalObsvExpect;}
	public double getLogLikelihood(){expectation(); return logLikelihood;}
	public double getLogPerplexity(){expectation(); return -logLikelihood/seqNumb;}
	
	public void em(int maxIter, double epsilon, double tol, String filepath) throws IOException {
		double delta = 2*tol;
		int iter = 0;
		
		PrintWriter pw = new PrintWriter(new FileWriter(filepath));
		while (delta > tol && iter <= maxIter) {
			double oldLogLikelihood = logLikelihood;
			expectation();
			maximisation(epsilon);
			if(iter>0){
				delta = Math.abs(oldLogLikelihood-logLikelihood)/Math.abs(oldLogLikelihood);
				pw.println(iter+","+logLikelihood);
			}
			iter++;
			//System.out.println(iter+","+logLikelihood);
		}
		pw.close();
	}
	
	public void maximisation(double epsilon){
		double sum1 = 0.0;
		for(int i=0; i<statNumb; i++){
			initProb[i] = globalInitExpect[i] + epsilon;
			sum1 += initProb[i];
		}
		for(int i=0; i<statNumb; i++){
			initProb[i] /= sum1;
		}
		for(int i=0; i<statNumb; i++){
			double sum2 = 0.0;
			for(int j=0; j<statNumb; j++){
				tranProb[i][j] = globalTranExpect[i][j] + epsilon;
				sum2 += tranProb[i][j];
			}
			for(int j=0; j<statNumb; j++){
				tranProb[i][j] /= sum2;
			}
		}
		for(int i=0; i<statNumb; i++){
			for(int x=0; x<obsvNumb; x++){	
				double sum3 = 0.0;	
				for(int y=0; y<obsvNumb; y++){				
					obsvProb[i][x][y] = globalObsvExpect[i][x][y] + epsilon;
					sum3 += obsvProb[i][x][y];
				}		
				for(int y=0; y<obsvNumb; y++){				
					obsvProb[i][x][y] /= sum3;
				}
			}
		}
	}
	
	public void expectation(){
		double[] globalInitExpect = new double[statNumb];
		double[][] globalTranExpect = new double[statNumb][statNumb];
		double[][][] globalObsvExpect = new double[statNumb][obsvNumb][obsvNumb];
		double logLikelihood = 0.0;
		double logPerplexity = 0.0;
		for(int n=0; n<seqNumb; n++){
			int[] sequence = sequenceList.get(n);
			int seqLength = sequence.length;
			double[] frontProb = new double[seqLength];
			double[][] fwdMessage = new double[seqLength][statNumb];
			double[][] bwdMessage = new double[seqLength][statNumb];
			// Forward pass
			for(int i=0; i<statNumb; i++){ // Create p(x_t)
				fwdMessage[0][i] = initProb[i];
			} // NB: p(y_1) = 1
			frontProb[0]=1; 
			double localLogLikelihood = 0.0;
			for(int t=1; t<seqLength; t++){
				frontProb[t]=0.0;
				for(int j=0; j<statNumb; j++){ // Create p(x_t|y_{<t})
					for(int i=0; i<statNumb; i++){
						fwdMessage[t][j] += fwdMessage[t-1][i] * tranProb[i][j];
					} // Create p(x_t,y_t|y_{<t})
					fwdMessage[t][j] *= obsvProb[j][sequence[t-1]][sequence[t]];
					frontProb[t] += fwdMessage[t][j];
				} // Create p(x_t|y_{<=t})
				for(int j=0; j<statNumb; j++){ 
					fwdMessage[t][j] /= frontProb[t];
				}
				logLikelihood += Math.log(frontProb[t]);
			}

			// Backward pass
			for(int i=0; i<statNumb; i++){
				bwdMessage[seqLength-1][i] = 1;
			}
			for(int t=seqLength-2; t>=0; t--){
				for(int i=0; i<statNumb; i++){
					for(int j=0; j<statNumb; j++){
						bwdMessage[t][i] += bwdMessage[t+1][j] * tranProb[i][j] * obsvProb[j][sequence[t]][sequence[t+1]];
					}
					bwdMessage[t][i] /= frontProb[t+1];
				}
			}

			// Just one pass through time (after forwards-backwards!)
			for(int t=0; t<seqLength-1; t++){
				double sum1 = 0.0;
				double sum2 = 0.0;
				// Compute marginals
				double[] oneSliceMarginal = new double[statNumb];
				double[][] twoSliceMarginal = new double[statNumb][statNumb];
				for(int i=0; i<statNumb; i++){
					oneSliceMarginal[i] = fwdMessage[t][i]*bwdMessage[t][i];
					sum1 += oneSliceMarginal[i];
					for(int j=0; j<statNumb; j++){
						twoSliceMarginal[i][j] = fwdMessage[t][i]*tranProb[i][j]*obsvProb[j][sequence[t]][sequence[t+1]]*bwdMessage[t+1][j];
						sum2 += twoSliceMarginal[i][j];
					}
				}
				// Normalise and update
				if(t==0){
					for(int i=0; i<statNumb; i++){
						oneSliceMarginal[i] /= sum1;
						globalInitExpect[i] = oneSliceMarginal[i];
						for(int j=0; j<statNumb; j++){
							twoSliceMarginal[i][j] /= sum2;
							globalTranExpect[i][j] += twoSliceMarginal[i][j];
						}
					}
				}else{
					for(int i=0; i<statNumb; i++){
						oneSliceMarginal[i] /= sum1;
						globalObsvExpect[i][sequence[t-1]][sequence[t]] += oneSliceMarginal[i];
						for(int j=0; j<statNumb; j++){
							twoSliceMarginal[i][j] /= sum2;
							globalTranExpect[i][j] += twoSliceMarginal[i][j];
						}
					}
				}	
			}
			// Last step
			double sum1 = 0.0;
			double[] oneSliceMarginal = new double[statNumb];
			for(int i=0; i<statNumb; i++){
				oneSliceMarginal[i] = fwdMessage[seqLength-1][i]*bwdMessage[seqLength-1][i];
				sum1 += oneSliceMarginal[i];
			}
			for(int i=0; i<statNumb; i++){
				oneSliceMarginal[i] /= sum1;
				globalObsvExpect[i][sequence[seqLength-2]][sequence[seqLength-1]] += oneSliceMarginal[i];
			}
			logLikelihood += localLogLikelihood;
			logPerplexity += localLogLikelihood/seqLength;
		}
		this.globalInitExpect = globalInitExpect;
		this.globalTranExpect = globalTranExpect;
		this.globalObsvExpect = globalObsvExpect;
		this.logLikelihood = logLikelihood;
		this.logPerplexity = logPerplexity/seqNumb;
	}
	
	public double getLogTestPerplexity(ArrayList<int[]> testing){
		double logTestPerplexity = 0.0;
		double num = 0.0;
		for(int[] sequence : testing) {
			int seqLength = sequence.length;
			double[] frontProb = new double[seqLength];
			double[][] fwdMessage = new double[seqLength][statNumb];
			// Forward pass
			for(int i=0; i<statNumb; i++){ // Create p(x_t)
				fwdMessage[0][i] = initProb[i];
			} // NB: p(y_1) = 1
			frontProb[0]=1; 
			double logLikelihood = 0.0;
			for(int t=1; t<seqLength; t++){
				frontProb[t]=0.0;
				for(int j=0; j<statNumb; j++){ // Create p(x_t|y_{<t})
					for(int i=0; i<statNumb; i++){
						fwdMessage[t][j] += fwdMessage[t-1][i] * tranProb[i][j];
					} // Create p(x_t,y_t|y_{<t})
					fwdMessage[t][j] *= obsvProb[j][sequence[t-1]][sequence[t]];
					frontProb[t] += fwdMessage[t][j];
				} // Create p(x_t|y_{<=t})
				for(int j=0; j<statNumb; j++){ 
					fwdMessage[t][j] /= frontProb[t];
				}
				logLikelihood += Math.log(frontProb[t]);
			}
			logTestPerplexity += -logLikelihood;
			num += (double)(seqLength-1);
		}
		return logTestPerplexity/num;
	}
}