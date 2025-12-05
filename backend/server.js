/*
Author: C0Eight (3fa85f64-e556-3210-p3xu2c0d3)
server.js (c) 2025
Created:  2025-12-03T19:40:03.642Z
*/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { supabase } = require("./supabaseClient");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health-Check / Test
app.get("/", (req, res) => {
  res.json({ ok: true, message: "NovaPanel Backend läuft ✅" });
});

/**
 * GET /api/teams
 * Holt alle Teams aus deiner Supabase-DB (Tabelle: teams)
 */
app.get("/api/teams", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase-Fehler /api/teams:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Server-Fehler /api/teams:", err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

/**
 * GET /api/tasks?teamId=...
 * Holt Tasks zu einem bestimmten Team
 */
app.get("/api/tasks", async (req, res) => {
  const { teamId } = req.query;

  if (!teamId) {
    return res.status(400).json({ error: "teamId ist erforderlich" });
  }

  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("team_id", teamId)
      .order("position", { ascending: true });

    if (error) {
      console.error("Supabase-Fehler /api/tasks:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("Server-Fehler /api/tasks:", err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

/**
 * POST /api/tasks
 * JSON-Body: { "team_id": "...", "title": "Tasktitel", "description": "optional" }
 */
app.post("/api/tasks", async (req, res) => {
  const { team_id, title, description } = req.body;

  if (!team_id || !title) {
    return res
      .status(400)
      .json({ error: "team_id und title sind erforderlich" });
  }

  try {
    const { data, error } = await supabase.from("tasks").insert([
      {
        team_id,
        title,
        description: description || "",
        status: "todo",
        position: 0,
      },
    ]);

    if (error) {
      console.error("Supabase-Fehler POST /api/tasks:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Server-Fehler POST /api/tasks:", err);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

app.listen(PORT, () => {
  console.log(`NovaPanel Backend läuft auf http://localhost:${PORT}`);
});
