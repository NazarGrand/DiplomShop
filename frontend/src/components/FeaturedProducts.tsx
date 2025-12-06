/** @jsxImportSource theme-ui */
import classNames from "classnames";
import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Box } from "theme-ui";
import { useCartStore } from "../stores/useCartStore";
import { Product } from "../types";

interface FeaturedProductsProps {
  featuredProducts: Product[];
}

const FeaturedProducts = ({
  featuredProducts,
}: FeaturedProductsProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);

  const { addToCart } = useCartStore();

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = (): void => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  const prevSlide = (): void => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  return (
    <Box
      className="featured-products"
      sx={{
        py: 12,
        ".featured-container": {
          maxWidth: "1280px",
          mx: "auto",
          px: 4,
          ".featured-title": {
            textAlign: "center",
            fontSize: ["3rem", "3.75rem"],
            fontWeight: 900,
            color: "emerald400",
            m: 0,
            mb: 3,
            fontFamily: "oswald",
            letterSpacing: "1px",
            "-webkit-text-stroke": "1.9px #2a3a46",
          },
          ".carousel-container": {
            position: "relative",
            ".carousel-wrapper": {
              overflow: "hidden",
              ".carousel-track": {
                display: "flex",
                transition: "transform 0.5s ease",
                gap: 4,
                ".carousel-item": {
                  minWidth: "100%",
                  ".product-card": {
                    bg: "gray800",
                    borderRadius: "lg",
                    p: 4,
                    border: "1px solid",
                    borderColor: "gray700",
                    ".product-image-wrapper": {
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1 / 1",
                      mb: 3,
                      borderRadius: "md",
                      overflow: "hidden",
                      ".product-image": {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    },
                    ".product-name": {
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "white",
                      mb: 2,
                    },
                    ".product-price": {
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "emerald400",
                      mb: 3,
                    },
                    ".add-to-cart-button": {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      width: "100%",
                      py: 2,
                      px: 4,
                      bg: "#3f5f9a",
                      color: "white",
                      borderRadius: "md",
                      border: "none",
                      cursor: "pointer",
                      "&:hover": {
                        bg: "#324a7c",
                      },
                    },
                  },
                },
              },
            },
            ".carousel-button": {
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              bg: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              borderRadius: "full",
              p: 2,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              "&:hover": {
                bg: "rgba(0, 0, 0, 0.7)",
              },
              "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed",
              },
              "&.prev": {
                left: 0,
              },
              "&.next": {
                right: 0,
              },
            },
          },
        },
      }}
    >
      <div className="featured-container">
        <h2 className="featured-title">Рекомендовані товари</h2>
        <div className="carousel-container">
          <div className="carousel-wrapper">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${
                  (currentIndex / itemsPerPage) * 100
                }%)`,
                display: "grid",
                gridTemplateColumns: `repeat(${
                  featuredProducts.length
                }, calc((100% - ${
                  (itemsPerPage - 1) * 16
                }px) / ${itemsPerPage}))`,
              }}
            >
              {featuredProducts.map((product) => {
                const productImage =
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : product.image || "";

                return (
                  <div key={product._id} className="carousel-item">
                    <div className="product-card">
                      <div className="product-image-wrapper">
                        <img
                          src={productImage}
                          alt={product.name}
                          className="product-image"
                        />
                      </div>
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">
                        {Math.round(product.price)} ₴
                      </p>
                      <button
                        className="add-to-cart-button"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart size={20} />
                        Додати до кошика
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {featuredProducts.length > itemsPerPage && (
            <>
              <button
                className={classNames("carousel-button", "prev")}
                onClick={prevSlide}
                disabled={isStartDisabled}
                aria-label="Попередній слайд"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className={classNames("carousel-button", "next")}
                onClick={nextSlide}
                disabled={isEndDisabled}
                aria-label="Наступний слайд"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      </div>
    </Box>
  );
};

export default FeaturedProducts;
