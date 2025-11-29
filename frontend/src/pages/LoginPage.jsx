/** @jsxImportSource theme-ui */
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { Box } from "theme-ui";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    login(email, password);
  };

  return (
    <Box
      className="login-page"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 12,
        // px: [0, 6, 8],
        ".login-header": {
          mx: "auto",
          width: "100%",
          maxWidth: "28rem",
          ".login-title": {
            mt: 6,
            textAlign: "center",
            fontSize: "1.875rem",
            fontWeight: 800,
            color: "emerald400",
          },
        },
        ".login-form-container": {
          mt: 1,
          mx: "auto",
          width: "100%",
          maxWidth: ["80%", "60%", "40%"],
          ".login-form-card": {
            bg: "gray800",
            py: 5,
            px: [4, 35],
            boxShadow: "medium",
            borderRadius: ["0", "lg"],
            ".login-form": {
              display: "flex",
              flexDirection: "column",
              gap: 3,
              ".form-group": {
                ".form-label": {
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "gray300",
                },
                ".input-wrapper": {
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  ".input-icon": {
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    "& svg": {
                      height: "20px",
                      width: "20px",
                      color: "gray400",
                    },
                  },
                  ".form-input": {
                    display: "block",
                    width: "100%",
                    px: 3,
                    py: 2,
                    bg: "gray700",
                    border: "1px solid",
                    borderColor: "gray600",
                    borderRadius: "md",
                    boxShadow: "soft",
                    fontSize: "0.875rem",
                    color: "white",
                    "&::placeholder": {
                      color: "gray400",
                    },
                    "&:focus": {
                      outline: "none",
                      borderColor: "emerald500",
                      boxShadow: "0 0 0 1px rgba(16, 185, 129, 1)",
                    },
                  },
                },
              },
              ".submit-button": {
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 2,
                px: 4,
                border: "1px solid",
                borderColor: "transparent",
                borderRadius: "md",
                boxShadow: "soft",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "white",
                bg: "emerald600",
                cursor: "pointer",
                transition: "all 0.15s ease-in-out",
                "&:hover": {
                  bg: "emerald700",
                },
                "&:focus": {
                  outline: "none",
                  boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)",
                },
                "&:disabled": {
                  opacity: 0.5,
                },
                ".button-icon": {
                  mr: 2,
                  height: "20px",
                  width: "20px",
                },
              },
            },
            ".login-footer": {
              mt: 5,
              textAlign: "center",
              fontSize: "0.875rem",
              color: "gray400",
              ".signup-link": {
                fontWeight: 500,
                color: "emerald400",
                textDecoration: "none",
                "&:hover": {
                  color: "rgba(16, 185, 129, 0.8)",
                },
                ".link-icon": {
                  display: "inline",
                  height: "16px",
                  width: "16px",
                },
              },
            },
          },
        },
      }}
    >
      <motion.div
        className="login-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="login-title">Увійдіть до свого облікового запису</h2>
      </motion.div>

      <motion.div
        className="login-form-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="login-form-card">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Електронна пошта
              </label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Mail aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="button-icon" aria-hidden="true" />
                  Завантаження...
                </>
              ) : (
                <>
                  <LogIn className="button-icon" aria-hidden="true" />
                  Увійти
                </>
              )}
            </button>
          </form>

          <p className="login-footer">
            Немає облікового запису?{" "}
            <Link to="/signup" className="signup-link">
              Зареєструватися зараз <ArrowRight className="link-icon" />
            </Link>
          </p>
        </div>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
