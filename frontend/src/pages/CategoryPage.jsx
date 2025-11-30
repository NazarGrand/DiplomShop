/** @jsxImportSource theme-ui */
import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Box } from "theme-ui";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { fetchProductsByCategory, products } = useProductStore();
  const { category } = useParams();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);

  console.log("products:", products);
  return (
    <Box
      className="category-page"
      sx={{
        ".category-container": {
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          mx: "auto",
          px: ["1rem", "1.5rem", "2rem"],
          py: 4,
          ".category-title": {
            textAlign: "center",
            fontSize: ["2.3rem", "3rem"],
            fontWeight: 900,
            color: "emerald400",
            fontFamily: "oswald",
            letterSpacing: "2px",
          },
          ".products-grid": {
            display: "grid",
            gridTemplateColumns: [
              "1fr",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
            ],
            gap: 2,
            justifyItems: "center",
            ".empty-message": {
              gridColumn: "1 / -1",
              fontSize: "1.875rem",
              fontWeight: 600,
              color: "gray300",
              textAlign: "center",
            },
          },
        },
      }}
    >
      <div className="category-container">
        <motion.h1
          className="category-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>

        <motion.div
          className="products-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {products?.length === 0 && (
            <h2 className="empty-message">Товари не знайдено</h2>
          )}

          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      </div>
    </Box>
  );
};

export default CategoryPage;
