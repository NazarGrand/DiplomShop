import express from "express";
import { verifyAuthentication, requireAdminAccess } from "../middleware/authentication.middleware.js";
import { fetchStatistics, fetchDailySalesData } from "../controllers/statistics.controller.js";

const router = express.Router();

router.get("/", verifyAuthentication, requireAdminAccess, async (req, res) => {
	try {
		const analyticsData = await fetchStatistics();
		res.json(analyticsData);
	} catch (error) {
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

router.get("/daily-sales", verifyAuthentication, requireAdminAccess, async (req, res) => {
	try {
		const { startDate, endDate } = req.query;
		const dailySalesData = await fetchDailySalesData(new Date(startDate), new Date(endDate));
		res.json(dailySalesData);
	} catch (error) {
		console.log("Error in daily-sales route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;

