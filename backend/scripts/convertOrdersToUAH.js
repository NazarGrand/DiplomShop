import mongoose from "mongoose";
import Order from "../models/order.model.js";
import dotenv from "dotenv";

dotenv.config();

const USD_TO_UAH_RATE = 42;

async function convertOrdersToUAH() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI or MONGODB_URI environment variable is not set");
    }
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Get all orders
    const orders = await Order.find({});
    console.log(`📦 Found ${orders.length} orders to convert`);

    if (orders.length === 0) {
      console.log("No orders to convert");
      await mongoose.disconnect();
      return;
    }

    let convertedCount = 0;
    let totalRevenueBefore = 0;
    let totalRevenueAfter = 0;

    // Convert each order
    for (const order of orders) {
      const revenueBefore = order.totalAmount;
      totalRevenueBefore += revenueBefore;

      // Convert totalAmount
      order.totalAmount = order.totalAmount * USD_TO_UAH_RATE;

      // Convert each product price
      order.products = order.products.map((product) => ({
        ...product,
        price: product.price * USD_TO_UAH_RATE,
      }));

      // Save updated order
      await order.save();
      convertedCount++;

      totalRevenueAfter += order.totalAmount;

      console.log(
        `✅ Order ${order._id}: ${revenueBefore.toFixed(2)} USD → ${order.totalAmount.toFixed(2)} UAH`
      );
    }

    console.log("\n=== CONVERSION SUMMARY ===");
    console.log(`Total orders converted: ${convertedCount}`);
    console.log(
      `Total revenue before: ${totalRevenueBefore.toFixed(2)} USD`
    );
    console.log(
      `Total revenue after: ${totalRevenueAfter.toFixed(2)} UAH (${(totalRevenueAfter / USD_TO_UAH_RATE).toFixed(2)} USD)`
    );
    console.log("==========================\n");

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    console.log("✅ Conversion completed successfully!");
  } catch (error) {
    console.error("❌ Error converting orders:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the conversion
convertOrdersToUAH();

