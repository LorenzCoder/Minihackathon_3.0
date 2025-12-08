/*
Author: C0Eight (3fa85f64-e556-3210-p3xu2c0d3)
server.js (c) 2025
Created:  2025-12-03T19:40:03.642Z
*/

const express = require("express");
const cors = require("cors");
const path = require("path");

// Sicherstellen, dass die .env-Datei geladen wird
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ------------------------------------------------------------------
// NEUE LOGIK: Frontend-Dateien ausliefern
// ------------------------------------------------------------------

// 1. Definiere den Pfad zum kompilierten Frontend-Code
const FRONTEND_BUILD_PATH = path.join(
  __dirname,
  "..",
  "frontend",
  "TeamPanel-Frontend",
  "dist"
);

// 2. Liefere alle statischen Dateien (CSS, JS, Bilder) aus diesem Ordner aus
app.use(express.static(FRONTEND_BUILD_PATH));

// ------------------------------------------------------------------
// Bestehende API-Routen mit SIMULIERTEN DATEN
// ------------------------------------------------------------------

// Health-Check / Test
app.get("/", (req, res) => {
  res.json({ ok: true, message: "NovaPanel Backend läuft (Ohne Supabase) ✅" });
});

/**
 * GET /api/teams
 * Gibt SIMULIERTE Teams zurück
 */
app.get("/api/teams", async (req, res) => {
  // Simulierte Daten, damit das Frontend nicht abstürzt
  const mockTeams = [
    { id: "team-a", name: "Alpha-Team", created_at: new Date().toISOString() },
    { id: "team-b", name: "Beta-Team", created_at: new Date().toISOString() },
  ];
  res.json(mockTeams);
});

/**
 * GET /api/tasks?teamId=...
 * Gibt SIMULIERTE Tasks zu einem bestimmten Team zurück
 */
app.get("/api/tasks", async (req, res) => {
  const { teamId } = req.query;

  if (!teamId) {
    return res.status(400).json({ error: "teamId ist erforderlich" });
  } // Simulierte Daten, basierend auf der Team-ID

  const mockTasks = [
    {
      id: 1,
      team_id: teamId,
      title: "Mock Task 1",
      status: "todo",
      position: 0,
    },
    {
      id: 2,
      team_id: teamId,
      title: "Mock Task 2",
      status: "in-progress",
      position: 1,
    },
  ];
  res.json(mockTasks);
});

/**
 * POST /api/tasks
 * Simuliert die Erstellung eines Tasks
 */
app.post("/api/tasks", async (req, res) => {
  const { team_id, title } = req.body;

  if (!team_id || !title) {
    return res
      .status(400)
      .json({ error: "team_id und title sind erforderlich" });
  } // Gibt den erstellten Task mit einer temporären ID zurück

  const newTask = {
    id: Date.now(),
    team_id,
    title,
    status: "todo",
    position: 0,
  };

  res.status(201).json(newTask);
});

// ------------------------------------------------------------------
// FINALE KORREKTUR: Catch-all Route für das Frontend
// ------------------------------------------------------------------

// Dies fängt alle Anfragen ab, die nicht von den API-Routen oder express.static
// behandelt wurden, und liefert die index.html aus.
app.use((req, res) => {
  res.sendFile(path.join(FRONTEND_BUILD_PATH, "index.html"));
});

app.listen(PORT, () => {
  console.log(
    `NovaPanel Backend (Mock Mode) läuft auf http://localhost:${PORT}`
  );
});
