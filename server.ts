import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory leaderboard store for the session
let leaderboard: any[] = [];

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  res.json(leaderboard);
});

// Post to leaderboard
app.post('/api/leaderboard', async (req, res) => {
  const { name, time, timestamp } = req.body;
  if (!name || time === undefined) {
    return res.status(400).json({ error: 'Missing data' });
  }

  // Connect to Google Apps Script (Google Sheets)
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzuFJI2YwOcCluwkwS0y7_9jwdSxBsJOR2Y1k0G2uKSZQtdJJtUmUjd0UqzDKS6gyomuQ/exec';
  try {
    await fetch(APPS_SCRIPT_URL, { 
      method: 'POST', 
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ name, time }) 
    });
  } catch (err) {
    console.error("Error sending to Apps Script:", err);
  }

  leaderboard.push({
    id: Date.now(),
    name,
    time, // time in milliseconds
    timestamp: timestamp || new Date().toISOString()
  });

  // Sort by lowest time
  leaderboard.sort((a, b) => a.time - b.time);

  res.json({ success: true, leaderboard });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
