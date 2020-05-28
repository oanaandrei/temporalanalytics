// 2014 Matthew Higgs 

//import py4j.GatewayServer;
import java.util.Random;
import java.lang.Math;
import org.json.*;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.io.IOException;

public class InferenceEntryPoint {

	public static void main(String[] args) {
		if (args.length<2) {
			System.out.println("Usage: cat data.json | java InferenceEntryPoint <K> <maxRestarts>");
			return;
		}

		String input;
		try {
			input = readInput();
		} catch (IOException ioe) {
			System.out.println("Error reading input");
			return;
		}

		JSONArray o = new JSONArray(input);

		int k = Integer.parseInt(args[0]);
		int maxRestarts = Integer.parseInt(args[1]);
		int maxIterations = Integer.parseInt(args[2]);
		double[][][] data;

		data = new double[o.length()][][];
		for (int i=0;i<o.length();i++) {
			data[i] = readMatrix(o.getJSONArray(i));
		}

		InferenceEntryPoint algo = new InferenceEntryPoint();
		algo.admixtureModel(data, k, maxRestarts, maxIterations);
		algo.computeEM();

		double[][][] phi = algo.getPhi();
		double[][] theta = algo.getTheta();

//		System.out.println(JSON.toString(phi));
		System.out.println("{\"phi\":" + JSON.toString(phi) + ",\"theta\":" + JSON.toString(theta) + "}");
	}

	static String readInput() throws IOException {
		InputStreamReader isr = new InputStreamReader(System.in);
		BufferedReader reader = new BufferedReader(isr);
		String line = null;
		StringBuffer buffer = new StringBuffer();
		while ((line = reader.readLine()) != null) {
			buffer.append(line);
		}
		return buffer.toString();
	}

	static double[][] readMatrix(JSONArray a) {
		double[][] m = new double[a.length()][];

		for (int i=0;i<a.length();i++) {
			JSONArray a2 = a.getJSONArray(i);
			m[i] = new double[a2.length()];
			for (int j=0;j<a2.length();j++) {
				m[i][j] = a2.getDouble(j);
			}
		}

		return m;
	}

	static class JSON {
		static String toString(double[] array) {
			String s = "[";
			for (int i=0;i<array.length-1;i++) {
				s += array[i] + ", ";
			}
			if (array.length>0)
				s += array[array.length-1];

			s += "]";
			return s;
		}

		static String toString(double[][] array) {
			String s = "[";
			for (int i=0;i<array.length-1;i++) {
				s += toString(array[i]) + ", ";
			}
			if (array.length>0)
				s += toString(array[array.length-1]);

			s += "]";
			return s;
		}

		static String toString(double[][][] array) {
			String s = "[";
			for (int i=0;i<array.length-1;i++) {
				s += toString(array[i]) + ", ";
			}
			if (array.length>0)
				s += toString(array[array.length-1]);

			s += "]";
			return s;
		}
	}

	private static double[][] createMatrix() {
		int numStates = 3;

		double[][] m = new double[numStates][];
		for (int i=0;i<numStates;i++) {
			m[i] = new double[numStates];
			for (int j=0;j<numStates;j++) {
				m[i][j] = i==j?1:0;
			}
		}

		return m;
	}

	// === JAVA DECLARATIONS ===
	// - data variables -
	private double[][][] GroupedBigramCounts;
	private int L;
	private int M;

	// - model variables -
	private double[][][][] Psi;
	private double[][][] Phi;
	private double[][] Theta;
	private int K;

	// - EM variables -
	private double loglike;
	private double eps = 1e-6;
	private double tolerance = 1e-8;
	private int maxIterations = 100;
	Random r = new Random();

	// - EM restart variables -
	private int maxRestarts = 1000;
	private double[][][][] Psi_best;
	private double[][][] Phi_best;
	private double[][] Theta_best;
	private double loglike_best;

	// - implementation variables -
	private double sum;
	private double val;
	private double last;

	// === CONSTRUCTOR ===
	public void admixtureModel(double[][][] GroupedBigramCounts, int K, int restarts, int maxIterations) {
		this.GroupedBigramCounts = GroupedBigramCounts;
		this.L = this.GroupedBigramCounts[0].length;
		this.M = this.GroupedBigramCounts.length;
		this.K = K;

		this.maxRestarts = restarts;
		this.maxIterations = maxIterations;
	}

