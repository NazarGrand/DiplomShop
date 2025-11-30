import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;

		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		// Перевірка стану підключення до MongoDB
		const mongoose = (await import("mongoose")).default;
		if (mongoose.connection.readyState !== 1) {
			console.log("Error in protectRoute middleware: MongoDB not connected");
			return res.status(503).json({ 
				message: "Service unavailable - Database connection error",
				error: "MongoDB connection is not established. Please check your network access settings."
			});
		}

		try {
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
			const user = await User.findById(decoded.userId).select("-password");

			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}

			req.user = user;

			next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			// Якщо помилка пов'язана з MongoDB
			if (error.message.includes("connection") || error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
				console.log("Error in protectRoute middleware: MongoDB connection error", error.message);
				return res.status(503).json({ 
					message: "Service unavailable - Database connection error",
					error: "Cannot connect to database. Please check your MongoDB Atlas network access settings."
				});
			}
			throw error;
		}
	} catch (error) {
		console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};

export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};
