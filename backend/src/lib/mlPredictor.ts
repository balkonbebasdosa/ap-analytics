import { spawn, ChildProcess } from "child_process";
import path from "path";
import { EventEmitter } from "events";
import { fetchZoneLive, type ZoneResult } from "./zoneService";
import { getBusinessFeedback } from "./feedbackGenerator";

export type { ZoneResult };

export interface MLAnalysisInput {
  businessName: string;
  category: string;
  concept: string;
  products: Array<{ name: string; price: number }>;
  goals: string[];
  location: { lat: number; lng: number; address: string };
  radiusMeters: number;
  competitors: Competitor[];
}

export interface Competitor {
  name: string;
  type: string;
  rating: number | null;
  userRatingsTotal: number | null;
  vicinity: string;
  distanceMeters: number;
}

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AnalysisResult {
  swot: SwotAnalysis;
  successScore: number;
  scoreBreakdown: {
    competitionDensity: number;
    locationAppeal: number;
    marketDemand: number;
    conceptUniqueness: number;
  };
  strategicRoadmap: {
    differentiation: string[];
    pricing: string[];
    marketing: string[];
  };
  summary: string;
  zone?: ZoneResult;
}

const ML_TIMEOUT_MS = 60000;
const ZONE_TIMEOUT_MS = 3000;

let pythonProcess: ChildProcess | null = null;
const eventEmitter = new EventEmitter();
eventEmitter.setMaxListeners(50);

function getPythonProcess() {
  if (!pythonProcess) {
    const scriptPath = path.resolve(__dirname, "../../src/lib/bvi_predictor.py");
    const fallbackPath = path.join(__dirname, "bvi_predictor.py");
    const resolvedScript = require("fs").existsSync(scriptPath) ? scriptPath : fallbackPath;
    const pythonCmd = process.platform === "win32" ? "py" : "python3";

    pythonProcess = spawn(pythonCmd, [resolvedScript]);

    let buffer = "";
    pythonProcess.stdout?.on("data", (data) => {
      buffer += data.toString();
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.trim()) {
          try {
            const result = JSON.parse(line);
            eventEmitter.emit("prediction", result);
          } catch {
            console.error("Failed to parse python output:", line);
          }
        }
      }
    });

    pythonProcess.stderr?.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      console.log(`Python process exited with code ${code}`);
      pythonProcess = null;
      eventEmitter.emit("process_closed");
    });
  }
  return pythonProcess;
}

getPythonProcess();

export async function runMLAnalysis(input: MLAnalysisInput): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const proc = getPythonProcess();
    if (!proc || !proc.stdin) {
      return reject(new Error("Python process not available."));
    }

    const requestId = Date.now().toString() + Math.random().toString();
    let settled = false;

    const cleanup = () => {
      eventEmitter.removeListener("prediction", predictionHandler);
      eventEmitter.removeListener("process_closed", closedHandler);
    };

    const predictionHandler = (result: any) => {
      if (result.id !== requestId) return;
      if (settled) return;
      settled = true;
      cleanup();

      if (result.status === "error") {
        reject(new Error("ML Model Error: " + result.message));
        return;
      }

      const preds = result.predictions;
      const pythonZone = result.zone as ZoneResult | undefined;
      const { lat, lng } = input.location;

      const baseResult: AnalysisResult = {
        successScore: Math.round(preds.success_score),
        scoreBreakdown: {
          competitionDensity: Math.round(preds.competition_density_score),
          locationAppeal: Math.round(preds.location_appeal_score),
          marketDemand: Math.round(preds.market_demand_score),
          conceptUniqueness: Math.round(preds.concept_uniqueness_score),
        },
        swot: {
          strengths: ["Konsep tervalidasi secara lokal", "Positioning berbasis data"],
          weaknesses: ["Perlu pemantauan pasar berkelanjutan", "Risiko sebagai pemain baru"],
          opportunities: ["Permintaan lokal teridentifikasi", "Peluang untuk penawaran unik"],
          threats: ["Persaingan lokal yang sudah ada", "Perubahan preferensi konsumen"],
        },
        strategicRoadmap: {
          differentiation: ["Tekankan aspek unik dari konsep bisnis Anda"],
          pricing: ["Pantau rata-rata harga lokal secara cermat"],
          marketing: ["Fokus pada promosi yang relevan untuk area sekitar"],
        },
        summary: getBusinessFeedback(input.concept, Math.round(preds.success_score)),
        zone: pythonZone,
      };

      fetchZoneLive(lat, lng)
        .then((liveZone) => {
          resolve({
            ...baseResult,
            zone: liveZone.zone_label !== "UNKNOWN" ? liveZone : pythonZone,
          });
        })
        .catch(() => {
          resolve(baseResult);
        });
    };

    const closedHandler = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Python process closed unexpectedly."));
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("ML analysis timed out after 60s."));
    }, ML_TIMEOUT_MS);

    if (timer.unref) timer.unref();

    eventEmitter.on("prediction", predictionHandler);
    eventEmitter.on("process_closed", closedHandler);

    proc.stdin.write(JSON.stringify({ id: requestId, ...input }) + "\n");
  });
}

export async function runZoneClassification(lat: number, lng: number): Promise<ZoneResult> {
  return new Promise((resolve, reject) => {
    const proc = getPythonProcess();
    if (!proc || !proc.stdin) {
      return reject(new Error("Python process not available."));
    }

    const requestId = Date.now().toString() + Math.random().toString();
    let settled = false;

    const cleanup = () => {
      eventEmitter.removeListener("prediction", predictionHandler);
      eventEmitter.removeListener("process_closed", closedHandler);
    };

    const predictionHandler = (result: any) => {
      if (result.id !== requestId) return;
      if (settled) return;
      settled = true;
      cleanup();
      if (result.status === "error") {
        reject(new Error("Zone classification error: " + result.message));
      } else {
        resolve(result.zone as ZoneResult);
      }
    };

    const closedHandler = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Python process closed unexpectedly."));
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Zone classification timed out."));
    }, ZONE_TIMEOUT_MS);

    if (timer.unref) timer.unref();

    eventEmitter.on("prediction", predictionHandler);
    eventEmitter.on("process_closed", closedHandler);

    proc.stdin.write(JSON.stringify({
      id: requestId,
      mode: "zone_only",
      location: { lat, lng },
    }) + "\n");
  });
}

