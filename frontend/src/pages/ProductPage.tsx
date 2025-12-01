/** @jsxImportSource theme-ui */
import { useEffect, useState, MouseEvent, ChangeEvent } from "react";
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
  X,
  Plus,
  Minus,
  ZoomIn,
  CreditCard,
  Info,
  Truck,
  Shield,
  HelpCircle,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import axios from "../lib/axios";
import { getCategoryName } from "../utils/categoryNames";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import PeopleAlsoBought from "../components/PeopleAlsoBought";

const stripePromise = loadStripe(
  "pk_test_51SYO3gRlJ2mGTNHuHYieNyIHQs5h3tH0rbzwjybUnWZ72baZiHoT3gBqq8EaXDXna1EwZiAPhzfqbyXMJ5WiWNPq00EjO9EieW"
);

interface FAQ {
  question: string;
  answer: string;
}

const ProductPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const { fetchProductById, currentProduct, loading } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useUserStore();
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [id, fetchProductById]);

  const productImages =
    currentProduct?.images && currentProduct.images.length > 0
      ? currentProduct.images
      : currentProduct?.image
      ? [currentProduct.image]
      : [];

  const nextImage = (): void => {
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (): void => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleAddToCart = (): void => {
    if (!user) {
      toast.error("Будь ласка, увійдіть, щоб додати товари до кошика", {
        id: "login",
      });
      return;
    }
    if (currentProduct) {
      for (let i = 0; i < quantity; i++) {
        addToCart(currentProduct);
      }
      toast.success(`Додано ${quantity} шт. до кошика`);
      setQuantity(1);
    }
  };

  const openLightbox = (index: number): void => {
    setLightboxImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = (): void => {
    setLightboxOpen(false);
    document.body.style.overflow = "unset";
  };

  const lightboxNextImage = (): void => {
    setLightboxImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const lightboxPrevImage = (): void => {
    setLightboxImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const increaseQuantity = (): void => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = (): void => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleBuyNow = async (): Promise<void> => {
    if (!user) {
      toast.error("Будь ласка, увійдіть, щоб оформити замовлення", {
        id: "login",
      });
      return;
    }
    if (!currentProduct) return;

    try {
      const stripe: Stripe | null = await stripePromise;
      if (!stripe) {
        toast.error("Помилка при завантаженні платіжної системи");
        return;
      }

      const productImage =
        currentProduct.images && currentProduct.images.length > 0
          ? currentProduct.images[0]
          : currentProduct.image || "";

      const res = await axios.post<{ id: string }>("/payments/create-checkout-session", {
        products: [
          {
            _id: currentProduct._id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: productImage,
            quantity: quantity,
          },
        ],
        couponCode: null,
      });

      const session = res.data;
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        toast.error("Помилка при оформленні замовлення");
        console.error("Error:", result.error);
      }
    } catch (error) {
      toast.error("Помилка при оформленні замовлення");
      console.error("Error:", error);
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

  const faqs: FAQ[] = [
    {
      question: "Як швидко я отримаю замовлення?",
      answer:
        "Доставка здійснюється протягом 1-3 робочих днів по всій Україні. При замовленні до 12:00 можлива доставка в той самий день (залежить від міста).",
    },
    {
      question: "Чи можна повернути товар?",
      answer:
        "Так, ви можете повернути товар протягом 14 днів з моменту покупки, якщо він не використовувався та зберігає товарний вигляд. Повернення коштів здійснюється протягом 5-7 робочих днів.",
    },
    {
      question: "Яка гарантія на товар?",
      answer:
        "На всі товари надається офіційна гарантія від виробника. Термін гарантії залежить від категорії товару та вказаний в документації. Ми надаємо повну підтримку протягом гарантійного періоду.",
    },
    {
      question: "Чи є можливість оплатити при отриманні?",
      answer:
        "Так, ми підтримуємо оплату готівкою або карткою при отриманні товару. Також доступна оплата онлайн через безпечні платіжні системи.",
    },
    {
      question: "Чи можна забрати товар самовивозом?",
      answer:
        "Так, ви можете забрати товар з наших магазинів. Після оформлення замовлення ми повідомимо вас про готовність товару до видачі. Самовивіз безкоштовний.",
    },
  ];

  return (
    <Box
      className="product-page"
      sx={{
        minHeight: "100vh",
        "& > .product-container": {
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          mx: "auto",
          px: ["1rem", "1.5rem", "2rem"],
          pt: 6,
          pb: 3,
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
            gap: 6,
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
                cursor: "pointer",
                ".main-image": {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                },
                "&:hover .main-image": {
                  transform: "scale(1.05)",
                },
                ".zoom-button": {
                  position: "absolute",
                  top: 2,
                  right: 2,
                  p: 2,
                  borderRadius: "full",
                  bg: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  opacity: 0,
                  "&:hover": {
                    bg: "rgba(0, 0, 0, 0.8)",
                  },
                },
                "&:hover .zoom-button": {
                  opacity: 1,
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
                mt: 2,
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
                    borderColor: "#3f5f9a",
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
                ".quantity-controls": {
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  ".quantity-button": {
                    cursor: "pointer",
                  },
                },
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
            <div
              className="image-slider"
              onClick={() => openLightbox(currentImageIndex)}
            >
              {productImages.length > 0 && (
                <>
                  <img
                    src={productImages[currentImageIndex]}
                    alt={currentProduct.name}
                    className="main-image"
                  />
                  <button
                    className="zoom-button"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      openLightbox(currentImageIndex);
                    }}
                    aria-label="Збільшити зображення"
                  >
                    <ZoomIn size={20} />
                  </button>
                </>
              )}
              {productImages.length > 1 && (
                <>
                  <button
                    className={`slider-button prev ${
                      productImages.length <= 1 ? "hidden" : ""
                    }`}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className={`slider-button next ${
                      productImages.length <= 1 ? "hidden" : ""
                    }`}
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      nextImage();
                    }}
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

            {currentProduct.specifications &&
              currentProduct.specifications.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    ".specifications-title": {
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "emerald400",
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    },
                    ".specifications-list": {
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      ".spec-item": {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 2,
                        px: 3,
                        bg: "gray800",
                        borderRadius: "md",
                        border: "1px solid",
                        borderColor: "gray700",
                        ".spec-name": {
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "gray400",
                        },
                        ".spec-value": {
                          fontSize: "0.875rem",
                          color: "white",
                          fontWeight: 500,
                        },
                      },
                    },
                  }}
                >
                  <h3 className="specifications-title">
                    <Info size={20} />
                    Характеристики
                  </h3>
                  <div className="specifications-list">
                    {currentProduct.specifications.map((spec, index) => (
                      <div key={index} className="spec-item">
                        <span className="spec-name">{spec.name}</span>
                        <span className="spec-value">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </Box>
              )}

            <div className="product-actions">
              <div className="quantity-selector">
                <span className="quantity-label">Кількість:</span>
                <div className="quantity-controls">
                  <button
                    className="quantity-button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="Зменшити кількість"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={increaseQuantity}
                    aria-label="Збільшити кількість"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <button className="add-to-cart-button" onClick={handleAddToCart}>
                <ShoppingCart size={22} />
                Додати до кошика ({quantity} шт.)
              </button>

              <Box
                as="button"
                className="buy-now-button"
                onClick={handleBuyNow}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  width: "100%",
                  py: 3,
                  px: 4,
                  bg: "#324a7c",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "lg",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bg: "#2563eb",
                  },
                  "&:focus": {
                    outline: "none",
                    boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.3)",
                  },
                }}
              >
                <CreditCard size={22} />
                Купити зараз
              </Box>

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

      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1280px",
          mx: "auto",
          px: ["1rem", "1.5rem", "2rem"],
          py: 3,
          ".info-sections": {
            display: "grid",
            gridTemplateColumns: ["1fr", "1fr", "1fr 1fr"],
            gap: 6,
            mb: 5,
            ".info-section": {
              bg: "gray800",
              borderRadius: "lg",
              p: 4,
              border: "1px solid",
              borderColor: "gray700",
              ".section-header": {
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 3,
                ".section-icon": {
                  color: "emerald400",
                },
                ".section-title": {
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "white",
                },
              },
              ".section-content": {
                color: "gray300",
                lineHeight: 1.7,
                ".benefit-item": {
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2,
                  ".benefit-icon": {
                    color: "emerald400",
                    flexShrink: 0,
                  },
                },
              },
            },
          },
          ".faq-section": {
            bg: "gray800",
            borderRadius: "lg",
            p: 4,
            border: "1px solid",
            borderColor: "gray700",
            ".faq-title": {
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "emerald400",
              mb: 4,
              display: "flex",
              alignItems: "center",
              gap: 2,
            },
            ".faq-item": {
              mb: 2,
              borderBottom: "1px solid",
              borderColor: "gray700",
              "&:last-child": {
                borderBottom: "none",
                mb: 0,
              },
              ".faq-question": {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 3,
                cursor: "pointer",
                color: "white",
                fontSize: "1rem",
                fontWeight: 600,
                transition: "color 0.2s ease",
                "&:hover": {
                  color: "emerald400",
                },
                ".faq-icon": {
                  transition: "transform 0.3s ease",
                  color: "emerald400",
                  "&.open": {
                    transform: "rotate(180deg)",
                  },
                },
              },
              ".faq-answer": {
                maxHeight: 0,
                overflow: "hidden",
                transition: "max-height 0.3s ease, padding 0.3s ease",
                color: "gray300",
                lineHeight: 1.7,
                "&.open": {
                  maxHeight: "500px",
                  pb: 3,
                },
              },
            },
          },
        }}
      >
        <div className="info-sections">
          <motion.div
            className="info-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="section-header">
              <Truck className="section-icon" size={24} />
              <h3 className="section-title">Доставка та повернення</h3>
            </div>
            <div className="section-content">
              <div className="benefit-item">
                <CheckCircle className="benefit-icon" size={18} />
                <span>Безкоштовна доставка при замовленні від $1000</span>
              </div>
              <div className="benefit-item">
                <CheckCircle className="benefit-icon" size={18} />
                <span>Швидка доставка 1-3 дні по всій Україні</span>
              </div>
              <div className="benefit-item">
                <CheckCircle className="benefit-icon" size={18} />
                <span>Можливість повернення протягом 14 днів</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="info-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="section-header">
              <Shield className="section-icon" size={24} />
              <h3 className="section-title">Гарантія та підтримка</h3>
            </div>
            <div className="section-content">
              <div className="benefit-item">
                <CheckCircle className="benefit-icon" size={18} />
                <span>Офіційна гарантія від виробника</span>
              </div>
              <div className="benefit-item">
                <CheckCircle className="benefit-icon" size={18} />
                <span>Технічна підтримка 24/7</span>
              </div>
              <div className="benefit-item">
                <CheckCircle className="benefit-icon" size={18} />
                <span>Оригінальні запчастини та аксесуари</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="faq-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="faq-title">
            <HelpCircle size={24} />
            Часті питання
          </h2>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div
                className="faq-question"
                onClick={() =>
                  setOpenFaqIndex(openFaqIndex === index ? null : index)
                }
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`faq-icon ${openFaqIndex === index ? "open" : ""}`}
                  size={20}
                />
              </div>
              <div
                className={`faq-answer ${openFaqIndex === index ? "open" : ""}`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </motion.div>
      </Box>

      {lightboxOpen && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            bg: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ".lightbox-content": {
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "80vh",
              ".lightbox-image": {
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              },
              ".lightbox-close": {
                position: "absolute",
                top: "-2.5rem",
                right: 0,
                p: 1,
                bg: "transparent",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "full",
                transition: "all 0.2s ease",
                "&:hover": {
                  bg: "rgba(255, 255, 255, 0.1)",
                },
              },
              ".lightbox-nav": {
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                p: 3,
                bg: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "full",
                transition: "all 0.2s ease",
                "&:hover": {
                  bg: "rgba(0, 0, 0, 0.7)",
                },
                "&.prev": {
                  left: "-4rem",
                },
                "&.next": {
                  right: "-4rem",
                },
              },
              ".lightbox-thumbnails": {
                position: "absolute",
                bottom: "-4.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 2,
                maxWidth: "90vw",
                overflowX: "auto",
                padding: "0.5rem",
                "&::-webkit-scrollbar": {
                  height: "4px",
                },
                "&::-webkit-scrollbar-track": {
                  bg: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "2px",
                },
                "&::-webkit-scrollbar-thumb": {
                  bg: "rgba(255, 255, 255, 0.3)",
                  borderRadius: "2px",
                  "&:hover": {
                    bg: "rgba(255, 255, 255, 0.5)",
                  },
                },
                ".lightbox-thumbnail": {
                  width: "60px",
                  height: "60px",
                  borderRadius: "md",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor: "gray600",
                  transition: "all 0.2s ease",
                  opacity: 0.7,
                  "&.active": {
                    borderColor: "emerald400",
                    opacity: 1,
                    transform: "scale(1.1)",
                  },
                  "&:hover": {
                    borderColor: "emerald500",
                    opacity: 1,
                  },
                },
              },
            },
          }}
          onClick={closeLightbox}
        >
          <div
            className="lightbox-content"
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={closeLightbox}
              aria-label="Закрити"
            >
              <X size={24} />
            </button>
            {productImages.length > 0 && (
              <img
                src={productImages[lightboxImageIndex]}
                alt={`${currentProduct.name} ${lightboxImageIndex + 1}`}
                className="lightbox-image"
              />
            )}
            {productImages.length > 1 && (
              <>
                <button
                  className="lightbox-nav prev"
                  onClick={lightboxPrevImage}
                  aria-label="Попереднє зображення"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  className="lightbox-nav next"
                  onClick={lightboxNextImage}
                  aria-label="Наступне зображення"
                >
                  <ChevronRight size={32} />
                </button>
                <div className="lightbox-thumbnails">
                  {productImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${currentProduct.name} thumbnail ${index + 1}`}
                      className={`lightbox-thumbnail ${
                        index === lightboxImageIndex ? "active" : ""
                      }`}
                      onClick={() => setLightboxImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Box>
      )}
    </Box>
  );
};

export default ProductPage;

