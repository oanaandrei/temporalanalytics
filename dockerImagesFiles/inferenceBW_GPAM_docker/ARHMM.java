// 2016 Matthew Higgs 
/* ARHMM (Auto-Regressive Hidden Markov Model)
- A container for storing, initialisaing, and passing model parameters.
*/
import java.util.Random;

public class ARHMM{	
	int statNumb;
	int obsvNumb;
	double[] initProb;
	double[][] tranProb;
	double[][][] obsvProb;
	Object[] alphabet;
	Random random;

// ==== CONSTRUCTORS ====
	// Parameter initialisation constructor
	public ARHMM(int statNumb, int obsvNumb){
		this.statNumb = statNumb;
		this.obsvNumb = obsvNumb;
		this.generateParams(); // Just random for now, but improve.
	}
	// Parameterised constructor
	public ARHMM(double[] initProb, double[][] tranProb, double[][][] obsvProb){
		this.updateParams(initProb,tranProb,obsvProb);
	}
	// Copy construtor
	public ARHMM(ARHMM arhmm) {
		this.statNumb = arhmm.statNumb;
		this.obsvNumb = arhmm.obsvNumb;
	    this.initProb = arhmm.initProb;
		this.tranProb = arhmm.tranProb;
		this.obsvProb = arhmm.obsvProb;
	  }
	
	// Copy construtor
	public ARHMM(ARHMM arhmm, Object[] alphabet) {
		this.statNumb = arhmm.statNumb;
		this.obsvNumb = arhmm.obsvNumb;
	    this.initProb = arhmm.initProb;
		this.tranProb = arhmm.tranProb;
		this.obsvProb = arhmm.obsvProb;
		this.alphabet = alphabet;
	  }
	
	
// === update/get parameters ====
	public void updateParams(double[] initProb, double[][] tranProb, double[][][] obsvProb){
		this.initProb = initProb;
		this.tranProb = tranProb;
		this.obsvProb = obsvProb;
		this.statNumb = initProb.length;
		this.obsvNumb = obsvProb[0].length;
	}
	public int getStatNumb(){return statNumb;}
	public int getObsvNumb(){return obsvNumb;}
	public double[] getInitProb(){return initProb;}
	public double[][] getTranProb(){return tranProb;}
	public double[][][] getObsvProb(){return obsvProb;}
	public Object[] getAlphabet(){return alphabet;}
	
// === Parameter initialisations ========
	public void generateParams(){	
		Random random = new Random();
		double[] initProb = new double[statNumb];
		double[][] tranProb = new double[statNumb][statNumb];
		double[][][] obsvProb = new double[statNumb][obsvNumb][obsvNumb];
		double sum1 = 0.0;
		for(int i=0; i<statNumb; i++){
				initProb[i] = random.nextDouble();
				sum1 += initProb[i];
			double sum2 = 0.0;
			for(int j=0; j<statNumb; j++){
				tranProb[i][j] = random.nextDouble();
				sum2 += tranProb[i][j];
			}
			for(int j=0; j<statNumb; j++){
				tranProb[i][j] /= sum2;
			}
			for(int x=0; x<obsvNumb; x++){
				double sum3 = 0.0;
				for(int y=0; y<obsvNumb; y++){
					obsvProb[i][x][y] = random.nextDouble();
					sum3 += obsvProb[i][x][y];
				}
				for(int y=0; y<obsvNumb; y++){
					obsvProb[i][x][y] /= sum3;
				}
			}
		}	
		for(int i=0; i<statNumb; i++){
			initProb[i] /= sum1;
		}
		this.initProb = initProb;
		this.tranProb = tranProb;
		this.obsvProb = obsvProb;
	}
// === Sparsify parameters ===
	public void sparsify(double tau_stat, double tau_obsv){
		// Remove values less than epsilon and re-normalise
		double sum1 = 0.0;
		for(int i=0; i<statNumb; i++){
				if(initProb[i]< tau_stat){
					initProb[i] = 0;
				} else{
					sum1 += initProb[i];
				}
			double sum2 = 0.0;
			for(int j=0; j<statNumb; j++){
				if(tranProb[i][j]< tau_stat){
					tranProb[i][j] = 0;
				} else{
					sum2 += tranProb[i][j];
				}
			}
			for(int j=0; j<statNumb; j++){
				tranProb[i][j] /= sum2;
			}
			for(int x=0; x<obsvNumb; x++){
				double sum3 = 0.0;
				for(int y=0; y<obsvNumb; y++){
					if(obsvProb[i][x][y]< tau_obsv){
						obsvProb[i][x][y] = 0;
					} else{
						sum3 += obsvProb[i][x][y];
					}
				}
				for(int y=0; y<obsvNumb; y++){
					obsvProb[i][x][y] /= sum3;
				}
			}
		}	
		for(int i=0; i<statNumb; i++){
			initProb[i] /= sum1;
		}
		this.initProb = initProb;
		this.tranProb = tranProb;
		this.obsvProb = obsvProb;
	}
}




 