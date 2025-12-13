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

const CartPage = (): JSX.Element => {
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
              ".sidebar-content": {
                display: "flex",
                flexDirection: "column",
                gap: 4,
              },
            },
          },
          ".empty-cart": {
            textAlign: "center",
            py: 12,
            ".empty-title": {
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "gray300",
              mb: 2,
            },
            ".empty-text": {
              fontSize: "1rem",
              color: "gray400",
              mb: 4,
            },
            ".shop-link": {
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              px: 4,
              py: 2,
              bg: "#3f5f9a",
              color: "white",
              textDecoration: "none",
              borderRadius: "md",
              "&:hover": {
                bg: "#324a7c",
              },
            },
          },
        },
      }}
    >
      <div className="cart-container">
        {cart.length === 0 ? (
          <motion.div
            className="empty-cart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="empty-title">Ваш кошик порожній</h2>
            <p className="empty-text">
              Додайте товари до кошика, щоб продовжити покупки
            </p>
            <Link to="/" className="shop-link">
              <ShoppingCart size={20} />
              Перейти до покупок
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="cart-layout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="cart-items-section">
              <div className="cart-items-list">
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            </div>

            <div className="cart-sidebar">
              <div className="sidebar-content">
                <OrderSummary />
                <GiftCouponCard />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {cart.length > 0 && (
        <Box sx={{ px: 5 }}>
          <PeopleAlsoBought />
        </Box>
      )}
    </Box>
  );
};

export default CartPage;
