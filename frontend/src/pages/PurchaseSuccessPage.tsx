/** @jsxImportSource theme-ui */
import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box } from "theme-ui";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = (): JSX.Element => {
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const { clearCart } = useCartStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId: string): Promise<void> => {
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

  if (isProcessing) return <div>Обробка...</div>;

  if (error) return <div>Помилка: {error}</div>;

  return (
    <Box
      className="purchase-success-page"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
        ".success-card": {
          marginTop: 6,
          maxWidth: "28rem",
          width: "100%",
          bg: "gray800",
          borderRadius: "lg",
          boxShadow: "strong",
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
          ".success-content": {
            ".success-icon": {
              paddingTop: 2,
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
              fontWeight: 900,
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
              mb: 4,
            },
            ".order-info": {
              bg: "gray700",
              borderRadius: "lg",
              p: 4,
              mb: 4,
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
              gap: 2,
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
          <h1 className="success-title">Покупка успішна!</h1>

          <p className="success-text">
            Дякуємо за ваше замовлення. Ми обробляємо його зараз.
          </p>
          <p className="success-subtext">
            Перевірте свою електронну пошту для деталей замовлення та оновлень.
          </p>
          <div className="order-info">
            <div className="order-row">
              <span className="order-label">Номер замовлення</span>
              <span className="order-value">#12345</span>
            </div>
            <div className="order-row">
              <span className="order-label">Орієнтовна доставка</span>
              <span className="order-value">3-5 робочих днів</span>
            </div>
          </div>

          <div className="success-actions">
            <button className="action-button">
              <HandHeart className="button-icon" size={18} />
              Дякуємо за довіру!
            </button>
            <Link to="/" className="continue-link">
              Продовжити покупки
              <ArrowRight className="link-icon" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default PurchaseSuccessPage;

