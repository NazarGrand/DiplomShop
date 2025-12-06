/** @jsxImportSource theme-ui */
import classNames from "classnames";
import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Box } from "theme-ui";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import { useProductStore } from "../stores/useProductStore";
import { Product } from "../types";

interface Tab {
  id: string;
  label: string;
  icon: typeof PlusCircle;
}

const tabs: Tab[] = [
  { id: "create", label: "Створити товар", icon: PlusCircle },
  { id: "products", label: "Товари", icon: ShoppingBasket },
  { id: "analytics", label: "Аналітика", icon: BarChart },
];

type TabId = "create" | "products" | "analytics";

const AdminPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<TabId>("create");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { fetchAllProducts, products } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <Box
      className="admin-page"
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        ".admin-container": {
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          mx: "auto",
          px: 4,
          py: 16,
          ".admin-title": {
            marginTop: "80px",
            fontSize: "2.25rem",
            fontWeight: 900,
            mb: 4,
            color: "emerald400",
            textAlign: "center",
          },
          ".admin-tabs": {
            display: "flex",
            justifyContent: "center",
            mb: 5,
            ".tab-button": {
              display: "flex",
              alignItems: "center",
              px: 4,
              py: 2,
              mx: 2,
              borderRadius: "md",
              transition: "all 0.2s ease",
              cursor: "pointer",
              border: "none",
              ".tab-icon": {
                mr: 2,
                height: "20px",
                width: "20px",
              },
              "&.active": {
                bg: "#25365c",
                color: "white",
              },
              "&:not(.active)": {
                bg: "gray700",
                color: "gray300",
                "&:hover": {
                  bg: "gray600",
                },
              },
            },
          },
        },
      }}
    >
      <div className="admin-container">
        <motion.h1
          className="admin-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Панель адміністратора
        </motion.h1>

        <div className="admin-tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={classNames(
                  "tab-button",
                  activeTab === tab.id && "active"
                )}
              >
                <IconComponent className="tab-icon" />
                {tab.label}
              </button>
            );
          })}
        </div>
        {activeTab === "create" && (
          <CreateProductForm
            editingProduct={editingProduct}
            onCancelEdit={() => setEditingProduct(null)}
          />
        )}
        {activeTab === "products" && (
          <ProductsList
            onEdit={async (productId: string) => {
              const product = products.find((p) => p._id === productId);
              if (product) {
                // Fetch full product data to ensure we have all images
                try {
                  await fetchProductById(productId);
                  const fullProduct = useProductStore.getState().currentProduct;
                  if (fullProduct) {
                    console.log("Full product data loaded:", fullProduct);
                    setEditingProduct(fullProduct);
                  } else {
                    console.log("Using product from list:", product);
                    setEditingProduct(product);
                  }
                } catch (error) {
                  console.error("Error fetching full product:", error);
                  setEditingProduct(product);
                }
                setActiveTab("create");
              }
            }}
          />
        )}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </Box>
  );
};

export default AdminPage;

