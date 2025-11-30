import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set, get) => ({
	products: [],
	featuredProducts: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				featuredProducts: prevProducts.featuredProducts.filter(
					(product) => product._id !== productId
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Не вдалося видалити товар");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
			const updatedProduct = response.data;
			
			// Оновлюємо products для адмін панелі
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: updatedProduct.isFeatured } : product
				),
			}));
			
			// Оновлюємо featured products - перезавантажуємо з сервера для актуальності
			await get().fetchFeaturedProducts();
			
			// Показуємо повідомлення про успіх
			if (updatedProduct.isFeatured) {
				toast.success("Товар додано до рекомендованих");
			} else {
				toast.success("Товар видалено з рекомендованих");
			}
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Не вдалося оновити товар");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ featuredProducts: response.data || [], loading: false });
		} catch (error) {
			// Якщо помилка (наприклад, 404), встановлюємо порожній масив
			set({ featuredProducts: [], loading: false });
			// Не показуємо помилку, якщо просто немає featured products
			if (error.response?.status !== 404) {
				console.log("Error fetching featured products:", error);
			}
		}
	},
}));
