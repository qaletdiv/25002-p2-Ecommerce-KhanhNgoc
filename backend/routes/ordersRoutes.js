import express from "express";

const router = express.Router();

let orders = [];
router.post("/", (req, res) => {
  const { userId, items, total } = req.body;

  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  const newOrder = {
    id: Date.now(),
    userId,
    items,
    total,
    createdAt: new Date(),
  };

  orders.push(newOrder);

  res.json({
    message: "Order created successfully",
    order: newOrder,
  });
});

router.get("/:userId", (req, res) => {
  const userId = Number(req.params.userId);

  const userOrders = orders.filter(o => o.userId === userId);

  res.json(userOrders);
});

export default router;