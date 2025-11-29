/** @jsxImportSource theme-ui */
import classNames from "classnames";
import { ShoppingCart, UserPlus, LogIn, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Box } from "theme-ui";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const { cart } = useCartStore();

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
        borderColor: "emerald800",
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
              gap: 4,
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
                  bg: "emerald500",
                  color: "white",
                  borderRadius: "full",
                  px: 2,
                  py: "2px",
                  fontSize: "0.75rem",
                  transition: "background-color 0.3s ease-in-out",
                  "&:hover": {
                    bg: "emerald400",
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
                  bg: "emerald600",
                  "&:hover": {
                    bg: "emerald700",
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
            <Link to="/" className="nav-link">
              Головна
            </Link>
            {user && (
              <Link to="/cart" className="cart-link">
                <ShoppingCart className="cart-icon" size={20} />
                <span className="cart-text">Кошик</span>
                {cart.length > 0 && (
                  <span className="cart-badge">{cart.length}</span>
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
