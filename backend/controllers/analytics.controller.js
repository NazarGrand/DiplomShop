import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  // Get all orders to check their totalAmount values
  const allOrders = await Order.find({}).select("totalAmount createdAt");
  console.log("=== ANALYTICS: Checking all orders ===");
  console.log("Total orders count:", allOrders.length);

  if (allOrders.length > 0) {
    console.log("Sample orders with totalAmount:");
    allOrders.slice(0, 5).forEach((order, index) => {
      console.log(`Order ${index + 1}:`, {
        id: order._id,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
      });
    });

    // Calculate sum manually to verify
    const manualSum = allOrders.reduce((sum, order) => {
      const amount = order.totalAmount || 0;
      return sum + amount;
    }, 0);
    console.log("Manual sum of all totalAmount:", manualSum);

    // Check for null/undefined values
    const nullAmounts = allOrders.filter(
      (order) => !order.totalAmount || order.totalAmount === 0
    );
    if (nullAmounts.length > 0) {
      console.warn(
        "⚠️ Found",
        nullAmounts.length,
        "orders with null/zero totalAmount"
      );
    }
  }

  // Calculate revenue from products array (price * quantity) instead of totalAmount
  // This is more accurate as it uses the actual product prices
  const revenueData = await Order.aggregate([
    {
      $unwind: "$products", // Unwind products array
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: { $multiply: ["$products.price", "$products.quantity"] },
        },
      },
    },
  ]);

  // Get total number of orders
  const ordersCount = await Order.countDocuments();

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  // Calculate revenue from totalAmount for comparison
  const revenueFromTotalAmount = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenueFromTotalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  const revenueFromTotalAmountValue =
    revenueFromTotalAmount[0]?.totalRevenueFromTotalAmount || 0;

  console.log("Aggregation result:", {
    totalSales: ordersCount,
    totalRevenueFromProducts: totalRevenue,
    totalRevenueFromTotalAmount: revenueFromTotalAmountValue,
    difference: totalRevenue - revenueFromTotalAmountValue,
    averageOrderValue: ordersCount > 0 ? totalRevenue / ordersCount : 0,
  });
  console.log("=====================================");

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales: ordersCount, // Return orders count, not product items
    totalRevenue, // Use revenue calculated from products
  };
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    console.log("getDailySalesData called with:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    // Calculate revenue from products array (price * quantity) for daily data
    const dailyRevenueData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $unwind: "$products", // Unwind products array
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: {
            $sum: { $multiply: ["$products.price", "$products.quantity"] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Count orders per day separately
    const dailyOrdersData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Merge revenue and sales data
    const dailySalesDataMap = new Map();

    // Add revenue data
    dailyRevenueData.forEach((item) => {
      dailySalesDataMap.set(item._id, {
        _id: item._id,
        revenue: item.revenue,
        sales: 0,
      });
    });

    // Add sales count
    dailyOrdersData.forEach((item) => {
      const existing = dailySalesDataMap.get(item._id);
      if (existing) {
        existing.sales = item.sales;
      } else {
        dailySalesDataMap.set(item._id, {
          _id: item._id,
          revenue: 0,
          sales: item.sales,
        });
      }
    });

    const dailySalesData = Array.from(dailySalesDataMap.values()).sort((a, b) =>
      a._id.localeCompare(b._id)
    );

    console.log("Aggregation result count:", dailySalesData.length);
    if (dailySalesData.length > 0) {
      console.log("Sample aggregation data:", dailySalesData.slice(0, 3));
    }

    // example of dailySalesData
    // [
    // 	{
    // 		_id: "2024-08-18",
    // 		sales: 12,
    // 		revenue: 1450.75
    // 	},
    // ]

    const dateArray = getDatesInRange(startDate, endDate);
    console.log("Date array generated, length:", dateArray.length);
    console.log("First 5 dates in array:", dateArray.slice(0, 5));
    console.log("Last 5 dates in array:", dateArray.slice(-5));

    // Verify that December 1st is included
    const currentYear = startDate.getFullYear();
    const dec1Date = `${currentYear}-12-01`;
    if (!dateArray.includes(dec1Date)) {
      console.error("❌ ERROR: December 1st is NOT in the date array!");
      console.error("First date in array:", dateArray[0]);
      console.error("Looking for:", dec1Date);
    } else {
      console.log("✅ December 1st is included in date array");
    }

    const result = dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData?.sales || 0,
        revenue: foundData?.revenue || 0,
      };
    });

    console.log("Final result count:", result.length);
    if (result.length > 0) {
      console.log("First result date:", result[0]?.date);
      console.log("Last result date:", result[result.length - 1]?.date);
      console.log(
        "Expected dates from:",
        startDate.toISOString().split("T")[0],
        "to",
        endDate.toISOString().split("T")[0]
      );

      // Check if we have data for all expected dates
      const expectedDays =
        Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      if (result.length !== expectedDays) {
        console.warn(
          `⚠️ WARNING: Expected ${expectedDays} days, but got ${result.length} days in result`
        );
      } else {
        console.log(`✅ All ${expectedDays} days are included in the result`);
      }
    }

    return result;
  } catch (error) {
    throw error;
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  // Normalize dates to UTC to avoid timezone issues
  currentDate.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);

  console.log("getDatesInRange called with:", {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    currentDate: currentDate.toISOString(),
    end: end.toISOString(),
  });

  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  console.log(
    `✅ Generated ${dates.length} dates from ${dates[0]} to ${
      dates[dates.length - 1]
    }`
  );
  if (dates.length <= 7) {
    console.warn(
      "⚠️ WARNING: Only",
      dates.length,
      "dates generated! This might be the issue."
    );
    console.warn("Check if startDate and endDate are correct.");
  }
  return dates;
}
