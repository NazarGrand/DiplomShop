/** @jsxImportSource theme-ui */
import classNames from "classnames";
import { motion } from "framer-motion";
import { Trash, Award } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = (): JSX.Element => {
  const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

  console.log("products", products);

  return (
    <motion.div
      className="products-list"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      sx={{
        bg: "gray800",
        boxShadow: "medium",
        borderRadius: "lg",
        overflow: "hidden",
        maxWidth: "896px",
        mx: "auto",
        ".products-table": {
          minWidth: "100%",
          ".table-header": {
            bg: "gray700",
            ".header-row": {
              ".header-cell": {
                px: 2,
                py: 3,
                textAlign: "left",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "gray300",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              },
            },
          },
          ".table-body": {
            bg: "gray800",
            ".table-row": {
              borderBottom: "1px solid",
              borderColor: "gray700",
              "&:hover": {
                bg: "gray700",
              },
              ".table-cell": {
                px: 2,
                py: 4,
                whiteSpace: "nowrap",
                ".product-info": {
                  display: "flex",
                  alignItems: "center",
                  ".product-image": {
                    flexShrink: 0,
                    height: "40px",
                    width: "40px",
                    "& img": {
                      height: "40px",
                      width: "40px",
                      borderRadius: "full",
                      objectFit: "cover",
                    },
                  },
                  ".product-name": {
                    ml: 4,
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "white",
                  },
                },
                ".product-price": {
                  fontSize: "0.875rem",
                  color: "gray300",
                },
                ".product-category": {
                  fontSize: "0.875rem",
                  color: "gray300",
                },
                ".featured-button": {
                  p: 1,
                  borderRadius: "full",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.2s ease",
                  "&.featured": {
                    bg: "#FACC15",
                    color: "gray900",
                  },
                  "&:not(.featured)": {
                    bg: "gray600",
                    color: "gray300",
                  },
                  "&:hover": {
                    bg: "#FCD34D",
                  },
                  ".star-icon": {
                    height: "20px",
                    width: "20px",
                  },
                },
                ".delete-button": {
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#F87171",
                  cursor: "pointer",
                  border: "none",
                  bg: "transparent",
                  "&:hover": {
                    color: "#FCA5A5",
                  },
                  ".trash-icon": {
                    height: "20px",
                    width: "20px",
                  },
                },
              },
            },
          },
        },
      }}
    >
      <table className="products-table">
        <thead className="table-header">
          <tr className="header-row">
            <th scope="col" className="header-cell">
              Товар
            </th>
            <th scope="col" className="header-cell">
              Ціна
            </th>
            <th scope="col" className="header-cell">
              Категорія
            </th>
            <th scope="col" className="header-cell">
              Рекомендований
            </th>
            <th scope="col" className="header-cell">
              Дії
            </th>
          </tr>
        </thead>

        <tbody className="table-body">
          {products?.map((product) => {
            const productImage =
              product.images && product.images.length > 0
                ? product.images[0]
                : product.image || "";

            return (
              <tr key={product._id} className="table-row">
                <td className="table-cell">
                  <div className="product-info">
                    <div className="product-image">
                      <img src={productImage} alt={product.name} />
                    </div>
                    <div className="product-name">{product.name}</div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="product-price">{Math.round(product.price)} ₴</div>
                </td>
                <td className="table-cell">
                  <div className="product-category">{product.category}</div>
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => toggleFeaturedProduct(product._id)}
                    className={classNames(
                      "featured-button",
                      product.isFeatured && "featured"
                    )}
                  >
                    <Award className="star-icon" />
                  </button>
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="delete-button"
                  >
                    <Trash className="trash-icon" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProductsList;

