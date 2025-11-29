/** @jsxImportSource theme-ui */
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Box } from "theme-ui";
import CartItem from "../components/CartItem";
import PeopleAlsoBought from "../components/PeopleAlsoBought";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";

const CartPage = () => {
  const { cart } = useCartStore();

  return (
    <Box
      className="cart-page"
      sx={{
        py: 6,
        ".cart-container": {
          display: "flex",
          justifyContent: "center",
          alignSelf: "stretch",
          maxWidth: "1280px",
          mx: "auto",
          px: 2,
          ".cart-layout": {
            mt: 2,
            display: "flex",
            flexDirection: ["column", "column", "row"],
            gap: 4,
            alignItems: ["stretch", "stretch", "flex-start"],
            ".cart-items-section": {
              mx: "auto",
              width: "100%",
              flex: "none",
              maxWidth: ["100%", "100%", "672px", "896px"],
              ".cart-items-list": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
              },
            },
            ".cart-sidebar": {
              height: "100%",
              mx: "auto",
              mt: [2, 0],
              maxWidth: ["100%", "100%", "896px"],
              width: ["100%", "100%", "100%"],
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            },
          },
        },
      }}
    >
      <div className="cart-container">
        <div className="cart-layout">
          <motion.div
            className="cart-items-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {cart.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <div className="cart-items-list">
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}
            {cart.length > 0 && <PeopleAlsoBought />}
          </motion.div>

          {cart.length > 0 && (
            <motion.div
              className="cart-sidebar"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Box
                sx={{
                  position: "sticky",
                  top: "80px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <OrderSummary />
                <GiftCouponCard />
              </Box>
            </motion.div>
          )}
        </div>
      </div>
    </Box>
  );
};

export default CartPage;

const EmptyCartUI = () => (
  <motion.div
    className="empty-cart"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      py: 2,
      ".empty-cart-icon": {
        height: "96px",
        width: "96px",
        color: "gray300",
      },
      ".empty-cart-title": {
        fontSize: "1.5rem",
        fontWeight: 800,
        color: "white",
      },
      ".empty-cart-text": {
        fontSize: "1rem",
        color: "gray400",
      },
      ".empty-cart-link": {
        mt: 2,
        borderRadius: "md",
        bg: "emerald500",
        px: 2,
        py: 2,
        color: "white",
        textDecoration: "none",
        transition: "background-color 0.2s ease",
        "&:hover": {
          bg: "emerald600",
        },
      },
    }}
  >
    <ShoppingCart className="empty-cart-icon" />
    <h3 className="empty-cart-title">Ваш кошик порожній</h3>
    <p className="empty-cart-text">Схоже, ви ще нічого не додали до кошика.</p>
    <Link to="/" className="empty-cart-link">
      Почати покупки
    </Link>
  </motion.div>
);
