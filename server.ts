import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GenAI safely (wrap key access to fail gracefully rather than crashing)
const getAiClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.warn("WARNING: GEMINI_API_KEY is not defined in the environment.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getAiClient();

// API route first: AI climate insights
app.post("/api/gemini/insight", async (req, res) => {
  const { transport_mode, transport_distance, ac_hours, laptop_hours, waste_habit, digital_hours } = req.body;

  if (!ai) {
    return res.json({ 
      insight: `Based on your habits (Transport: ${transport_mode} for ${transport_distance}km, AC: ${ac_hours}hrs, Laptop: ${laptop_hours}hrs, Waste Category: ${waste_habit}, Digital: ${digital_hours}hrs), your transport mode is your biggest potential card to play. Switching to zero-carbon modes or recycling waste can drastically lower your carbon footprint. Continue tracking to see the projected impact!`
    });
  }

  try {
    const prompt = `Analyze the following carbon habits of a user:
- Transport: ${transport_mode} mode, distance: ${transport_distance} km/day
- Electricity: ${ac_hours} hours AC/day, ${laptop_hours} hours laptop/day
- Waste & Recycling habits: ${waste_habit}
- Digital: ${digital_hours} hours/day on streaming, cloud, and devices

Identify their largest carbon footprint category or lever, calculate or approximate their daily impact, and offer a positive, encouraging advice of 2-3 sentences. Focus on real savings. Do not use lists or headers. Keep the text extremely clear and human.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ insight: response.text });
  } catch (error: any) {
    console.error("Gemini Insight Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI insights" });
  }
});

// Vite middleware and listen wrapper to prevent Top-level await compile errors in CJS targets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
