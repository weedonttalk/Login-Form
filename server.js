const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const USERS_FILE = path.join(__dirname, "users.json");

app.post("/register", (req, res) => {
  const { fname, lname, email, password } = req.body;
  if (!fname || !lname || !email || !password) {
    return res.json({ success: false, error: "Всі поля обов’язкові!" });
  }

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    users = data ? JSON.parse(data) : [];
  }

  if (users.find(u => u.email === email)) {
    return res.json({ success: false, error: "Цей email вже використовується!" });
  }

  users.push({ fname, lname, email, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

app.get("/users", (req, res) => {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    const users = data ? JSON.parse(data) : [];
    res.json(users);
  } else {
    res.json([]);
  }
});

app.listen(PORT, () => {
  console.log(`server started http://localhost:${PORT}`);
});
