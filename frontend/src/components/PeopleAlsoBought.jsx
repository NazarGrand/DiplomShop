/** @jsxImportSource theme-ui */
import { useEffect, useState } from "react";
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
            "An error occurred while fetching recommendations"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div
      className="people-also-bought"
      sx={{
        mt: 3,
        ".recommendations-title": {
          fontSize: "1.5rem",
          fontWeight: 600,
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
      <h3 className="recommendations-title">People also bought</h3>
      <div className="recommendations-grid">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
