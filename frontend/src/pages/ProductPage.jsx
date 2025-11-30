/** @jsxImportSource theme-ui */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Box } from "theme-ui";
import {
  ShoppingCart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Package,
  Tag,
} from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { getCategoryName } from "../utils/categoryNames";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import PeopleAlsoBought from "../components/PeopleAlsoBought";

const ProductPage = () => {
  const { id } = useParams();
  const { fetchProductById, currentProduct, loading } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useUserStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  const productImages = currentProduct?.image ? [currentProduct.image] : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Будь ласка, увійдіть, щоб додати товари до кошика", {
        id: "login",
      });
      return;
    }
    if (currentProduct) {
      addToCart(currentProduct);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentProduct) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 4,
          ".error-title": {
            fontSize: "2rem",
            fontWeight: 700,
            color: "white",
          },
          ".back-button": {
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 4,
            py: 2,
            bg: "emerald600",
            color: "white",
            textDecoration: "none",
            borderRadius: "md",
            "&:hover": {
              bg: "emerald700",
            },
          },
        }}
      >
        <h2 className="error-title">Товар не знайдено</h2>
        <Link to="/" className="back-button">
          <ArrowLeft size={20} />
          Повернутися на головну
        </Link>
      </Box>
    );
  }

  const categoryName = getCategoryName(currentProduct.category);

  return (
    <Box
      className="product-page"
      sx={{
        minHeight: "100vh",
        // Обмежуємо область дії стилів тільки до .product-container та його прямих нащадків
        "& > .product-container": {
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          mx: "auto",
          px: ["1rem", "1.5rem", "2rem"],
          py: 6,
          ".breadcrumbs": {
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
            fontSize: "0.875rem",
            ".breadcrumb-link": {
              color: "gray400",
              textDecoration: "none",
              "&:hover": {
                color: "emerald400",
              },
            },
            ".breadcrumb-separator": {
              color: "gray600",
            },
            ".breadcrumb-current": {
              color: "emerald400",
            },
          },
          ".product-content": {
            display: "grid",
            gridTemplateColumns: ["1fr", "1fr", "1fr 1fr"],
            gap: 5,
            mb: 5,
            ".product-images": {
              ".image-slider": {
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: "lg",
                overflow: "hidden",
                bg: "gray800",
                border: "1px solid",
                borderColor: "gray700",
                ".main-image": {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                },
                ".slider-button": {
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  p: 2,
                  borderRadius: "full",
                  bg: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bg: "rgba(0, 0, 0, 0.7)",
                  },
                  "&.prev": {
                    left: 2,
                  },
                  "&.next": {
                    right: 2,
                  },
                  "&.hidden": {
                    // display: "none",
                  },
                },
              },
              ".thumbnail-images": {
                display: "flex",
                gap: 2,
                mt: 4,
                ".thumbnail": {
                  width: "80px",
                  height: "80px",
                  borderRadius: "md",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: "gray700",
                  transition: "all 0.2s ease",
                  "&.active": {
                    borderColor: "emerald400",
                  },
                  "&:hover": {
                    borderColor: "emerald500",
                  },
                },
              },
            },
            ".product-info": {
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ".product-title": {
                fontSize: ["2rem", "2.5rem", "3rem"],
                fontWeight: 900,
                color: "emerald400",
                fontFamily: "oswald",
                letterSpacing: "1px",
                lineHeight: 1.2,
              },
              ".product-category": {
                display: "flex",
                alignItems: "center",
                gap: 2,
                fontSize: "1rem",
                color: "gray400",
                ".category-link": {
                  color: "emerald400",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                },
              },
              ".product-price": {
                fontSize: ["2rem", "2.5rem"],
                fontWeight: 700,
                color: "white",
              },
              ".product-description": {
                fontSize: "1.125rem",
                lineHeight: 1.7,
                color: "gray300",
              },
              ".product-actions": {
                display: "flex",
                flexDirection: "column",
                gap: 3,
                ".add-to-cart-button": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  width: "100%",
                  py: 3,
                  px: 4,
                  bg: "#3f5f9a",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "lg",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bg: "#324a7c",
                  },
                  "&:focus": {
                    outline: "none",
                    boxShadow: "0 0 0 4px rgba(63, 95, 154, 0.3)",
                  },
                },
                ".product-features": {
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  ".feature-item": {
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    fontSize: "0.875rem",
                    color: "gray400",
                    ".feature-icon": {
                      color: "emerald400",
                    },
                  },
                },
              },
            },
          },
        },
      }}
    >
      <div className="product-container">
        <motion.div
          className="breadcrumbs"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="breadcrumb-link">
            Головна
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link
            to={`/category/${currentProduct.category}`}
            className="breadcrumb-link"
          >
            {categoryName}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{currentProduct.name}</span>
        </motion.div>

        <motion.div
          className="product-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="product-images">
            <div className="image-slider">
              {productImages.length > 0 && (
                <img
                  src={productImages[currentImageIndex]}
                  alt={currentProduct.name}
                  className="main-image"
                />
              )}
              {productImages.length > 1 && (
                <>
                  <button
                    className={`slider-button prev ${
                      productImages.length <= 1 ? "hidden" : ""
                    }`}
                    onClick={prevImage}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className={`slider-button next ${
                      productImages.length <= 1 ? "hidden" : ""
                    }`}
                    onClick={nextImage}
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="thumbnail-images">
                {productImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${currentProduct.name} ${index + 1}`}
                    className={`thumbnail ${
                      index === currentImageIndex ? "active" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="product-info">
            <h1 className="product-title">{currentProduct.name}</h1>

            <div className="product-category">
              <Tag size={18} />
              <span>
                Категорія:{" "}
                <Link
                  to={`/category/${currentProduct.category}`}
                  className="category-link"
                >
                  {categoryName}
                </Link>
              </span>
            </div>

            <div className="product-price">
              ${currentProduct.price.toFixed(2)}
            </div>

            <p className="product-description">{currentProduct.description}</p>

            <div className="product-actions">
              <button className="add-to-cart-button" onClick={handleAddToCart}>
                <ShoppingCart size={22} />
                Додати до кошика
              </button>

              <div className="product-features">
                <div className="feature-item">
                  <Package className="feature-icon" size={18} />
                  <span>Швидка доставка</span>
                </div>
                <div className="feature-item">
                  <Package className="feature-icon" size={18} />
                  <span>Гарантія якості</span>
                </div>
                <div className="feature-item">
                  <Package className="feature-icon" size={18} />
                  <span>Оригінальна продукція</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          mx: "auto",
          px: ["1rem", "1.5rem", "2rem"],
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <PeopleAlsoBought />
        </motion.div>
      </Box>
    </Box>
  );
};

export default ProductPage;
