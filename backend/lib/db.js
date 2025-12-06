import mongoose from "mongoose";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			serverSelectionTimeoutMS: 10000, // 10 seconds timeout
			socketTimeoutMS: 45000, // 45 seconds timeout for sockets
		});
		console.log(`MongoDB connected: ${conn.connection.host}`);
		
		// Handle connection events
		mongoose.connection.on("error", (err) => {
			console.log("MongoDB connection error:", err.message);
		});
		
		mongoose.connection.on("disconnected", () => {
			console.log("MongoDB disconnected");
		});
		
		mongoose.connection.on("reconnected", () => {
			console.log("MongoDB reconnected");
		});
	} catch (error) {
		console.log("Error connecting to MONGODB:", error.message);
		if (error.message.includes("IP") || error.message.includes("whitelist")) {
			console.log("\n⚠️  ПРОБЛЕМА: Ваша IP-адреса не додана до MongoDB Atlas whitelist!");
			console.log("📝 Рішення: Додайте вашу IP-адресу в MongoDB Atlas → Security → Network Access");
			console.log("🔗 Посилання: https://cloud.mongodb.com/\n");
		}
		process.exit(1);
	}
};
