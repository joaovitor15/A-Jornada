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

  // API Route for Google Sheets Cotacoes Proxy
  app.get("/api/cotacoes", async (req, res) => {
    try {
      const url = "https://script.google.com/macros/s/AKfycbyqel2ZyibAr6fpba1h7XMp4rr8FB6TQKgP2a44SlN1_0sRaVZXey7c2cVFpr4frjNRLQ/exec";
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
      const url = "https://script.google.com/macros/s/AKfycbyqel2ZyibAr6fpba1h7XMp4rr8FB6TQKgP2a44SlN1_0sRaVZXey7c2cVFpr4frjNRLQ/exec";
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

  app.post("/api/debug-fatura", (req, res) => {
    try {
      import("fs").then(fs => {
        fs.writeFileSync("/tmp/debug_fatura.json", JSON.stringify(req.body, null, 2));
      });
    } catch(e) {}
    console.log("=== [DEBUG FATURA RECEIVED] ===");
    console.log("Card Info:", req.body.card);
    console.log("Periodo:", req.body.fatura?.periodo);
    console.log("Total Fatura:", req.body.fatura?.totalFatura);
    console.log("Valor Pendente:", req.body.fatura?.valorPendente);
    console.log("Despesas Total:", req.body.fatura?.despesasTotal);
    console.log("Saldo Anterior Nao Pago:", req.body.fatura?.saldoAnteriorNaoPago);
    console.log("Pago:", req.body.fatura?.pago);
    console.log("Despesas Ciclo:", req.body.fatura?.despesasCiclo?.map((t: any) => ({
      data: t.data,
      descricao: t.descricao,
      valor: t.valor
    })));
    console.log("All Card Txs:", req.body.transacoesCard?.map((t: any) => ({
      id: t.id,
      data: t.data,
      descricao: t.descricao,
      valor: t.valor,
      tipo: t.tipo,
      status: t.status
    })));
    res.json({ success: true });
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
