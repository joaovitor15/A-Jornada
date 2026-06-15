import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // API Route for Clash Royale
  app.get("/api/clash-royale/player/:tag", async (req, res) => {
    try {
      const { tag } = req.params;
      const apiKey = process.env.CLASH_ROYALE_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "CLASH_ROYALE_API_KEY is minimally required on the server." });
      }

      // Clash Royale API expects the # to be URL encoded (%23) but here we can just pass the raw tag, and append %23
      const cleanTag = tag.replace(/^#/, "");
      
      const targetUrl = `https://proxy.royaleapi.dev/v1/players/%23${cleanTag}`;
      console.log(`[API] Fetching: ${targetUrl}`);
      
      const response = await fetch(targetUrl, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json"
        }
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("[API] Invalid JSON from proxy:", responseText.substring(0, 200));
        return res.status(502).json({ error: `Downstream API returned invalid JSON. Raw response: ${responseText.substring(0, 50)}...` });
      }

      if (!response.ok) {
        return res.status(400).json({ error: data.reason || data.message || `CR API Error: ${response.status} ${response.statusText}`, ...data });
      }

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Route for Clash Royale Chests
  app.get("/api/clash-royale/player/:tag/chests", async (req, res) => {
    try {
      const { tag } = req.params;
      const apiKey = process.env.CLASH_ROYALE_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "CLASH_ROYALE_API_KEY missing" });
      }

      const cleanTag = tag.replace(/^#/, "");
      const targetUrl = `https://proxy.royaleapi.dev/v1/players/%23${cleanTag}/upcomingchests`;
      console.log(`[API] Fetching: ${targetUrl}`);
      
      const response = await fetch(targetUrl, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json"
        }
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("[API] Invalid JSON from proxy (chests):", responseText.substring(0, 200));
        return res.status(502).json({ error: `Downstream API returned invalid JSON. Raw response: ${responseText.substring(0, 50)}...` });
      }

      if (!response.ok) {
        return res.status(400).json({ error: data.reason || data.message || `CR API Error: ${response.status} ${response.statusText}`, ...data });
      }

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Temporary
  app.get("/api/clash-royale/top-player", async (req, res) => {
    try {
      const apiKey = process.env.CLASH_ROYALE_API_KEY;
      const r = await fetch(`https://proxy.royaleapi.dev/v1/locations/global/pathoflegend/players?limit=1`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      if (!r.ok) {
         return res.status(400).json({ error: "Failed" });
      }
      const d = await r.json();
      res.json(d.items[0]);
    } catch(e) { res.status(500).json({}); }
  });

  // API Route for Clash Royale All Cards
  app.get("/api/clash-royale/cards", async (req, res) => {
    try {
      const apiKey = process.env.CLASH_ROYALE_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "CLASH_ROYALE_API_KEY missing" });
      }

      const response = await fetch(`https://proxy.royaleapi.dev/v1/cards`, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json"
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errData = {};
        try { errData = JSON.parse(errorText); } catch(e) {}
        return res.status(400).json({ error: `CR API Error: ${response.status} ${response.statusText}`, ...errData });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Route for Brawl Stars
  app.get("/api/brawl-stars/player/:tag", async (req, res) => {
    try {
      const { tag } = req.params;
      const apiKey = process.env.BRAWL_STARS_API_KEY || process.env.CLASH_ROYALE_API_KEY; // Fallback to CR key if they used one for all

      if (!apiKey) {
        return res.status(500).json({ error: "BRAWL_STARS_API_KEY is missing on the server. Please add it to your secrets or environment variables." });
      }

      const cleanTag = tag.replace(/^#/, "");
      
      const targetUrl = `https://bsproxy.royaleapi.dev/v1/players/%23${cleanTag}`;
      console.log(`[BS API] Fetching: ${targetUrl}`);
      
      const response = await fetch(targetUrl, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Accept": "application/json"
        }
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("[BS API] Invalid JSON from proxy:", responseText.substring(0, 200));
        return res.status(502).json({ error: `Downstream API returned invalid JSON.` });
      }

      if (!response.ok) {
        return res.status(400).json({ error: data.reason || data.message || `BS API Error: ${response.status} ${response.statusText}`, ...data });
      }

      res.json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // API Route for Google Sheets Cotacoes Proxy
  app.get("/api/cotacoes", async (req, res) => {
    try {
      const url = "https://script.google.com/macros/s/AKfycbzmsz9GdRvOtLFvjqEHWCCqpb9FvbsYXKTjGTEzD9dpIaHWL8WzXthKyHJn2B718lZUwA/exec";
      console.log(`[API] Fetching Google Sheets (GET): ${url}`);
      const response = await fetch(url);
      const text = await response.text();
      res.send(text);
    } catch (err: any) {
      console.error("[API] Error fetching Google Sheets (GET):", err);
      res.status(500).json({ error: `Backend Fetch Error: ${err.message}` });
    }
  });

  app.post("/api/cotacoes", async (req, res) => {
    try {
      const { action, ticker } = req.body;
      const url = "https://script.google.com/macros/s/AKfycbzmsz9GdRvOtLFvjqEHWCCqpb9FvbsYXKTjGTEzD9dpIaHWL8WzXthKyHJn2B718lZUwA/exec";
      console.log(`[API] Fetching Google Sheets (POST): ${url}`);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action, ticker })
      });
      const text = await response.text();
      res.send(text);
    } catch (err: any) {
      console.error("[API] Error fetching Google Sheets (POST):", err);
      res.status(500).json({ error: `Backend Fetch Error: ${err.message}` });
    }
  });

  // Intercept PWA files in development to avoid caching problems and MIME-type errors, while allowing real service worker in production
  app.get("/sw.js", (req, res, next) => {
    if (process.env.NODE_ENV !== "production") {
      res.setHeader("Content-Type", "application/javascript");
      return res.send(`
        // Dummy Service Worker for development to prevent caching issues in the dev container
        self.addEventListener('install', (e) => {
          self.skipWaiting();
        });
        self.addEventListener('activate', (e) => {
          e.waitUntil(self.clients.claim());
        });
        self.addEventListener('fetch', (e) => {
          // Pass-through
        });
      `);
    }
    next();
  });

  app.get("/registerSW.js", (req, res, next) => {
    if (process.env.NODE_ENV !== "production") {
      res.setHeader("Content-Type", "application/javascript");
      return res.send(`console.log("Service Worker registration skipped in development.");`);
    }
    next();
  });

  app.get(["/manifest.webmanifest", "/manifest.json"], (req, res, next) => {
    if (process.env.NODE_ENV !== "production") {
      res.setHeader("Content-Type", "application/manifest+json");
      return res.json({
        id: "/",
        name: "Jornada",
        short_name: "Jornada",
        description: "Acompanhe sua jornada com facilidade",
        theme_color: "#1c1b1f",
        background_color: "#1c1b1f",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "/logo-app-monochrome.svg",
            sizes: "192x192 512x512",
            type: "image/svg+xml",
            purpose: "monochrome"
          }
        ],
        screenshots: [
          {
            src: "/screenshot-desktop.png",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "/screenshot-mobile.png",
            sizes: "1080x1920",
            type: "image/png"
          }
        ]
      });
    }
    next();
  });

  // Serve Vite static files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Explicitly set MIME type for webmanifest and manifest.json just in case
    app.get(['/manifest.webmanifest', '/manifest.json'], (req, res) => {
      res.setHeader('Content-Type', 'application/manifest+json');
      // Serve manifest.webmanifest as the canonical source
      res.sendFile(path.join(distPath, 'manifest.webmanifest'));
    });
    
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
