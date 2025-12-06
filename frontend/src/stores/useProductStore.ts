import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import { Product } from "../types";

interface ProductStore {
	products: Product[];
	featuredProducts: Product[];
	currentProduct: Product | null;
	loading: boolean;
	setProducts: (products: Product[]) => void;
	fetchProductById: (productId: string) => Promise<void>;
	createProduct: (productData: Omit<Product, "_id" | "isFeatured" | "createdAt" | "updatedAt">) => Promise<void>;
	fetchAllProducts: () => Promise<void>;
	fetchProductsByCategory: (category: string) => Promise<void>;
	deleteProduct: (productId: string) => Promise<void>;
	updateProduct: (productId: string, productData: Partial<Product>) => Promise<void>;
	toggleFeaturedProduct: (productId: string) => Promise<void>;
	fetchFeaturedProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
	products: [],
	featuredProducts: [],
	currentProduct: null,
	loading: false,

	setProducts: (products: Product[]) => set({ products }),
	fetchProductById: async (productId: string) => {
		set({ loading: true });
		try {
			const response = await axios.get<Product>(`/products/${productId}`);
			set({ currentProduct: response.data, loading: false });
		} catch (error: any) {
			set({ currentProduct: null, loading: false });
			toast.error(error.response?.data?.message || "Не вдалося завантажити товар");
		}
	},
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post<Product>("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error: any) {
			toast.error(error.response?.data?.error || "Помилка створення товару");
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get<{ products: Product[] }>("/products");
			set({ products: response.data.products, loading: false });
		} catch (error: any) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Не вдалося завантажити товари");
		}
	},
	fetchProductsByCategory: async (category: string) => {
		set({ loading: true });
		try {
			const response = await axios.get<{ products: Product[] }>(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error: any) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Не вдалося завантажити товари");
		}
	},
	deleteProduct: async (productId: string) => {
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
		} catch (error: any) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Не вдалося видалити товар");
		}
	},
	updateProduct: async (productId: string, productData: Partial<Product>) => {
		set({ loading: true });
		try {
			const res = await axios.put<Product>(`/products/${productId}`, productData);
			set((prevState) => ({
				products: prevState.products.map((product) =>
					product._id === productId ? res.data : product
				),
				loading: false,
			}));
			toast.success("Товар успішно оновлено");
		} catch (error: any) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Не вдалося оновити товар");
		}
	},
	toggleFeaturedProduct: async (productId: string) => {
		set({ loading: true });
		try {
			const response = await axios.patch<Product>(`/products/${productId}`);
			const updatedProduct = response.data;
			
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: updatedProduct.isFeatured } : product
				),
			}));
			
			await get().fetchFeaturedProducts();
			
			if (updatedProduct.isFeatured) {
				toast.success("Товар додано до рекомендованих");
			} else {
				toast.success("Товар видалено з рекомендованих");
			}
		} catch (error: any) {
			set({ loading: false });
			toast.error(error.response?.data?.error || "Не вдалося оновити товар");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get<Product[]>("/products/featured");
			set({ featuredProducts: response.data || [], loading: false });
		} catch (error: any) {
			set({ featuredProducts: [], loading: false });
			if (error.response?.status !== 404) {
				console.log("Error fetching featured products:", error);
			}
		}
	},
}));

