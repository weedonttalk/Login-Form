const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const USERS_FILE = path.join(__dirname, "users.json");
const DB_PATH = path.join(__dirname, "db.sqlite");

// === SQLite init ===
const db = new sqlite3.Database(DB_PATH);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )`);
});

// === Helper to also persist to JSON (как и раньше) ===
function saveToJson(newUser){
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    try { users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8")) || []; } catch {}
  }
  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post("/register", (req, res) => {
  const { fname, email, password } = req.body;
  if (!fname || !email || !password) {
    return res.json({ success: false, error: "Всі поля обов’язкові!" });
  }

  // Сначала проверим уникальность email в БД
  db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
    if(err){
      console.error(err);
      return res.json({ success:false, error: "DB error" });
    }
    if(row){
      return res.json({ success:false, error: "Користувач із таким email вже існує" });
    }
    // Вставка
    db.run("INSERT INTO users (fname, email, password) VALUES (?,?,?)",
      [fname, email, password],
      function(insertErr){
        if(insertErr){
          console.error(insertErr);
          return res.json({ success:false, error: "DB insert error" });
        }
        const newUser = { id: this.lastID, fname, email, password };
        // дублируем в users.json
        saveToJson(newUser);
        res.json({ success:true, fname });
      });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ success: false, error: "Всі поля обов’язкові!" });

  db.get("SELECT fname FROM users WHERE email=? AND password=?", [email, password], (err, row) => {
    if(err){
      console.error(err);
      return res.json({ success:false, error: "DB error" });
    }
    if(row){
      res.json({ success:true, fname: row.fname });
    } else {
      res.json({ success:false, error: "Невірні дані!" });
    }
  });
});

app.get("/users", (req, res) => {
  db.all("SELECT id, fname, email, created_at FROM users ORDER BY id DESC", [], (err, rows) => {
    if(err){
      console.error(err);
      return res.json([]);
    }
    res.json(rows || []);
  });
});

app.listen(PORT, () => {
  console.log(`server started http://localhost:${PORT}`);
});
