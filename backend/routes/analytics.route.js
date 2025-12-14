import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytics.controller.js";
import Order from "../models/order.model.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    console.log("=== ANALYTICS ROUTE CALLED ===");
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999); // Set to end of day
    console.log("End date:", endDate.toISOString());

    // Always start from December 1st of current year
    const currentYear = endDate.getFullYear();
    const startDate = new Date(currentYear, 11, 1); // Month 11 = December (0-indexed)
    startDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    console.log(
      "Using fixed start date December 1st:",
      startDate.toISOString()
    );
    console.log("Days difference:", daysDiff, "days");

    console.log("Date range for analytics:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      startDateLocal: startDate.toLocaleString("uk-UA"),
      endDateLocal: endDate.toLocaleString("uk-UA"),
    });

    const dailySalesData = await getDailySalesData(startDate, endDate);

    console.log("=== ANALYTICS DATA SUMMARY ===");
    console.log("Daily sales data count:", dailySalesData.length);
    if (dailySalesData.length > 0) {
      console.log("First date in data:", dailySalesData[0]?.date);
      console.log(
        "Last date in data:",
        dailySalesData[dailySalesData.length - 1]?.date
      );
      console.log(
        "Sample of first 5 dates:",
        dailySalesData.slice(0, 5).map((d) => d.date)
      );
      console.log(
        "Sample of last 5 dates:",
        dailySalesData.slice(-5).map((d) => d.date)
      );
    } else {
      console.log("WARNING: No daily sales data returned!");
    }
    console.log("==============================");

    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.log("Error in analytics route", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
