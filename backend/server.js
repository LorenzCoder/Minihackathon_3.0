/*
Author: C0Eight (3fa85f64-e556-3210-p3xu2c0d3)
server.js (c) 2025
Created:  2025-12-03T19:40:03.642Z
*/

const express = require('express'); 
const cors  = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({status: "Okay", message: "Im Team Panel (backend) läuft alles!"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port http://localhost:${PORT}${PORT}`);
});

const users = [
  { id: "u1", name: "User", email: "test@beispiel.com", password: "123456" },
];

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Ungültige Login-Daten" });
  }

  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token: "FAKE_TOKEN_" + user.id,
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email, password nötig" });
  }

  const exists = users.some((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ error: "User existiert schon" });
  }

  const newUser = {
    id: "u" + (users.length + 1),
    name,
    email,
    password,
  };
  users.push(newUser);

  res.status(201).json({
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
    token: "FAKE_TOKEN_" + newUser.id,
  });
});