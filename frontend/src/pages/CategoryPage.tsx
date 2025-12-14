/** @jsxImportSource theme-ui */
import { useEffect, useState, useMemo, ChangeEvent } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Box } from "theme-ui";
import ProductCard from "../components/ProductCard";
import { getCategoryName } from "../utils/categoryNames";
import { Search, SlidersHorizontal, X, ArrowUpDown, Star } from "lucide-react";
import { Product } from "../types";

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

const CategoryPage = (): JSX.Element => {
  const { fetchProductsByCategory, products } = useProductStore();
  const { category } = useParams<{ category: string }>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  useEffect(() => {
    if (category) {
      fetchProductsByCategory(category);
    }
  }, [fetchProductsByCategory, category]);

  const categoryName = getCategoryName(category || "");

  const filteredProducts = useMemo(() => {
    let filtered: Product[] = [...products];

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter(
        (product) => product.price >= Number(minPrice)
      );
    }
    if (maxPrice) {
      filtered = filtered.filter(
        (product) => product.price <= Number(maxPrice)
      );
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter((product) => product.isFeatured === true);
    }

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchQuery, minPrice, maxPrice, sortBy, showFeaturedOnly]);

  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  const clearFilters = (): void => {
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
    setShowFeaturedOnly(false);
  };

  const hasActiveFilters =
    searchQuery ||
    minPrice ||
    maxPrice ||
    sortBy !== "default" ||
    showFeaturedOnly;

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
          py: [5, 4],
          ".category-title": {
            textAlign: "center",
            fontSize: ["2.3rem", "3rem"],
            fontWeight: 900,
            color: "emerald400",
            fontFamily: "oswald",
            letterSpacing: "2px",
            mb: 4,
          },
          ".filters-section": {
            mb: 4,
            ".filters-header": {
              display: "flex",
              flexDirection: ["column", "row"],
              alignItems: ["stretch", "center"],
              justifyContent: "space-between",
              gap: 3,
              mb: 3,
              ".search-wrapper": {
                position: "relative",
                flex: 1,
                maxWidth: ["100%", "400px"],
                ".search-input": {
                  width: "100%",
                  py: 2,
                  px: 4,
                  pl: "3rem",
                  bg: "gray800",
                  border: "1px solid",
                  borderColor: "gray700",
                  borderRadius: "lg",
                  color: "white",
                  fontSize: "1rem",
                  "&::placeholder": {
                    color: "gray500",
                  },
                  "&:focus": {
                    outline: "none",
                    borderColor: "emerald400",
                    boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)",
                  },
                },
                ".search-icon": {
                  position: "absolute",
                  left: 3,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "gray500",
                },
              },
              ".filters-controls": {
                display: "flex",
                gap: 2,
                alignItems: "center",
                ".filter-button": {
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  px: 3,
                  py: 2,
                  bg: "gray800",
                  border: "1px solid",
                  borderColor: "gray700",
                  borderRadius: "lg",
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bg: "gray700",
                    borderColor: "emerald400",
                  },
                  "&.active": {
                    bg: "#3f5f9a",
                    borderColor: "#3f5f9a",
                  },
                },
                ".sort-select": {
                  px: 3,
                  py: 2,
                  bg: "gray800",
                  border: "1px solid",
                  borderColor: "gray700",
                  borderRadius: "lg",
                  color: "white",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  "&:focus": {
                    outline: "none",
                    borderColor: "emerald400",
                  },
                },
              },
            },
            ".filters-panel": {
              bg: "gray800",
              borderRadius: "lg",
              p: 4,
              border: "1px solid",
              borderColor: "gray700",
              mb: 3,
              ".filters-panel-header": {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
                ".filters-panel-title": {
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                },
                ".clear-filters": {
                  px: 3,
                  py: 1,
                  bg: "transparent",
                  border: "1px solid",
                  borderColor: "gray600",
                  borderRadius: "md",
                  color: "gray400",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  "&:hover": {
                    borderColor: "emerald400",
                    color: "emerald400",
                  },
                },
              },
              ".filters-content": {
                display: "grid",
                gridTemplateColumns: [
                  "1fr",
                  "1fr",
                  "repeat(2, 1fr)",
                  "repeat(3, 1fr)",
                ],
                gap: 4,
                ".filter-group": {
                  ".filter-label": {
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "gray400",
                    mb: 2,
                  },
                  ".price-inputs": {
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                    ".price-input": {
                      flex: 1,
                      py: 2,
                      px: 3,
                      bg: "gray700",
                      border: "1px solid",
                      borderColor: "gray600",
                      borderRadius: "md",
                      color: "white",
                      fontSize: "0.875rem",
                      "&::placeholder": {
                        color: "gray500",
                      },
                      "&:focus": {
                        outline: "none",
                        borderColor: "emerald400",
                      },
                    },
                    ".price-separator": {
                      color: "gray500",
                    },
                  },
                  ".featured-checkbox": {
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    cursor: "pointer",
                    ".checkbox-input": {
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                      accentColor: "emerald400",
                    },
                    ".checkbox-label": {
                      color: "gray300",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    },
                  },
                },
              },
            },
            ".results-info": {
              mb: 3,
              color: "gray400",
              fontSize: "0.875rem",
              display: "flex",
              alignItems: "center",
              gap: 2,
              ".results-count": {
                color: "emerald400",
                fontWeight: 600,
              },
            },
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
          {categoryName}
        </motion.h1>

        <div className="filters-section">
          <div className="filters-header">
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Пошук товарів..."
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
            <div className="filters-controls">
              <button
                className={`filter-button ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={18} />
                <span>Фільтри</span>
              </button>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSortBy(e.target.value as SortOption)
                }
              >
                <option value="default">За замовчуванням</option>
                <option value="price-asc">Ціна: від дешевих</option>
                <option value="price-desc">Ціна: від дорогих</option>
                <option value="name-asc">Назва: А-Я</option>
                <option value="name-desc">Назва: Я-А</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <motion.div
              className="filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filters-panel-header">
                <h3 className="filters-panel-title">
                  <SlidersHorizontal size={20} />
                  Фільтри
                </h3>
                {hasActiveFilters && (
                  <button className="clear-filters" onClick={clearFilters}>
                    <X size={16} />
                    Очистити
                  </button>
                )}
              </div>
              <div className="filters-content">
                <div className="filter-group">
                  <label className="filter-label">Діапазон ціни</label>
                  <div className="price-inputs">
                    <input
                      type="number"
                      className="price-input"
                      placeholder={`Від ${priceRange.min}`}
                      value={minPrice}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setMinPrice(e.target.value)
                      }
                      min={priceRange.min}
                      max={priceRange.max}
                    />
                    <span className="price-separator">-</span>
                    <input
                      type="number"
                      className="price-input"
                      placeholder={`До ${priceRange.max}`}
                      value={maxPrice}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setMaxPrice(e.target.value)
                      }
                      min={priceRange.min}
                      max={priceRange.max}
                    />
                  </div>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Додаткові опції</label>
                  <div className="featured-checkbox">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      id="featured-only"
                      checked={showFeaturedOnly}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setShowFeaturedOnly(e.target.checked)
                      }
                    />
                    <label htmlFor="featured-only" className="checkbox-label">
                      <Star size={16} />
                      Тільки рекомендовані
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="results-info">
            Знайдено товарів:{" "}
            <span className="results-count">
              {filteredProducts.length}{" "}
              {filteredProducts.length !== products.length &&
                `з ${products.length}`}
            </span>
          </div>
        </div>

        <motion.div
          className="products-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {filteredProducts?.length === 0 && (
            <h2 className="empty-message">
              {products?.length === 0
                ? "Товари не знайдено"
                : "За вашими фільтрами товарів не знайдено"}
            </h2>
          )}

          {filteredProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </motion.div>
      </div>
    </Box>
  );
};

export default CategoryPage;
