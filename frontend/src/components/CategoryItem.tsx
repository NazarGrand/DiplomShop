/** @jsxImportSource theme-ui */
import { useState } from "react";
import { Box } from "theme-ui";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "../types";

interface CategoryItemProps {
  category: Category;
}

const CategoryItem = ({ category }: CategoryItemProps): JSX.Element => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const hoverImage = category.hoverImageUrl || category.imageUrl;

  return (
    <Box
      className="category-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: "relative",
        overflow: "hidden",
        height: "384px",
        width: "100%",
        borderRadius: "lg",
        ".category-link": {
          display: "block",
          width: "100%",
          height: "100%",
          cursor: "pointer",
          position: "relative",
          ".image-wrapper": {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            ".category-image": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
            },
          },
          ".category-overlay": {
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 100%)",
            zIndex: 10,
          },
          ".category-content": {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            zIndex: 20,
            ".category-title": {
              color: "white",
              fontSize: "2rem",
              fontWeight: 900,
              textAlign: "center",
            },
          },
        },
      }}
    >
      <Link to={"/category" + category.href} className="category-link">
        <div className="image-wrapper">
          <AnimatePresence mode="wait">
            {!isHovered ? (
              <motion.img
                key="default"
                src={category.imageUrl}
                alt={category.name}
                className="category-image"
                initial={{ opacity: 1, scale: 1, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ 
                  opacity: 0, 
                  scale: 1.15, 
                  rotate: -3,
                  filter: "blur(4px)"
                }}
                transition={{ 
                  duration: 0.2, 
                  ease: [0.4, 0, 0.2, 1]
                }}
                loading="lazy"
              />
            ) : (
              <motion.img
                key="hover"
                src={hoverImage}
                alt={`${category.name} hover`}
                className="category-image"
                initial={{ 
                  opacity: 0, 
                  scale: 0.85, 
                  rotate: 3,
                  filter: "blur(4px)"
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0,
                  filter: "blur(0px)"
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.9,
                  rotate: -2
                }}
                transition={{ 
                  duration: 0.2, 
                  ease: [0.4, 0, 0.2, 1]
                }}
                loading="lazy"
              />
            )}
          </AnimatePresence>
        </div>
        <div className="category-overlay" />
        <div className="category-content">
          <h3 className="category-title">{category.name}</h3>
        </div>
      </Link>
    </Box>
  );
};

export default CategoryItem;
