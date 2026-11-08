const express = require("express");
const db = require("./db");
require("dotenv").config
const app = express();
app.use(express.json());

function validate(body) {
  const { name, price, stock } = body;
  if (!name || typeof name !== "string") return "name wajib diisi dan berupa string";
  if (typeof price !== "number" || price < 0) return "price wajib angka dan tidak boleh negatif";
  if (typeof stock !== "number" || stock < 0) return "stock wajib angka dan tidak boleh negatif";
  return null;
}

app.get("/products", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY id");
    res.status(200).json({ message: "Berhasil mengambil data", data: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.post("/products", async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const { name, price, stock } = req.body;
    const result = await db.query(
      "INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *",
      [name, price, stock]
    );
    res.status(201).json({ message: "Data berhasil dibuat", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.put("/products/:id", async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    const result = await db.query(
      "UPDATE products SET name = $1, price = $2, stock = $3 WHERE id = $4 RETURNING *",
      [name, price, stock, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.status(200).json({ message: "Data berhasil diupdate", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM products WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server jalan di http://localhost:${process.env.PORT}`);
});
