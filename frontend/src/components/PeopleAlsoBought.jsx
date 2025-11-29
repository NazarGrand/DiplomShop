/** @jsxImportSource theme-ui */
import { useEffect, useState } from "react";
import { Box } from "theme-ui";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/recommendations");
        setRecommendations(res.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Сталася помилка при отриманні рекомендацій"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box
      className="people-also-bought"
      sx={{
        mt: 3,
        ".recommendations-title": {
          fontSize: "1.5rem",
          fontWeight: 800,
          color: "emerald400",
        },
        ".recommendations-grid": {
          mt: 4,
          display: "grid",
          gridTemplateColumns: ["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"],
          gap: 4,
        },
      }}
    >
      <h3 className="recommendations-title">Вам можуть сподобатися</h3>
      <div className="recommendations-grid">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </Box>
  );
};

export default PeopleAlsoBought;
