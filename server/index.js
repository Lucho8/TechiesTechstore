const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const statRoutes = require("./routes/statRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/stats", statRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "ITS ALIVE!" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
