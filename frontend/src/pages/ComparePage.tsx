/** @jsxImportSource theme-ui */
import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box } from "theme-ui";
import { X, ToggleLeft, ToggleRight } from "lucide-react";
import { useCompareStore } from "../stores/useCompareStore";
import { getCategoryName } from "../utils/categoryNames";
import toast from "react-hot-toast";

const ComparePage = (): JSX.Element => {
	const { compareProducts, removeFromCompare, clearCompare, loadFromStorage } = useCompareStore();
	const [highlightDifferences, setHighlightDifferences] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		loadFromStorage();
	}, [loadFromStorage]);

	// Get all unique specifications from both products
	const allSpecifications = useMemo(() => {
		const specMap = new Map<string, { name: string; values: string[] }>();

		compareProducts.forEach((product, productIndex) => {
			if (product.specifications && Array.isArray(product.specifications)) {
				// First, deduplicate specifications within each product by name
				// Use Map to keep only the first occurrence of each spec name
				const uniqueSpecs = new Map<string, string>();
				product.specifications.forEach((spec) => {
					// Normalize spec name (trim whitespace)
					const normalizedName = spec.name.trim();
					// If we already have this spec name, skip it (keep first occurrence)
					if (!uniqueSpecs.has(normalizedName)) {
						uniqueSpecs.set(normalizedName, spec.value || "");
					}
				});

				// Then add to the main map
				uniqueSpecs.forEach((value, name) => {
					if (!specMap.has(name)) {
						specMap.set(name, {
							name: name,
							values: new Array(compareProducts.length).fill(""),
						});
					}
					const specData = specMap.get(name)!;
					// Only set if empty (avoid overwriting)
					if (!specData.values[productIndex] || specData.values[productIndex] === "") {
						specData.values[productIndex] = value;
					}
				});
			}
		});

		return Array.from(specMap.values());
	}, [compareProducts]);

	// Check if values are different for highlighting
	const areValuesDifferent = (values: string[]): boolean => {
		if (values.length < 2) return false;
		return values[0] !== values[1];
	};

	if (compareProducts.length === 0) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexDirection: "column",
					gap: 4,
					px: 4,
					".empty-title": {
						fontSize: "2rem",
						fontWeight: 700,
						color: "white",
						textAlign: "center",
					},
					".empty-message": {
						fontSize: "1.125rem",
						color: "gray400",
						textAlign: "center",
					},
					".back-button": {
						display: "flex",
						alignItems: "center",
						gap: 2,
						px: 4,
						py: 2,
						bg: "emerald600",
						color: "white",
						textDecoration: "none",
						borderRadius: "md",
						"&:hover": {
							bg: "emerald700",
						},
					},
				}}
			>
				<h2 className="empty-title">Немає товарів для порівняння</h2>
				<p className="empty-message">
					Додайте товари для порівняння з категорії товарів
				</p>
				<Link to="/" className="back-button">
					Повернутися на головну
				</Link>
			</Box>
		);
	}

	const categoryName = getCategoryName(compareProducts[0]?.category || "");

	return (
		<Box
			sx={{
				minHeight: "100vh",
				position: "relative",
				pb: 10, // Space for sticky button
				".compare-container": {
					maxWidth: "1400px",
					mx: "auto",
					px: ["1rem", "1.5rem", "2rem"],
					pt: 6,
					".compare-header": {
						mb: 5,
						".header-title": {
							fontSize: ["2rem", "2.5rem", "3rem"],
							fontWeight: 900,
							color: "emerald400",
							mb: 2,
						},
						".header-category": {
							fontSize: "1.125rem",
							color: "gray400",
						},
					},
					".products-header": {
						display: "grid",
						gridTemplateColumns: ["1fr", "1fr", `250px repeat(${compareProducts.length}, 1fr)`],
						gap: 4,
						mb: 4,
						".product-card": {
							bg: "gray800",
							borderRadius: "lg",
							border: "1px solid",
							borderColor: "gray700",
							p: 4,
							position: "relative",
							minHeight: "500px",
							display: "flex",
							flexDirection: "column",
							".product-image": {
								width: "100%",
								aspectRatio: "1 / 1",
								objectFit: "cover",
								borderRadius: "md",
								mb: 3,
								maxHeight: "400px",
								minHeight: "350px",
							},
							".product-name": {
								fontSize: "1rem",
								fontWeight: 700,
								color: "white",
								lineHeight: 1.3,
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
								mb: 1,
							},
							".product-price": {
								fontSize: "1.5rem",
								fontWeight: 700,
								color: "emerald400",
								mb: 2,
							},
							".remove-button": {
								position: "absolute",
								top: 2,
								right: 2,
								p: 1,
								bg: "rgba(0, 0, 0, 0.7)",
								color: "white",
								border: "none",
								borderRadius: "full",
								cursor: "pointer",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								transition: "all 0.2s ease",
								zIndex: 10,
								"&:hover": {
									bg: "rgba(220, 38, 38, 0.9)",
								},
							},
							".view-product-link": {
								display: "block",
								mt: 2,
								px: 3,
								py: 2,
								bg: "#3f5f9a",
								color: "white",
								textDecoration: "none",
								borderRadius: "md",
								textAlign: "center",
								fontSize: "0.875rem",
								fontWeight: 500,
								transition: "all 0.2s ease",
								"&:hover": {
									bg: "#324a7c",
								},
							},
						},
					},
					".sticky-names-header": {
						position: "sticky",
						top: 80,
						zIndex: 200,
						bg: "gray900",
						py: 2,
						mb: 2,
						display: "grid",
						gridTemplateColumns: ["1fr", "1fr", `250px repeat(${compareProducts.length}, 1fr)`],
						gap: 4,
						borderBottom: "2px solid",
						borderColor: "gray700",
						".sticky-name-cell": {
							px: 3,
							".sticky-product-name": {
								fontSize: "1rem",
								fontWeight: 700,
								color: "white",
								lineHeight: 1.3,
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								overflow: "hidden",
							},
						},
					},
					".specifications-table": {
						bg: "gray800",
						borderRadius: "lg",
						border: "1px solid",
						borderColor: "gray700",
						overflow: "hidden",
						".spec-row": {
							display: "grid",
							gridTemplateColumns: ["1fr", "1fr", `250px repeat(${compareProducts.length}, 1fr)`],
							borderBottom: "1px solid",
							borderColor: "gray700",
							"&:last-child": {
								borderBottom: "none",
							},
							"&.highlight-different": {
								bg: "rgba(63, 95, 154, 0.15)",
							},
							".spec-label": {
								px: 3,
								py: 3,
								fontSize: "0.875rem",
								fontWeight: 600,
								color: "gray400",
								bg: "gray700",
							},
							".spec-value": {
								px: 3,
								py: 3,
								fontSize: "0.875rem",
								color: "white",
								"&.different": {
									color: "#3f5f9a",
									fontWeight: 600,
								},
							},
						},
					},
				},
				".sticky-button": {
					position: "fixed",
					bottom: 0,
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 1000,
					width: "100%",
					maxWidth: "1400px",
					px: ["1rem", "1.5rem", "2rem"],
					py: 3,
					bg: "gray800",
					borderTop: "1px solid",
					borderColor: "gray700",
					display: "flex",
					justifyContent: "center",
					".toggle-button": {
						display: "flex",
						alignItems: "center",
						gap: 3,
						px: 4,
						py: 2,
						bg: highlightDifferences ? "#3f5f9a" : "gray700",
						color: "white",
						border: "none",
						borderRadius: "md",
						cursor: "pointer",
						fontSize: "1rem",
						fontWeight: 500,
						transition: "all 0.2s ease",
						"&:hover": {
							bg: highlightDifferences ? "#324a7c" : "gray600",
						},
						".toggle-icon": {
							transition: "transform 0.2s ease",
						},
					},
				},
			}}
		>
			<div className="compare-container">
				<motion.div
					className="compare-header"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className="header-title">Порівняння товарів</h1>
					<p className="header-category">Категорія: {categoryName}</p>
				</motion.div>

				<motion.div
					className="products-header"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<div></div>
					{compareProducts.map((product) => {
						const productImage =
							product.images && product.images.length > 0
								? product.images[0]
								: product.image || "";

						return (
							<div key={product._id} className="product-card">
								<button
									className="remove-button"
									onClick={() => {
										removeFromCompare(product._id);
										if (compareProducts.length === 1) {
											navigate("/");
										}
									}}
									aria-label="Видалити з порівняння"
								>
									<X size={18} />
								</button>
								<img
									src={productImage}
									alt={product.name}
									className="product-image"
								/>
								<h3 className="product-name">{product.name}</h3>
								<div className="product-price">
									{Math.round(product.price)} ₴
								</div>
								<Link
									to={`/product/${product._id}`}
									className="view-product-link"
								>
									Переглянути товар
								</Link>
							</div>
						);
					})}
				</motion.div>

				<div className="sticky-names-header">
					<div></div>
					{compareProducts.map((product) => (
						<div key={product._id} className="sticky-name-cell">
							<h3 className="sticky-product-name">{product.name}</h3>
						</div>
					))}
				</div>

				<motion.div
					className="specifications-table"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					{allSpecifications.map((spec, index) => {
						const isDifferent = areValuesDifferent(spec.values);
						const shouldHighlight = highlightDifferences && isDifferent;

						return (
							<div
								key={index}
								className={`spec-row ${shouldHighlight ? "highlight-different" : ""}`}
							>
								<div className="spec-label">{spec.name}</div>
								{spec.values.map((value, valueIndex) => (
									<div
										key={valueIndex}
										className={`spec-value ${isDifferent && highlightDifferences ? "different" : ""}`}
									>
										{value || "-"}
									</div>
								))}
							</div>
						);
					})}
				</motion.div>
			</div>

			<div className="sticky-button">
				<button
					className="toggle-button"
					onClick={() => setHighlightDifferences(!highlightDifferences)}
				>
					{highlightDifferences ? (
						<ToggleRight size={24} className="toggle-icon" />
					) : (
						<ToggleLeft size={24} className="toggle-icon" />
					)}
					<span>Підсвітити відмінності</span>
				</button>
			</div>
		</Box>
	);
};

export default ComparePage;

