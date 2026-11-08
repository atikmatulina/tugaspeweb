CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  stock INT NOT NULL
);
INSERT INTO products (name, price, stock) VALUES
('Pensil', 3000, 50),
('Buku Tulis', 5000, 30);
