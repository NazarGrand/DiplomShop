/** @jsxImportSource theme-ui */
import { motion } from "framer-motion";
import { useEffect, useState, ChangeEvent } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = (): JSX.Element => {
  const [userInputCode, setUserInputCode] = useState<string>("");
  const { coupon, isCouponApplied, applyCoupon, getMyCoupon, removeCoupon } =
    useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = (): void => {
    if (!userInputCode) return;
    applyCoupon(userInputCode);
  };

  const handleRemoveCoupon = async (): Promise<void> => {
    await removeCoupon();
    setUserInputCode("");
  };

  return (
    <motion.div
      className="gift-coupon-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "lg",
        border: "1px solid",
        borderColor: "gray700",
        bg: "gray800",
        p: 3,
        boxShadow: "soft",
        ".coupon-form": {
          display: "flex",
          flexDirection: "column",
          gap: 4,
          ".coupon-label": {
            mb: 2,
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "gray300",
          },
          ".coupon-input": {
            display: "block",
            width: "100%",
            borderRadius: "md",
            border: "1px solid",
            borderColor: "gray600",
            bg: "gray700",
            p: 2.5,
            fontSize: "0.875rem",
            color: "white",
            "&::placeholder": {
              color: "gray400",
            },
            "&:focus": {
              outline: "none",
              borderColor: "emerald500",
              boxShadow: "0 0 0 1px rgba(16, 185, 129, 1)",
            },
          },
          ".apply-button": {
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
        },
        ".applied-coupon": {
          mt: 4,
          ".applied-title": {
            fontSize: "1.125rem",
            fontWeight: 500,
            color: "gray300",
          },
          ".applied-text": {
            mt: 2,
            fontSize: "0.875rem",
            color: "gray400",
          },
          ".remove-button": {
            mt: 2,
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "lg",
            bg: "#DC2626",
            px: 5,
            py: 2.5,
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "white",
            cursor: "pointer",
            border: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              bg: "#B91C1C",
            },
            "&:focus": {
              outline: "none",
              boxShadow: "0 0 0 4px rgba(220, 38, 38, 0.3)",
            },
          },
        },
        ".available-coupon": {
          ".available-title": {
            fontSize: "1.125rem",
            fontWeight: 500,
            color: "gray300",
          },
          ".available-text": {
            mt: 2,
            fontSize: "0.875rem",
            color: "gray400",
          },
        },
      }}
    >
      <div className="coupon-form">
        <div>
          <label htmlFor="voucher" className="coupon-label">
            Введіть промокод
          </label>
          <input
            type="text"
            id="voucher"
            className="coupon-input"
            placeholder="Введіть промокод тут"
            value={userInputCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUserInputCode(e.target.value)
            }
            required
          />
        </div>

        <motion.button
          type="button"
          className="apply-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleApplyCoupon}
        >
          Застосувати промокод
        </motion.button>
      </div>
      {isCouponApplied && coupon && (
        <div className="applied-coupon">
          <h3 className="applied-title">Застосований купон</h3>
          <p className="applied-text">
            {coupon.code} - знижка {coupon.discountPercentage}%
          </p>
          <motion.button
            type="button"
            className="remove-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Видалити купон
          </motion.button>
        </div>
      )}

      {coupon && (
        <div className="available-coupon">
          <h3 className="available-title">Ваш доступний купон:</h3>
          <p className="available-text">
            {coupon.code} - знижка {coupon.discountPercentage}%
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default GiftCouponCard;

