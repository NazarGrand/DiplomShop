import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import userAuthRoutes from "./routes/userAuth.route.js";
import itemRoutes from "./routes/item.route.js";
import shoppingCartRoutes from "./routes/shoppingCart.route.js";
import discountRoutes from "./routes/discount.route.js";
import checkoutRoutes from "./routes/checkout.route.js";
import statisticsRoutes from "./routes/statistics.route.js";

import { initializeDatabase } from "./lib/databaseConnection.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// CORS configuration to allow credentials (cookies)
const corsOptions = {
	origin: function (origin, callback) {
		// Allow requests with no origin (like mobile apps or curl requests)
		if (!origin) return callback(null, true);
		
		// Allow localhost, ngrok URLs, and FRONTEND_URL from env
		const allowedOrigins = [
			"http://localhost:5173",
			process.env.FRONTEND_URL,
		].filter(Boolean);
		
		if (
			allowedOrigins.some(allowed => origin === allowed) ||
			origin.includes("localhost") ||
			origin.includes("ngrok")
		) {
			callback(null, true);
		} else {
			// In production, you might want to restrict this
			callback(null, true);
		}
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser());

app.use("/api/auth", userAuthRoutes);
app.use("/api/products", itemRoutes);
app.use("/api/cart", shoppingCartRoutes);
app.use("/api/coupons", discountRoutes);
app.use("/api/payments", checkoutRoutes);
app.use("/api/analytics", statisticsRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	initializeDatabase();
});
