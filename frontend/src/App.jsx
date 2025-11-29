/** @jsxImportSource theme-ui */
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Box } from "theme-ui";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";
import Navbar from "./components/Navbar";
import { useUserStore } from "./stores/useUserStore";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems } = useCartStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [getCartItems, user]);

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <Box
      className="app"
      sx={{
        minHeight: "100vh",
        bg: "gray900",
        color: "white",
        position: "relative",
        overflow: "hidden",
        ".app-background": {
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          ".app-background-inner": {
            position: "absolute",
            inset: 0,
            ".app-background-gradient": {
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              height: "100%",
              background:
                "radial-gradient(ellipse at top, rgba(16,185,129,0.3) 0%, rgba(10,80,60,0.2) 45%, rgba(0,0,0,0.1) 100%)",
            },
          },
        },
        ".app-content": {
          position: "relative",
          zIndex: 50,
          pt: 20,
        },
      }}
    >
      <div className="app-background">
        <div className="app-background-inner">
          <div className="app-background-gradient" />
        </div>
      </div>

      <div className="app-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" />
            }
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/cart"
            element={user ? <CartPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase-success"
            element={user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/purchase-cancel"
            element={user ? <PurchaseCancelPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      <Toaster />
    </Box>
  );
}

export default App;
