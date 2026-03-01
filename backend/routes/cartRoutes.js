import express from "express";
import { carts } from "../data/carts.js";

const router = express.Router();


router.get("/:userId", (req, res) => {
  const cart = carts.find(c => c.userId === Number(req.params.userId));
  res.json(cart || { userId: Number(req.params.userId), items: [] });
});

router.post("/:userId", (req, res) => {
  const { productId, quantity } = req.body;
  let cart = carts.find(c => c.userId === Number(req.params.userId));

  if (!cart) {
    cart = { userId: Number(req.params.userId), items: [] };
    carts.push(cart);
  }

  const item = cart.items.find(i => i.productId === productId);
  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  res.json(cart);
});


router.put("/:userId", (req, res) => {
  const { productId, quantity } = req.body;
  const cart = carts.find(c => c.userId === Number(req.params.userId));

  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(i => i.productId === productId);
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity = quantity;
  res.json(cart);
});


router.delete("/:userId/:productId", (req, res) => {
  const cart = carts.find(c => c.userId === Number(req.params.userId));
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter(i => i.productId !== Number(req.params.productId));
  res.json(cart);
});

export default router;