	// === EM-ALGORITHM (with restarts) ===
	public void computeEM() {

		this.loglike_best = -Double.MAX_VALUE;

		for (int startNum = 0; startNum < maxRestarts; startNum ++) {
			this.initPsi();
			this.initPhi();
			this.initTheta();
			this.logLikeFunc();

			// - EM algorithm -
			for (int iter = 0; iter < maxIterations; iter++) {
				this.updatePsi();
				this.updatePhi();
				this.updateTheta();

				last = this.loglike;
				if (Math.abs(last-this.logLikeFunc()) < tolerance) {
					break;
				}
			}

			// - store best parameters so far -
			if (this.loglike > this.loglike_best) {
				this.loglike_best = this.loglike;
				this.Psi_best = this.Psi;
				this.Phi_best = this.Phi;
				this.Theta_best = this.Theta;
			}
		}

		// - output best parameters -
		this.Psi = this.Psi_best;
		this.Phi = 	this.Phi_best;
		this.Theta = this.Theta_best;
	}

	// === get parameters ===
	public double[][][][] getPsi(){
		return this.Psi;
	}
	public double[][][] getPhi(){
		return this.Phi;
	}
	public double[][] getTheta(){
		return this.Theta;
	}

	// === log-likelihood function ===
	public double logLikeFunc() {
		sum = 0.0;
		for (int m = 0; m < M; m++) {
			for (int i = 0; i < L; i++) {
				for (int j = 0; j < L; j++) {
					val = 0.0;
					for (int k = 0; k < K; k++) {
						val += this.Theta[m][k]*this.Phi[k][i][j];
					}
					if (val > 0) {
						sum += this.GroupedBigramCounts[m][i][j]*Math.log(val);
					}
				}
			}
		}
		this.loglike = sum;
		return sum;
	}

	// === EM initilisations ===
	// - initPsi -
	private void initPsi() {
		double[][][][] Psi_raw = new double[M][L][L][K];
		this.Psi = Psi_raw;
	}

	// - initPhi -
	private void initPhi() {
		double[][][] Phi_raw = new double[K][L][L];
		for (int k = 0; k < K; k++) {
			for (int i = 0; i < L; i++) {
				sum = 0.0;
				for (int j = 0; j < L; j++) {
					val = r.nextDouble();
					Phi_raw[k][i][j] = val;
					sum += val;
				} // normalise over j
				Phi_raw[k][i] = normaliseVector(Phi_raw[k][i],sum);
			}
		}
		this.Phi = Phi_raw;
	}

	// - initTheta -
	private void initTheta() {
		double[][] Theta_raw = new double[M][K];
		for (int m = 0; m < M; m++) {
			sum = 0.0;
			for (int k = 0; k < K; k++) {
				val = r.nextDouble();
				Theta_raw[m][k] = val;
				sum += val;
			} // normalise over k
			Theta_raw[m] = normaliseVector(Theta_raw[m],sum);
		}
		this.Theta = Theta_raw;
	}

	// === auxiliaries ===
	// - normaliseVector -
	private double[] normaliseVector(double[] vector, double sum){
		double div = 1.0 / sum;
		for(int i=0; i<vector.length; i++){
			vector[i] *= div;
		}
		return vector;
	}

	// === EM updates ===
	// - updatePsi - (eq 9)
	public void updatePsi() {
		for (int m = 0; m < M; m++) {
			for (int i = 0; i < L; i++) {
				for (int j = 0; j < L; j++) {
					sum = 0.0;
					for (int k = 0; k < K; k++) {
						val = this.Theta[m][k]*this.Phi[k][i][j];
						val = val + eps;
						this.Psi[m][i][j][k] = val;
						sum += val;

					} // normalise over k
					this.Psi[m][i][j] = normaliseVector(this.Psi[m][i][j],sum);
				}
			}
		}
	}

	// - updatePhi - (eq 10)
	public void updatePhi() {
		for (int k = 0; k < K; k++) {
			for (int i = 0; i < L; i++) {
				sum = 0.0;
				for (int j = 0; j < L; j++) {
					val = 0.0;
					for (int m = 0; m < M; m++) {
						val += GroupedBigramCounts[m][i][j]*this.Psi[m][i][j][k];
					}
					val = val + eps;
					this.Phi[k][i][j] = val;
					sum += val;
				} // normalise over j
				this.Phi[k][i] = normaliseVector(this.Phi[k][i],sum);
			}
		}
	}

	// - updateTheta - (eq 11)
	public void updateTheta() {
		for (int m = 0; m < M; m++) {
			sum = 0.0;
			for (int k = 0; k < K; k++) {
				val = 0.0;
				for (int i = 0; i < L; i++) {
					for (int j = 0; j < L; j++) {
						val += GroupedBigramCounts[m][i][j]*this.Psi[m][i][j][k];
					}
				}
				val = val + eps;
				this.Theta[m][k] = val;
				sum += val;
			} // normalise over k
			this.Theta[m] = normaliseVector(this.Theta[m],sum);
		}
	}

}
