import { create } from "zustand";
import { Product } from "../types";

interface CompareStore {
	compareProducts: Product[];
	addToCompare: (product: Product) => void;
	removeFromCompare: (productId: string) => void;
	clearCompare: () => void;
	canAddProduct: (product: Product) => boolean;
	loadFromStorage: () => void;
}

const STORAGE_KEY = "compare-products";

const loadFromStorage = (): Product[] => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (error) {
		console.error("Error loading compare products from storage:", error);
	}
	return [];
};

const saveToStorage = (products: Product[]): void => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
	} catch (error) {
		console.error("Error saving compare products to storage:", error);
	}
};

export const useCompareStore = create<CompareStore>((set, get) => ({
	compareProducts: loadFromStorage(),

	loadFromStorage: () => {
		const products = loadFromStorage();
		set({ compareProducts: products });
	},

	addToCompare: (product: Product) => {
		const { compareProducts } = get();
		
		// Check if product is already in compare
		if (compareProducts.some((p) => p._id === product._id)) {
			return;
		}

		// Check if we can add product (same category and max 2 products)
		if (compareProducts.length >= 2) {
			return;
		}

		// Check if product has same category as existing products
		if (compareProducts.length > 0) {
			const firstCategory = compareProducts[0].category;
			if (product.category !== firstCategory) {
				return;
			}
		}

		const newProducts = [...compareProducts, product];
		set({ compareProducts: newProducts });
		saveToStorage(newProducts);
	},

	removeFromCompare: (productId: string) => {
		const newProducts = get().compareProducts.filter(
			(p) => p._id !== productId
		);
		set({ compareProducts: newProducts });
		saveToStorage(newProducts);
	},

	clearCompare: () => {
		set({ compareProducts: [] });
		saveToStorage([]);
	},

	canAddProduct: (product: Product) => {
		const { compareProducts } = get();
		
		// Check if already in compare
		if (compareProducts.some((p) => p._id === product._id)) {
			return false;
		}

		// Check if max products reached
		if (compareProducts.length >= 2) {
			return false;
		}

		// Check if same category
		if (compareProducts.length > 0) {
			const firstCategory = compareProducts[0].category;
			return product.category === firstCategory;
		}

		return true;
	},
}));
