const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());

const PORT = 5000;

const students = JSON.parse(
  fs.readFileSync("./student_data.json", "utf-8")
);

app.get("/api/students", (req, res) => {
  const search = req.query.search?.toLowerCase();

  if (!search || search.length < 3) {
    return res.json([]);
  }

  const result = students
    .filter(s => s.name.toLowerCase().includes(search))
    .slice(0, 5);

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});