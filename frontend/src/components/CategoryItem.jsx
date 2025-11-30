/** @jsxImportSource theme-ui */
import { Box } from "theme-ui";
import { Link } from "react-router-dom";

const CategoryItem = ({ category }) => {
  return (
    <Box
      className="category-item"
      sx={{
        position: "relative",
        overflow: "hidden",
        height: "384px",
        width: "100%",
        borderRadius: "lg",
        "&:hover": {
          ".category-image": {
            transform: "scale(1.1)",
          },
        },
        ".category-link": {
          display: "block",
          width: "100%",
          height: "100%",
          cursor: "pointer",
          position: "relative",
          ".category-overlay": {
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.5) 100%)",
            zIndex: 10,
          },
          ".category-image": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease-out",
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
        <div className="category-overlay" />
        <img
          src={category.imageUrl}
          alt={category.name}
          className="category-image"
          loading="lazy"
        />
        <div className="category-content">
          <h3 className="category-title">{category.name}</h3>
        </div>
      </Link>
    </Box>
  );
};

export default CategoryItem;
