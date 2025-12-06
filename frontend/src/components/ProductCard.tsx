/** @jsxImportSource theme-ui */
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { Box } from "theme-ui";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { Product } from "../types";
import { MouseEvent } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps): JSX.Element => {
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.image || "";

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    e.stopPropagation();
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
        ".product-link": {
          textDecoration: "none",
          color: "inherit",
        },
        ".product-image-wrapper": {
          position: "relative",
          mx: 3,
          mt: 3,
          display: "flex",
          height: "300px",
          overflow: "hidden",
          borderRadius: "xl",
          cursor: "pointer",
          ".product-image": {
            objectFit: "cover",
            width: "100%",
            transition: "transform 0.3s ease",
          },
          "&:hover .product-image": {
            transform: "scale(1.05)",
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
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "white",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            cursor: "pointer",
            "&:hover": {
              color: "emerald400",
            },
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
              color: "white",
            },
          },
          ".add-to-cart-btn": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            borderRadius: "lg",
            bg: "#3f5f9a",
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
              bg: "#324a7c",
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
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image-wrapper">
          <img
            className="product-image"
            src={productImage}
            alt={product.name || "product image"}
          />
          <div className="product-overlay" />
        </div>
      </Link>

      <div className="product-content">
        <Link to={`/product/${product._id}`} sx={{ textDecoration: "none" }}>
          <h5 className="product-name">{product.name}</h5>
        </Link>
        <div className="product-price-wrapper">
          <p>
            <span className="product-price">{Math.round(product.price)} ₴</span>
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

