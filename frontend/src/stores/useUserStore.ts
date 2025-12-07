import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { User } from "../types";

interface SignupData {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface UserStore {
	user: User | null;
	loading: boolean;
	checkingAuth: boolean;
	signup: (data: SignupData) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
	refreshToken: () => Promise<any>;
}

let refreshPromise: Promise<any> | null = null;

export const useUserStore = create<UserStore>((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Паролі не співпадають");
		}

		try {
			const res = await axios.post<User>("/auth/signup", { name, email, password });
			set({ user: res.data, loading: false });
		} catch (error: any) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Сталася помилка");
		}
	},
	login: async (email: string, password: string) => {
		set({ loading: true });

		try {
			const res = await axios.post<User>("/auth/login", { email, password });
			set({ user: res.data, loading: false });
		} catch (error: any) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Сталася помилка");
		}
	},

	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Сталася помилка під час виходу");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get<User>("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error: any) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		// Don't block if checkingAuth is true - we need to refresh token during auth check
		const wasCheckingAuth = get().checkingAuth;
		if (!wasCheckingAuth) {
			set({ checkingAuth: true });
		}
		
		try {
			const response = await axios.get("/auth/refresh");
			if (!wasCheckingAuth) {
				set({ checkingAuth: false });
			}
			return response.data;
		} catch (error: any) {
			console.error("Refresh token error:", error.response?.data || error.message);
			if (!wasCheckingAuth) {
				set({ user: null, checkingAuth: false });
			}
			throw error;
		}
	},
}));

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		
		// Skip refresh for auth endpoints to avoid infinite loops
		if (error.response?.status === 401 && !originalRequest._retry && 
		    !originalRequest.url?.includes("/auth/refresh") &&
		    !originalRequest.url?.includes("/auth/login") &&
		    !originalRequest.url?.includes("/auth/signup")) {
			originalRequest._retry = true;

			try {
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError: any) {
				console.error("Refresh token failed:", refreshError.response?.data || refreshError.message);
				refreshPromise = null;
				// Don't logout if we're checking auth - let checkAuth handle it
				if (!useUserStore.getState().checkingAuth) {
					useUserStore.getState().logout();
				}
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

