import express from "express";
import { products } from "../data/product.js";

const router = express.Router();

router.get("/", (req, res) => {
  let result = [...products];

  const { search, category, minPrice, maxPrice, sort, page = 1, limit = 6 } = req.query;


  if (search) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category) {
    result = result.filter(p => p.category === category);
  }

 
  if (minPrice) {
    result = result.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    result = result.filter(p => p.price <= Number(maxPrice));
  }

 
  if (sort === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  }

  if (sort === "name-asc") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  
  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit);

  const paginatedProducts = result.slice(start, end);

  res.json({
    total: result.length,
    page: Number(page),
    limit: Number(limit),
    products: paginatedProducts
  });
});

router.get("/:id", (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});


export default router;