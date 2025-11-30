/** @jsxImportSource theme-ui */
import { useEffect } from "react";
import { Box } from "theme-ui";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
  { href: "/smartphones", name: "Смартфони", imageUrl: "/smartphones.jpg" },
  { href: "/computers", name: "Комп’ютери", imageUrl: "/computers.jpg" },
  { href: "/tablets", name: "Планшети", imageUrl: "/tablets.jpg" },
  {
    href: "/smart-watches",
    name: "Розумні годинники",
    imageUrl: "/smart-watches.jpg",
  },
  { href: "/headphone", name: "Навушники", imageUrl: "/headphone.jpg" },
  { href: "/laptops", name: "Ноутбуки", imageUrl: "/laptops.jpg" },
  { href: "/gaming", name: "Геймінг", imageUrl: "/gaming.jpg" },
  { href: "/televisions", name: "Телевізори", imageUrl: "/televisions.jpg" },
];

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <Box
      className="home-page"
      sx={{
        position: "relative",
        minHeight: "100vh",
        color: "white",
        overflow: "hidden",
        ".home-container": {
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          mx: "auto",
          px: ["1rem", "1.5rem", "2rem"],
          py: 16,
          paddingTop: "80px",
          ".home-title": {
            textAlign: "center",
            fontSize: ["3rem", "3.75rem"],
            fontWeight: 900,
            color: "emerald400",
            mb: 4,
            "-webkit-text-stroke": "1.9px #2a3a46",
          },
          ".home-subtitle": {
            textAlign: "center",
            fontSize: "1.25rem",
            color: "gray300",
            mb: 4,
          },
          ".categories-grid": {
            display: "grid",
            gridTemplateColumns: ["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"],
            gap: 4,
          },
        },
      }}
    >
      <div className="home-container">
        <h1 className="home-title">Основні категорії</h1>
        <p className="home-subtitle">Широкий вибір техніки в одному місці</p>

        <div className="categories-grid">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>

        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
    </Box>
  );
};

export default HomePage;
