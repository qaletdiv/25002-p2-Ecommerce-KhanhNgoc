import express from "express";
import { orders } from "../data/orders.js";
import { carts } from "../data/carts.js";

const router = express.Router();


router.get("/:userId", (req, res) => {
  const userOrders = orders.filter(o => o.userId === Number(req.params.userId));
  res.json(userOrders);
});


router.post("/:userId", (req, res) => {
  const { address } = req.body;
  const userId = Number(req.params.userId);

  const cart = carts.find(c => c.userId === userId);
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const total = cart.items.reduce((sum, i) => sum + i.quantity * (i.price || 0), 0);

  const newOrder = {
    id: orders.length + 1,
    userId,
    items: cart.items,
    total,
    address,
    date: new Date().toISOString(),
    status: "Processing"
  };

  orders.push(newOrder);


  cart.items = [];

  res.status(201).json(newOrder);
});

export default router;