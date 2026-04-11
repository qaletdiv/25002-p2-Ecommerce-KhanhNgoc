import express from "express";
import cors from "cors";





import productsRoutes from "./routes/productsRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
// lien ket voi ben phia routes
app.use("/api/products", productsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);
app.listen(4000, () => {
  console.log("✅\ Server running at http://localhost:4000");
});