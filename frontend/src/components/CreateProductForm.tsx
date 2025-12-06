/** @jsxImportSource theme-ui */
import { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader, X } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { CategoryOption, Specification, Product } from "../types";

const categories: CategoryOption[] = [
  { value: "smartphones", label: "Смартфони" },
  { value: "computers", label: "Комп'ютери" },
  { value: "tablets", label: "Планшети" },
  { value: "smart-watches", label: "Розумні годинники" },
  { value: "headphone", label: "Навушники" },
  { value: "laptops", label: "Ноутбуки" },
  { value: "gaming", label: "Геймінг" },
  { value: "televisions", label: "Телевізори" },
];

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  images: string[];
  specifications: Specification[];
}

interface CreateProductFormProps {
  editingProduct?: Product | null;
  onCancelEdit?: () => void;
}

const CreateProductForm = ({
  editingProduct,
  onCancelEdit,
}: CreateProductFormProps): JSX.Element => {
  const [newProduct, setNewProduct] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
    specifications: [],
  });
  const [specInput, setSpecInput] = useState<Specification>({
    name: "",
    value: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { createProduct, updateProduct, loading, fetchAllProducts } =
    useProductStore();

  useEffect(() => {
    if (editingProduct) {
      console.log("Editing product:", editingProduct);
      console.log("Product images:", editingProduct.images);
      console.log("Product image:", editingProduct.image);

      const productImages =
        editingProduct.images && editingProduct.images.length > 0
          ? editingProduct.images
          : editingProduct.image
          ? [editingProduct.image]
          : [];

      console.log("Final images array:", productImages);

      setNewProduct({
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        price: editingProduct.price?.toString() || "",
        category: editingProduct.category || "",
        images: productImages,
        specifications: editingProduct.specifications || [],
      });
    } else {
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        images: [],
        specifications: [],
      });
      setSpecInput({ name: "", value: "" });
    }
  }, [editingProduct]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price) || 0,
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
        await fetchAllProducts();
        if (onCancelEdit) {
          onCancelEdit();
        }
      } else {
        await createProduct(productData);
      }
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        images: [],
        specifications: [],
      });
      setSpecInput({ name: "", value: "" });
    } catch {
      console.log("error creating/updating a product");
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    console.log("Files selected:", files.length);
    if (files.length > 0) {
      const readers = files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then((results) => {
        setNewProduct({
          ...newProduct,
          images: [...newProduct.images, ...results],
        });
      });
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  const removeImage = (index: number): void => {
    setNewProduct({
      ...newProduct,
      images: newProduct.images.filter((_, i) => i !== index),
    });
  };

  const addSpecification = (): void => {
    if (specInput.name && specInput.value) {
      setNewProduct({
        ...newProduct,
        specifications: [...newProduct.specifications, specInput],
      });
      setSpecInput({ name: "", value: "" });
    }
  };

  const removeSpecification = (index: number): void => {
    setNewProduct({
      ...newProduct,
      specifications: newProduct.specifications.filter((_, i) => i !== index),
    });
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
          fontWeight: 800,
          mb: 4,
          color: "#6f82a0",
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
              mt: 2,
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
                borderColor: "#6f82a0",
                boxShadow: "0 0 0 1px #6f82a0",
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
                borderColor: "#6f82a0",
                boxShadow: "0 0 0 1px #6f82a0",
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
                borderColor: "#6f82a0",
                boxShadow: "0 0 0 1px #6f82a0",
              },
            },
            ".file-upload-wrapper": {
              mt: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
              position: "relative",
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
                userSelect: "none",
                transition: "all 0.2s ease",
                fontFamily: "inherit",
                position: "relative",
                zIndex: 1,
                "&:hover": {
                  bg: "gray600",
                },
                "&:focus": {
                  outline: "none",
                  boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)",
                },
                "&:active": {
                  transform: "scale(0.98)",
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
            alignItems: "center",
            py: 2,
            px: 4,
            border: "1px solid",
            borderColor: "transparent",
            borderRadius: "md",
            boxShadow: "soft",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "white",
            bg: "#3f5f9a",
            cursor: "pointer",
            transition: "all 0.15s ease-in-out",
            "&:hover": {
              bg: "#324a7c",
            },
            "&:focus": {
              outline: "none",
              boxShadow: "0 0 0 2px #3f5f9a",
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
      <h2 className="form-title">
        {editingProduct ? "Редагувати товар" : "Створити новий товар"}
      </h2>
      {editingProduct && onCancelEdit && (
        <button
          type="button"
          onClick={onCancelEdit}
          sx={{
            mb: 3,
            px: 3,
            py: 2,
            bg: "gray700",
            color: "gray300",
            border: "1px solid",
            borderColor: "gray600",
            borderRadius: "md",
            cursor: "pointer",
            fontSize: "0.875rem",
            "&:hover": {
              bg: "gray600",
            },
          }}
        >
          Скасувати редагування
        </button>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Назва товару
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Опис
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows={3}
            className="form-textarea"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price" className="form-label">
            Ціна
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            step="0.01"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Категорія
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="form-select"
            required
          >
            <option value="">Виберіть категорію</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Зображення товару</label>
          <div className="file-upload-wrapper">
            <input
              ref={fileInputRef}
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label htmlFor="images" className="file-label">
              <Upload className="upload-icon" />
              {editingProduct
                ? "Додати нові зображення (можна вибрати кілька)"
                : "Завантажити зображення (можна вибрати кілька)"}
            </label>
            {newProduct.images.length > 0 && (
              <span className="upload-status">
                Всього зображень: {newProduct.images.length}
              </span>
            )}
          </div>
          {(() => {
            console.log(
              "Rendering images section. Images count:",
              newProduct.images.length
            );
            console.log("Images array:", newProduct.images);
            return null;
          })()}
          {newProduct.images.length > 0 && (
            <div
              sx={{
                mt: 3,
                display: "grid",
                gridTemplateColumns: [
                  "1fr",
                  "repeat(2, 1fr)",
                  "repeat(3, 1fr)",
                ],
                gap: 2,
                ".image-preview": {
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1 / 1",
                  borderRadius: "md",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "gray600",
                  ".preview-image": {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  },
                  ".remove-button": {
                    position: "absolute",
                    top: 1,
                    right: 1,
                    p: 1,
                    borderRadius: "full",
                    bg: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bg: "rgba(220, 38, 38, 0.9)",
                    },
                  },
                  ".image-badge": {
                    position: "absolute",
                    top: 1,
                    left: 1,
                    px: 2,
                    py: 1,
                    borderRadius: "md",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    bg: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                  },
                },
              }}
            >
              {newProduct.images.map((img, index) => {
                const isExisting = img.startsWith("http");
                return (
                  <div
                    key={`${isExisting ? "existing" : "new"}-${index}`}
                    className="image-preview"
                  >
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                    {isExisting && <span className="image-badge">Існуюче</span>}
                    {!isExisting && (
                      <span
                        className="image-badge"
                        sx={{ bg: "rgba(16, 185, 129, 0.9)" }}
                      >
                        Нове
                      </span>
                    )}
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => removeImage(index)}
                      aria-label="Видалити зображення"
                      title="Видалити зображення"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Характеристики товару</label>
          <div
            sx={{
              display: "flex",
              gap: 2,
              my: 2,
              ".spec-input": {
                flex: 1,
                bg: "gray700",
                border: "1px solid",
                borderColor: "gray600",
                borderRadius: "md",
                py: 2,
                px: 3,
                color: "white",
                fontSize: "0.875rem",
                "&:focus": {
                  outline: "none",
                  borderColor: "#6f82a0",
                  boxShadow: "0 0 0 1px #6f82a0",
                },
              },
              ".add-spec-button": {
                px: 4,
                py: 2,
                bg: "#3f5f9a",
                color: "white",
                border: "none",
                borderRadius: "md",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
                "&:hover": {
                  bg: "#324a7c",
                },
              },
            }}
          >
            <input
              type="text"
              className="spec-input"
              placeholder="Назва характеристики"
              value={specInput.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSpecInput({ ...specInput, name: e.target.value })
              }
            />
            <input
              type="text"
              className="spec-input"
              placeholder="Значення"
              value={specInput.value}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSpecInput({ ...specInput, value: e.target.value })
              }
            />
            <button
              type="button"
              className="add-spec-button"
              onClick={addSpecification}
            >
              Додати
            </button>
          </div>
          {newProduct.specifications.length > 0 && (
            <div
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                ".spec-item": {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  bg: "gray700",
                  borderRadius: "md",
                  ".spec-text": {
                    color: "gray300",
                    fontSize: "0.875rem",
                    ".spec-name": {
                      fontWeight: 600,
                      color: "white",
                    },
                  },
                  ".remove-spec": {
                    p: 1,
                    bg: "transparent",
                    color: "red",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "md",
                    "&:hover": {
                      bg: "rgba(220, 38, 38, 0.1)",
                    },
                  },
                },
              }}
            >
              {newProduct.specifications.map((spec, index) => (
                <div key={index} className="spec-item">
                  <div className="spec-text">
                    <span className="spec-name">{spec.name}:</span> {spec.value}
                  </div>
                  <button
                    type="button"
                    className="remove-spec"
                    onClick={() => removeSpecification(index)}
                    aria-label="Видалити характеристику"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? (
            <>
              <Loader className="button-icon" aria-hidden="true" />
              Завантаження...
            </>
          ) : (
            <>
              <PlusCircle className="button-icon" />
              {editingProduct ? "Оновити товар" : "Створити товар"}
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
