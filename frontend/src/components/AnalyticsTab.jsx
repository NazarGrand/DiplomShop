/** @jsxImportSource theme-ui */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../lib/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AnalyticsTab = () => {
  const [analyticsData, setAnalyticsData] = useState({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dailySalesData, setDailySalesData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/analytics");
        setAnalyticsData(response.data.analyticsData);
        setDailySalesData(response.data.dailySalesData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return <div>Завантаження...</div>;
  }

  return (
    <div
      className="analytics-tab"
      sx={{
        maxWidth: "1280px",
        mx: "auto",
        ".analytics-cards": {
          display: "grid",
          gridTemplateColumns: ["1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"],
          gap: 4,
          mb: 5,
        },
        ".analytics-chart": {
          bg: "rgba(31, 41, 55, 0.6)",
          borderRadius: "lg",
          p: 6,
          boxShadow: "medium",
        },
      }}
    >
      <div className="analytics-cards">
        <AnalyticsCard
          title="Всього користувачів"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
          color="from-emerald-500 to-teal-700"
        />
        <AnalyticsCard
          title="Всього товарів"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          color="from-emerald-500 to-green-700"
        />
        <AnalyticsCard
          title="Всього продажів"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color="from-emerald-500 to-cyan-700"
        />
        <AnalyticsCard
          title="Загальний дохід"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="from-emerald-500 to-lime-700"
        />
      </div>
      <motion.div
        className="analytics-chart"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#D1D5DB" />
            <YAxis yAxisId="left" stroke="#D1D5DB" />
            <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              activeDot={{ r: 8 }}
              name="Продажі"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              activeDot={{ r: 8 }}
              name="Дохід"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    className="analytics-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    sx={{
      bg: "gray800",
      borderRadius: "lg",
      p: 3,
      boxShadow: "medium",
      overflow: "hidden",
      position: "relative",
      ".card-content": {
        position: "relative",
        zIndex: 10,
        ".card-info": {
          ".card-title": {
            color: "#4dbeff",
            fontSize: "1rem",
            mb: 1,
            fontWeight: 600,
            textAlign: "center",
          },
          ".card-value": {
            color: "white",
            fontSize: "1.875rem",
            fontWeight: 700,
            textAlign: "center",
          },
        },
      },
      ".card-gradient": {
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to bottom right, rgba(77, 190, 255, 0.6), rgba(77, 190, 255, 0.9))",
        opacity: 0.3,
      },
    }}
  >
    <div className="card-content">
      <div className="card-info">
        <p className="card-title">{title}</p>
        <h3 className="card-value">{value}</h3>
      </div>
    </div>
    <div className="card-gradient" />
  </motion.div>
);
