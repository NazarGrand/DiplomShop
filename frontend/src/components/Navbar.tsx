/** @jsxImportSource theme-ui */
import classNames from "classnames";
import {
  ShoppingCart,
  UserPlus,
  LogIn,
  LogOut,
  Grid3x3,
  Scale,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Box } from "theme-ui";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useCompareStore } from "../stores/useCompareStore";
import { MouseEvent } from "react";

const Navbar = (): JSX.Element => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();
  const { compareProducts } = useCompareStore();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const scrollToCategories = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    if (isHomePage) {
      const categoriesSection = document.getElementById("categories-section");
      if (categoriesSection) {
        categoriesSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const handleHomeClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    if (isHomePage) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Box
      as="header"
      className="navbar"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        bg: "rgba(17, 24, 39, 0.9)",
        backdropFilter: "blur(12px)",
        boxShadow: "medium",
        zIndex: 40,
        transition: "all 0.3s ease",
        borderBottom: "1px solid",
        borderColor: "#4a6fae",
        ".navbar-container": {
          maxWidth: "1280px",
          mx: "auto",
          px: 4,
          py: 3,
          ".navbar-content": {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            ".navbar-logo": {
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "emerald400",
              display: "flex",
              alignItems: "center",
              gap: 2,
              textDecoration: "none",
            },
            ".navbar-nav": {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: [3, 4],
              ".nav-link": {
                color: "gray300",
                textDecoration: "none",
                transition: "color 0.3s ease-in-out",
                "&:hover": {
                  color: "emerald400",
                },
              },
              ".cart-link": {
                position: "relative",
                display: "flex",
                alignItems: "center",
                color: "gray300",
                textDecoration: "none",
                transition: "color 0.3s ease-in-out",
                "&:hover": {
                  color: "emerald400",
                  ".cart-icon": {
                    color: "emerald400",
                  },
                },
                ".cart-icon": {
                  display: "inline-block",
                  mr: 1,
                  transition: "color 0.3s ease-in-out",
                },
                ".cart-text": {
                  display: ["none", "inline"],
                },
                ".cart-badge": {
                  position: "absolute",
                  top: "-8px",
                  left: "-8px",
                  bg: "#1a73e8",
                  color: "white",
                  borderRadius: "full",
                  px: 2,
                  py: "2px",
                  fontSize: "0.75rem",
                  transition: "background-color 0.3s ease-in-out",
                  "&:hover": {
                    bg: "#4dbeff",
                  },
                },
              },
              ".nav-button": {
                display: "flex",
                alignItems: "center",
                px: [3, 4],
                py: [1, 2],
                borderRadius: "md",
                fontWeight: 500,
                transition: "all 0.3s ease-in-out",
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
                "&.primary": {
                  bg: "emerald700",
                  color: "white",
                  "&:hover": {
                    bg: "emerald600",
                  },
                  ".button-icon": {
                    display: "inline-block",
                    mr: 1,
                  },
                  ".button-text": {
                    display: ["none", "inline"],
                  },
                },
                "&.secondary": {
                  bg: "gray700",
                  color: "white",
                  "&:hover": {
                    bg: "gray600",
                  },
                  ".button-icon": {
                    mr: 2,
                  },
                  ".button-text": {
                    display: ["none", "inline"],
                    ml: 2,
                  },
                },
                "&.signup": {
                  bg: "#324a7c",
                  "&:hover": {
                    bg: "#25365c",
                  },
                },
              },
            },
          },
        },
      }}
    >
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            ElectroLab
          </Link>

          <nav className="navbar-nav">
            <Link to="/" className="nav-link" onClick={handleHomeClick}>
              Головна
            </Link>
            {isHomePage && (
              <Box
                as="a"
                href="#categories-section"
                className="nav-link"
                onClick={scrollToCategories}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Grid3x3 size={18} />
                Категорії
              </Box>
            )}
            {user && (
              <Link to="/cart" className="cart-link">
                <ShoppingCart className="cart-icon" size={20} />
                <span className="cart-text">Кошик</span>
                {cart.length > 0 && (
                  <span className="cart-badge">{cart.length}</span>
                )}
              </Link>
            )}
            {compareProducts.length > 0 && (
              <Link to="/compare" className="cart-link">
                <Scale className="cart-icon" size={20} />
                <span className="cart-text">Порівняти</span>
                {compareProducts.length > 0 && (
                  <span className="cart-badge">{compareProducts.length}</span>
                )}
              </Link>
            )}
            {user ? (
              <button
                className={classNames("nav-button", "secondary")}
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="button-text">Вийти</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className={classNames("nav-button", "primary", "signup")}
                >
                  <UserPlus className="button-icon" size={18} />
                  Реєстрація
                </Link>
                <Link
                  to="/login"
                  className={classNames("nav-button", "secondary")}
                >
                  <LogIn className="button-icon" size={18} />
                  Увійти
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </Box>
  );
};

export default Navbar;
