/** @jsxImportSource theme-ui */
import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart } = useCartStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        await axios.post("/payments/checkout-success", {
          sessionId,
        });
        clearCart();
      } catch (error) {
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    };

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      setIsProcessing(false);
      setError("No session ID found in the URL");
    }
  }, [clearCart]);

  if (isProcessing) return "Processing...";

  if (error) return `Error: ${error}`;

  return (
    <div
      className="purchase-success-page"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
        ".success-card": {
          maxWidth: "28rem",
          width: "100%",
          bg: "gray800",
          borderRadius: "lg",
          boxShadow: "strong",
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
          ".success-content": {
            p: [6, 8],
            ".success-icon": {
              display: "flex",
              justifyContent: "center",
              "& svg": {
                color: "emerald400",
                width: "64px",
                height: "64px",
                mb: 4,
              },
            },
            ".success-title": {
              fontSize: ["1.5rem", "1.875rem"],
              fontWeight: 700,
              textAlign: "center",
              color: "emerald400",
              mb: 2,
            },
            ".success-text": {
              color: "gray300",
              textAlign: "center",
              mb: 2,
            },
            ".success-subtext": {
              color: "emerald400",
              textAlign: "center",
              fontSize: "0.875rem",
              mb: 6,
            },
            ".order-info": {
              bg: "gray700",
              borderRadius: "lg",
              p: 4,
              mb: 6,
              ".order-row": {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                "&:last-child": {
                  mb: 0,
                },
                ".order-label": {
                  fontSize: "0.875rem",
                  color: "gray400",
                },
                ".order-value": {
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "emerald400",
                },
              },
            },
            ".success-actions": {
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ".action-button": {
                width: "100%",
                bg: "emerald600",
                "&:hover": {
                  bg: "emerald700",
                },
                color: "white",
                fontWeight: 700,
                py: 2,
                px: 4,
                borderRadius: "lg",
                transition: "background-color 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "none",
                textDecoration: "none",
                ".button-icon": {
                  mr: 2,
                },
              },
              ".continue-link": {
                width: "100%",
                bg: "gray700",
                "&:hover": {
                  bg: "gray600",
                },
                color: "emerald400",
                fontWeight: 700,
                py: 2,
                px: 4,
                borderRadius: "lg",
                transition: "background-color 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                ".link-icon": {
                  ml: 2,
                },
              },
            },
          },
        },
      }}
    >
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="success-card">
        <div className="success-content">
          <div className="success-icon">
            <CheckCircle />
          </div>
          <h1 className="success-title">Purchase Successful!</h1>

          <p className="success-text">
            Thank you for your order. We're processing it now.
          </p>
          <p className="success-subtext">
            Check your email for order details and updates.
          </p>
          <div className="order-info">
            <div className="order-row">
              <span className="order-label">Order number</span>
              <span className="order-value">#12345</span>
            </div>
            <div className="order-row">
              <span className="order-label">Estimated delivery</span>
              <span className="order-value">3-5 business days</span>
            </div>
          </div>

          <div className="success-actions">
            <button className="action-button">
              <HandHeart className="button-icon" size={18} />
              Thanks for trusting us!
            </button>
            <Link to="/" className="continue-link">
              Continue Shopping
              <ArrowRight className="link-icon" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSuccessPage;
