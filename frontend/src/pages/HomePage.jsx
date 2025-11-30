/** @jsxImportSource theme-ui */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box } from "theme-ui";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";
import {
  ShoppingBag,
  Shield,
  Truck,
  Headphones,
  TrendingUp,
  Award,
  Users,
  Package,
} from "lucide-react";

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
  const { fetchFeaturedProducts, featuredProducts, loading } = useProductStore();

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
        {/* Hero секція */}
        <motion.div
          className="hero-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            textAlign: "center",
            mb: 12,
            ".hero-title": {
              fontSize: ["2.5rem", "3.5rem", "4.5rem"],
              fontWeight: 900,
              color: "emerald400",
              mb: 4,
              fontFamily: "oswald",
              letterSpacing: "2px",
              lineHeight: 1.2,
            },
            ".hero-subtitle": {
              fontSize: ["1.125rem", "1.25rem", "1.5rem"],
              color: "gray300",
              mb: 4,
              maxWidth: "800px",
              mx: "auto",
              lineHeight: 1.7,
            },
          }}
        >
          <h1 className="hero-title">ElectroLab</h1>
          <p className="hero-subtitle">
            Ваш надійний партнер у світі електроніки. Широкий вибір техніки
            високої якості за доступними цінами. Від смартфонів до геймінгових
            систем - все в одному місці.
          </p>
        </motion.div>

        {/* Секція переваг */}
        <motion.div
          className="benefits-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          sx={{
            mb: 12,
            ".benefits-grid": {
              display: "grid",
              gridTemplateColumns: ["1fr", "repeat(2, 1fr)", "repeat(4, 1fr)"],
              gap: 4,
              ".benefit-card": {
                bg: "gray800",
                borderRadius: "lg",
                p: 4,
                border: "1px solid",
                borderColor: "gray700",
                textAlign: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: "emerald400",
                  boxShadow: "0 10px 25px #3f5f9a",
                },
                ".benefit-icon": {
                  color: "emerald400",
                  mb: 3,
                },
                ".benefit-title": {
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "white",
                  mb: 2,
                },
                ".benefit-description": {
                  fontSize: "0.875rem",
                  color: "gray400",
                  lineHeight: 1.6,
                },
              },
            },
          }}
        >
          <h2
            sx={{
              textAlign: "center",
              fontSize: ["2rem", "2.5rem"],
              fontWeight: 900,
              color: "emerald400",
              mb: 3,
              fontFamily: "oswald",
              letterSpacing: "1px",
            }}
          >
            Чому обирають нас
          </h2>
          <div className="benefits-grid">
            {[
              {
                icon: Shield,
                title: "Гарантія якості",
                description: "Офіційна гарантія на всі товари від виробника",
              },
              {
                icon: Truck,
                title: "Швидка доставка",
                description: "Доставка по всій Україні протягом 1-3 днів",
              },
              {
                icon: Headphones,
                title: "Підтримка 24/7",
                description: "Наша команда завжди готова допомогти вам",
              },
              {
                icon: Award,
                title: "Оригінальна продукція",
                description: "Тільки сертифіковані товари від офіційних дилерів",
              },
            ].map((benefit, index) => (
              <div key={index} className="benefit-card">
                <benefit.icon className="benefit-icon" size={40} />
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Категорії */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="home-title">Основні категорії</h1>
          <p className="home-subtitle">Широкий вибір техніки в одному місці</p>

          <div className="categories-grid">
            {categories.map((category) => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="promo-banner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          sx={{
            my: 12,
            bg: "linear-gradient(135deg, #3f5f9a 0%, #25365c 100%)",
            borderRadius: "50px",
            pb: 3,
            textAlign: "center",
            border: "1px solid",
            borderColor: "gray700",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at 30% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)",
              pointerEvents: "none",
            },
            ".promo-content": {
              position: "relative",
              zIndex: 1,
              ".promo-title": {
                fontSize: ["2rem", "2.5rem", "3rem"],
                fontWeight: 900,
                color: "white",
                mb: 3,
                fontFamily: "oswald",
                letterSpacing: "1px",
              },
              ".promo-text": {
                fontSize: ["1rem", "1.125rem"],
                color: "gray200",
                mb: 4,
                maxWidth: "600px",
                mx: "auto",
                lineHeight: 1.7,
              },
              ".promo-button": {
                display: "inline-flex",
                alignItems: "center",
                gap: 2,
                px: 4,
                py: 3,
                bg: "#3f5f9a",
                color: "white",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "lg",
                textDecoration: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  bg: "#25365c",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px #25365c",
                },
              },
            },
          }}
        >
          <div className="promo-content">
            <h2 className="promo-title">Спеціальна пропозиція!</h2>
            <p className="promo-text">
              Безкоштовна доставка при замовленні від $1000. Швидко, надійно та
              зручно. Оформіть замовлення вже сьогодні!
            </p>
            <Link to="/category/smartphones" className="promo-button">
              <TrendingUp size={20} />
              Переглянути пропозиції
            </Link>
          </div>
        </motion.div>

        {/* Рекомендовані товари */}
        {!loading && featuredProducts.length > 0 && (
          <FeaturedProducts featuredProducts={featuredProducts} />
        )}
      </div>
    </Box>
  );
};

export default HomePage;
