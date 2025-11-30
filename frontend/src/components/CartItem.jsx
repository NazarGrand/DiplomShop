/** @jsxImportSource theme-ui */
import { Box } from "theme-ui";
import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();

  return (
    <Box
      className="cart-item"
      sx={{
        borderRadius: "lg",
        border: "1px solid",
        borderColor: "gray700",
        p: [1, 3],
        boxShadow: "soft",
        bg: "gray800",
        ".cart-item-content": {
          display: "flex",
          flexDirection: ["column", "row"],
          gap: 4,
          alignItems: "center",
          justifyContent: "space-between",
          ".cart-item-image": {
            flexShrink: 0,
            order: [1, 1],
            "& img": {
              height: ["80px", "128px"],
              borderRadius: "md",
              objectFit: "cover",
            },
          },
          ".cart-item-info": {
            width: "100%",
            minWidth: 0,
            flex: 1,
            order: [2, 2],
            maxWidth: ["100%", "28rem"],
            display: "flex",
            flexDirection: "column",
            gap: 3,
            ".cart-item-name": {
              fontSize: "1rem",
              fontWeight: 500,
              color: "white",
              "&:hover": {
                color: "emerald400",
                textDecoration: "underline",
              },
            },
            ".cart-item-description": {
              fontSize: "0.875rem",
              color: "gray400",
            },
          },
          ".cart-item-controls": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            order: [3, 3],
            width: ["100%", "auto"],
            ".quantity-controls": {
              display: "flex",
              alignItems: "center",
              gap: 2,
              ".quantity-button": {
                display: "inline-flex",
                height: "20px",
                width: "20px",
                flexShrink: 0,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "md",
                border: "1px solid",
                borderColor: "gray600",
                bg: "gray700",
                cursor: "pointer",
                "&:hover": {
                  bg: "gray600",
                },
                "&:focus": {
                  outline: "none",
                  boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)",
                },
                ".button-icon": {
                  color: "gray300",
                },
              },
              ".quantity-value": {
                fontSize: "1rem",
                color: "white",
              },
            },
            ".cart-item-price": {
              textAlign: "end",
              width: ["auto", "128px"],
              order: [4, 4],
              ".price-value": {
                fontSize: "1rem",
                fontWeight: 700,
                color: "emerald400",
              },
            },

            ".cart-item-remove": {
              display: "inline-flex",
              alignItems: "center",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#F87171",
              cursor: "pointer",
              order: [5, 5],
              "&:hover": {
                color: "#FCA5A5",
                textDecoration: "underline",
              },
              background: "transparent",
              border: "none",
            },
          },
        },
      }}
    >
      <div className="cart-item-content">
        <div className="cart-item-image">
          <img src={item.image} alt={item.name} />
        </div>
        <div className="cart-item-info">
          <p className="cart-item-name">{item.name}</p>
          <p className="cart-item-description">{item.description}</p>
        </div>
        <div className="cart-item-controls">
          <div className="quantity-controls">
            <button
              className="quantity-button"
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
            >
              <Minus className="button-icon" />
            </button>
            <p className="quantity-value">{item.quantity}</p>
            <button
              className="quantity-button"
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
            >
              <Plus className="button-icon" />
            </button>
          </div>
          <div className="cart-item-price">
            <p className="price-value">${item.price}</p>
          </div>
          <button
            className="cart-item-remove"
            onClick={() => removeFromCart(item._id)}
          >
            <Trash />
          </button>
        </div>
      </div>
    </Box>
  );
};

export default CartItem;
