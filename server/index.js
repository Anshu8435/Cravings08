import cloudinary from "./src/config/cloudinary.config.js";
import express from "express";
import connectDB from "./src/config/dbConnection.config.js";
import AuthRouter from "./src/router/auth.route.js";
import PublicRouter from "./src/router/public.route.js";
import CommonRouter from "./src/router/common.route.js";
import MenuRouter from "./src/router/menu.route.js";
import morgan from "morgan";
import cors from "cors";
import restaurantRouter from "./src/router/restaurant.route.js";
import riderRouter from "./src/router/rider.route.js";
import cookieParser from "cookie-parser";
import customerRouter from "./src/router/customer.route.js";
import adminRouter from "./src/router/admin.route.js";
import PoolRouter from "./src/router/pool.route.js";
import PaymentRouter from "./src/router/payment.route.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "https://raj-cravings.netlify.app",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));

import OrderRouter from "./src/router/order.route.js";

app.use("/auth", AuthRouter);
app.use("/public", PublicRouter);
app.use("/common", CommonRouter);
app.use("/menu", MenuRouter);
app.use("/restaurant", restaurantRouter);
app.use("/admin", adminRouter);
app.use("/customer", customerRouter);
app.use("/rider", riderRouter);
app.use("/pools", PoolRouter);
app.use("/payment", PaymentRouter);
app.use("/order", OrderRouter);

//Default API
app.get("/", (req, res) => {
  console.log("Default Get API Hit");
  res.json({ message: "Welcome to my Cravings Project" });
});

//Default Error Handler

app.use((err, req, res, next) => {
  const ErrMessage = err.message || "Internal Server Error";
  const ErrStausCode = err.statusCode || 500;

  res.status(ErrStausCode).json({ message: ErrMessage });
});

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log("Server Started on port:", port);
  connectDB();
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary Connected :");
    console.log(result);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
});
