/** @jsxImportSource theme-ui */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Box } from "theme-ui";
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

interface AnalyticsData {
  users: number;
  products: number;
  totalSales: number;
  totalRevenue: number;
}

interface DailySalesData {
  date: string;
  sales: number;
  revenue: number;
}

interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: typeof Users;
  color: string;
}

const AnalyticsTab = (): JSX.Element => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dailySalesData, setDailySalesData] = useState<DailySalesData[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async (): Promise<void> => {
      try {
        const response = await axios.get<{
          analyticsData: AnalyticsData;
          dailySalesData: DailySalesData[];
        }>("/analytics");
        console.log("Analytics response:", response.data);
        if (response.data) {
          setAnalyticsData(response.data.analyticsData || {
            users: 0,
            products: 0,
            totalSales: 0,
            totalRevenue: 0,
          });
          setDailySalesData(response.data.dailySalesData || []);
        }
      } catch (error: any) {
        console.error("Error fetching analytics data:", error);
        console.error("Error response:", error.response?.data);
        // Встановлюємо значення за замовчуванням при помилці
        setAnalyticsData({
          users: 0,
          products: 0,
          totalSales: 0,
          totalRevenue: 0,
        });
        setDailySalesData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          color: "gray300",
          fontSize: "1.125rem",
        }}
      >
        Завантаження...
      </Box>
    );
  }

  return (
    <Box
      className="analytics-tab"
      sx={{
        maxWidth: "1280px",
        mx: "auto",
        px: [2, 4],
        ".analytics-cards": {
          display: "grid",
          gridTemplateColumns: ["1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"],
          gap: 4,
          mb: 5,
        },
        ".analytics-chart": {
          bg: "gray800",
          borderRadius: "lg",
          p: 6,
          boxShadow: "medium",
          minHeight: "400px",
        },
        ".empty-message": {
          textAlign: "center",
          color: "gray400",
          fontSize: "1.125rem",
          py: 8,
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
        {dailySalesData && dailySalesData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailySalesData.map(item => ({ name: item.date, sales: item.sales, revenue: item.revenue }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#D1D5DB" />
              <YAxis 
                yAxisId="left" 
                stroke="#D1D5DB" 
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="#D1D5DB"
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#1F2937", 
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#D1D5DB"
                }} 
              />
              <Legend wrapperStyle={{ color: "#D1D5DB" }} />
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
                name="Дохід ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="empty-message">
            Немає даних про продажі за останні 7 днів
          </div>
        )}
      </motion.div>
    </Box>
  );
};

const AnalyticsCard = ({
  title,
  value,
  icon: Icon,
  color,
}: AnalyticsCardProps): JSX.Element => (
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

export default AnalyticsTab;

