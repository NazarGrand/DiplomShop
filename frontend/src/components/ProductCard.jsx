/** @jsxImportSource theme-ui */
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { Box } from "theme-ui";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Будь ласка, увійдіть, щоб додати товари до кошика", {
        id: "login",
      });
      return;
    } else {
      addToCart(product);
    }
  };

  return (
    <Box
      className="product-card"
      sx={{
        display: "flex",
        width: "100%",
        position: "relative",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "lg",
        border: "1px solid",
        borderColor: "gray700",
        boxShadow: "medium",
        ".product-image-wrapper": {
          position: "relative",
          mx: 3,
          mt: 3,
          display: "flex",
          height: "240px",
          overflow: "hidden",
          borderRadius: "xl",
          ".product-image": {
            objectFit: "cover",
            width: "100%",
          },
          ".product-overlay": {
            position: "absolute",
            inset: 0,
            bg: "rgba(0, 0, 0, 0.2)",
          },
        },
        ".product-content": {
          px: 3,
          pb: 3,
          ".product-name": {
            fontSize: "1.25rem",
            fontWeight: 600,
            letterSpacing: "-0.025em",
            color: "white",
          },
          ".product-price-wrapper": {
            mt: 1,
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            ".product-price": {
              fontSize: "1.875rem",
              fontWeight: 700,
              color: "emerald400",
            },
          },
          ".add-to-cart-btn": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderRadius: "lg",
            bg: "emerald600",
            px: 4,
            py: 3,
            textAlign: "center",
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
            ".btn-icon": {
              mr: 2,
            },
          },
        },
      }}
    >
      <div className="product-image-wrapper">
        <img
          className="product-image"
          src={product.image}
          alt="product image"
        />
        <div className="product-overlay" />
      </div>

      <div className="product-content">
        <h5 className="product-name">{product.name}</h5>
        <div className="product-price-wrapper">
          <p>
            <span className="product-price">${product.price}</span>
          </p>
        </div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <ShoppingCart size={22} className="btn-icon" />В корзину
        </button>
      </div>
    </Box>
  );
};

export default ProductCard;
