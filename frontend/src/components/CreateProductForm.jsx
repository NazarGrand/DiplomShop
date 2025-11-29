/** @jsxImportSource theme-ui */
import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const { createProduct, loading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });
    } catch {
      console.log("error creating a product");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      className="create-product-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      sx={{
        bg: "gray800",
        boxShadow: "medium",
        borderRadius: "lg",
        p: 3,
        mb: 8,
        maxWidth: "36rem",
        mx: "auto",
        ".form-title": {
          fontSize: "1.5rem",
          fontWeight: 600,
          mb: 4,
          color: "rgba(16, 185, 129, 0.8)",
        },
        ".product-form": {
          display: "flex",
          flexDirection: "column",
          gap: 4,
          ".form-group": {
            ".form-label": {
              display: "block",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "gray300",
            },
            ".form-input": {
              mt: 1,
              display: "block",
              width: "100%",
              bg: "gray700",
              border: "1px solid",
              borderColor: "gray600",
              borderRadius: "md",
              boxShadow: "soft",
              py: 2,
              px: 3,
              color: "white",
              fontSize: "0.875rem",
              "&::placeholder": {
                color: "gray400",
              },
              "&:focus": {
                outline: "none",
                borderColor: "emerald500",
                boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)",
              },
            },
            ".form-textarea": {
              mt: 1,
              display: "block",
              width: "100%",
              bg: "gray700",
              border: "1px solid",
              borderColor: "gray600",
              borderRadius: "md",
              boxShadow: "soft",
              py: 2,
              px: 3,
              color: "white",
              fontSize: "0.875rem",
              resize: "vertical",
              "&:focus": {
                outline: "none",
                borderColor: "emerald500",
                boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)",
              },
            },
            ".form-select": {
              mt: 1,
              display: "block",
              width: "100%",
              bg: "gray700",
              border: "1px solid",
              borderColor: "gray600",
              borderRadius: "md",
              boxShadow: "soft",
              py: 2,
              px: 3,
              color: "white",
              fontSize: "0.875rem",
              cursor: "pointer",
              "&:focus": {
                outline: "none",
                borderColor: "emerald500",
                boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)",
              },
            },
            ".file-upload-wrapper": {
              mt: 1,
              display: "flex",
              alignItems: "center",
              ".file-input": {
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                borderWidth: 0,
              },
              ".file-label": {
                cursor: "pointer",
                bg: "gray700",
                py: 2,
                px: 3,
                border: "1px solid",
                borderColor: "gray600",
                borderRadius: "md",
                boxShadow: "soft",
                fontSize: "0.875rem",
                lineHeight: "1.25rem",
                fontWeight: 500,
                color: "gray300",
                display: "inline-flex",
                alignItems: "center",
                "&:hover": {
                  bg: "gray600",
                },
                "&:focus": {
                  outline: "none",
                  boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)",
                },
                ".upload-icon": {
                  height: "20px",
                  width: "20px",
                  display: "inline-block",
                  mr: 2,
                },
              },
              ".upload-status": {
                ml: 3,
                fontSize: "0.875rem",
                color: "gray400",
              },
            },
          },
          ".submit-button": {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            py: 2,
            px: 4,
            border: "1px solid",
            borderColor: "transparent",
            borderRadius: "md",
            boxShadow: "soft",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "white",
            bg: "emerald600",
            cursor: "pointer",
            transition: "all 0.15s ease-in-out",
            "&:hover": {
              bg: "emerald700",
            },
            "&:focus": {
              outline: "none",
              boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)",
            },
            "&:disabled": {
              opacity: 0.5,
            },
            ".button-icon": {
              mr: 2,
              height: "20px",
              width: "20px",
            },
          },
        },
      }}
    >
      <h2 className="form-title">Create New Product</h2>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows="3"
            className="form-textarea"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            step="0.01"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="form-select"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="image"
              className="file-input"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="image" className="file-label">
              <Upload className="upload-icon" />
              Upload Image
            </label>
            {newProduct.image && (
              <span className="upload-status">Image uploaded</span>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? (
            <>
              <Loader className="button-icon" aria-hidden="true" />
              Loading...
            </>
          ) : (
            <>
              <PlusCircle className="button-icon" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
