/** @jsxImportSource theme-ui */
import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PurchaseCancelPage = () => {
  return (
    <div
      className="purchase-cancel-page"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 4,
        ".cancel-card": {
          maxWidth: "28rem",
          width: "100%",
          bg: "gray800",
          borderRadius: "lg",
          boxShadow: "strong",
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
          ".cancel-content": {
            p: [6, 8],
            ".cancel-icon": {
              display: "flex",
              justifyContent: "center",
              "& svg": {
                color: "#EF4444",
                width: "64px",
                height: "64px",
                mb: 4,
              },
            },
            ".cancel-title": {
              fontSize: ["1.5rem", "1.875rem"],
              fontWeight: 700,
              textAlign: "center",
              color: "#EF4444",
              mb: 2,
            },
            ".cancel-text": {
              color: "gray300",
              textAlign: "center",
              mb: 6,
            },
            ".cancel-info": {
              bg: "gray700",
              borderRadius: "lg",
              p: 4,
              mb: 6,
              ".info-text": {
                fontSize: "0.875rem",
                color: "gray400",
                textAlign: "center",
              },
            },
            ".cancel-actions": {
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ".return-link": {
                width: "100%",
                bg: "gray700",
                "&:hover": {
                  bg: "gray600",
                },
                color: "gray300",
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
                  mr: 2,
                },
              },
            },
          },
        },
      }}
    >
      <motion.div
        className="cancel-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="cancel-content">
          <div className="cancel-icon">
            <XCircle />
          </div>
          <h1 className="cancel-title">Purchase Cancelled</h1>
          <p className="cancel-text">
            Your order has been cancelled. No charges have been made.
          </p>
          <div className="cancel-info">
            <p className="info-text">
              If you encountered any issues during the checkout process, please
              don't hesitate to contact our support team.
            </p>
          </div>
          <div className="cancel-actions">
            <Link to="/" className="return-link">
              <ArrowLeft className="link-icon" size={18} />
              Return to Shop
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseCancelPage;
