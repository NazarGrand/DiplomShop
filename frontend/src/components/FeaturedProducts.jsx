/** @jsxImportSource theme-ui */
import classNames from "classnames";
import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const FeaturedProducts = ({ featuredProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const { addToCart } = useCartStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else if (window.innerWidth < 1280) setItemsPerPage(3);
      else setItemsPerPage(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
  };

  const isStartDisabled = currentIndex === 0;
  const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

  return (
    <div
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
            fontWeight: 700,
            color: "emerald400",
            mb: 4,
          },
          ".featured-carousel": {
            position: "relative",
            ".carousel-wrapper": {
              overflow: "hidden",
              ".carousel-content": {
                display: "flex",
                transition: "transform 0.3s ease-in-out",
                ".carousel-item": {
                  width: ["100%", "50%", "33.333%", "25%"],
                  flexShrink: 0,
                  px: 2,
                  ".product-card": {
                    bg: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "lg",
                    boxShadow: "medium",
                    overflow: "hidden",
                    height: "100%",
                    transition: "all 0.3s ease",
                    border: "1px solid",
                    borderColor: "rgba(16, 185, 129, 0.3)",
                    "&:hover": {
                      boxShadow: "strong",
                    },
                    ".product-image-wrapper": {
                      overflow: "hidden",
                      ".product-image": {
                        width: "100%",
                        height: "192px",
                        objectFit: "cover",
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      },
                    },
                    ".product-info": {
                      p: 4,
                      ".product-name": {
                        fontSize: "1.125rem",
                        fontWeight: 600,
                        mb: 2,
                        color: "white",
                      },
                      ".product-price": {
                        color: "rgba(16, 185, 129, 0.8)",
                        fontWeight: 500,
                        mb: 4,
                      },
                      ".add-to-cart-btn": {
                        width: "100%",
                        bg: "emerald600",
                        "&:hover": {
                          bg: "emerald500",
                        },
                        color: "white",
                        fontWeight: 600,
                        py: 2,
                        px: 4,
                        borderRadius: "md",
                        transition: "background-color 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        border: "none",
                        ".btn-icon": {
                          width: "20px",
                          height: "20px",
                          mr: 2,
                        },
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
              p: 2,
              borderRadius: "full",
              transition: "background-color 0.3s ease",
              cursor: "pointer",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&.prev": {
                left: "-16px",
              },
              "&.next": {
                right: "-16px",
              },
              "&.disabled": {
                bg: "gray400",
                cursor: "not-allowed",
              },
              "&:not(.disabled)": {
                bg: "emerald600",
                "&:hover": {
                  bg: "emerald500",
                },
              },
              ".button-icon": {
                width: "24px",
                height: "24px",
              },
            },
          },
        },
      }}
    >
      <div className="featured-container">
        <h2 className="featured-title">Featured</h2>
        <div className="featured-carousel">
          <div className="carousel-wrapper">
            <div
              className="carousel-content"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerPage)
                }%)`,
              }}
            >
              {featuredProducts?.map((product) => (
                <div key={product._id} className="carousel-item">
                  <div className="product-card">
                    <div className="product-image-wrapper">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-price">
                        ${product.price.toFixed(2)}
                      </p>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="btn-icon" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={prevSlide}
            disabled={isStartDisabled}
            className={classNames(
              "carousel-button",
              "prev",
              isStartDisabled && "disabled"
            )}
          >
            <ChevronLeft className="button-icon" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isEndDisabled}
            className={classNames(
              "carousel-button",
              "next",
              isEndDisabled && "disabled"
            )}
          >
            <ChevronRight className="button-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
