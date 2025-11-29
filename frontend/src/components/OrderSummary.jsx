/** @jsxImportSource theme-ui */
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "../lib/axios";

const stripePromise = loadStripe(
  "pk_test_51SYO3gRlJ2mGTNHuHYieNyIHQs5h3tH0rbzwjybUnWZ72baZiHoT3gBqq8EaXDXna1EwZiAPhzfqbyXMJ5WiWNPq00EjO9EieW"
);

const OrderSummary = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useCartStore();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const res = await axios.post("/payments/create-checkout-session", {
      products: cart,
      couponCode: coupon ? coupon.code : null,
    });

    const session = res.data;
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error("Error:", result.error);
    }
  };

  return (
    <motion.div
      className="order-summary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "lg",
        border: "1px solid",
        borderColor: "gray700",
        bg: "gray800",
        p: 3,
        boxShadow: "soft",
        ".order-title": {
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "emerald400",
        },
        ".order-details": {
          display: "flex",
          flexDirection: "column",
          gap: 2,
          ".order-items": {
            display: "flex",
            flexDirection: "column",
            ".order-row": {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              ".order-label": {
                fontSize: "1rem",
                fontWeight: 400,
                color: "gray300",
              },
              ".order-value": {
                fontSize: "1rem",
                fontWeight: 500,
                color: "white",
              },
              "&.savings .order-value": {
                color: "emerald400",
              },
              "&.total": {
                margin: 0,
                borderTop: "1px solid",
                borderColor: "gray600",
                pt: 2,
                ".order-label": {
                  fontWeight: 700,
                  color: "white",
                },
                ".order-value": {
                  fontWeight: 700,
                  color: "emerald400",
                },
              },
            },
          },
        },
        ".checkout-button": {
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "lg",
          bg: "emerald600",
          px: 5,
          py: 3,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "white",
          cursor: "pointer",
          border: "none",
          transition: "all 0.2s ease",
          "&:hover": {
            bg: "emerald700",
          },
          "&:focus": {
            outline: "none",
            boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.3)",
          },
        },
        ".continue-shopping": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          ".continue-text": {
            fontSize: "0.875rem",
            fontWeight: 400,
            color: "gray400",
          },
          ".continue-link": {
            display: "inline-flex",
            alignItems: "center",
            gap: 2,
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "emerald400",
            textDecoration: "underline",
            "&:hover": {
              color: "rgba(16, 185, 129, 0.8)",
              textDecoration: "none",
            },
          },
        },
      }}
    >
      <p className="order-title">Деталі замовлення</p>

      <div className="order-details">
        <div className="order-items">
          <dl className="order-row">
            <dt className="order-label">Початкова ціна</dt>
            <dd className="order-value">${formattedSubtotal}</dd>
          </dl>

          {savings > 0 && (
            <dl className="order-row savings">
              <dt className="order-label">Економія</dt>
              <dd className="order-value">-${formattedSavings}</dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="order-row">
              <dt className="order-label">Купон ({coupon.code})</dt>
              <dd className="order-value">-{coupon.discountPercentage}%</dd>
            </dl>
          )}

          <dl className="order-row total">
            <dt className="order-label">До сплати</dt>
            <dd className="order-value">${formattedTotal}</dd>
          </dl>
        </div>
      </div>

      <motion.button
        className="checkout-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePayment}
      >
        Оплатити зараз
      </motion.button>

      <div className="continue-shopping">
        <span className="continue-text">або</span>
        <Link to="/" className="continue-link">
          Продовжити покупки
          <MoveRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
