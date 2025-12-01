/** @jsxImportSource theme-ui */
import { useState, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react";
import { Box } from "theme-ui";
import { useUserStore } from "../stores/useUserStore";

const LoginPage = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login, loading } = useUserStore();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
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
        ".login-header": {
          mx: "auto",
          width: "100%",
          maxWidth: "28rem",
          ".login-title": {
            mt: 6,
            textAlign: "center",
            fontSize: "1.875rem",
            fontWeight: 900,
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
            borderRadius: "xl",
            ".login-form": {
              ".form-group": {
                mb: 4,
                ".form-label": {
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "gray300",
                  mb: 2,
                },
                ".form-input-wrapper": {
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  ".input-icon": {
                    color: "gray400",
                    flexShrink: 0,
                  },
                  ".form-input": {
                    flex: 1,
                    bg: "gray700",
                    border: "1px solid",
                    borderColor: "gray600",
                    borderRadius: "md",
                    py: 2,
                    px: 3,
                    color: "white",
                    fontSize: "0.875rem",
                    "&:focus": {
                      outline: "none",
                      borderColor: "#6f82a0",
                    },
                    "&::placeholder": {
                      color: "gray500",
                    },
                  },
                },
              },
              ".submit-button": {
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                bg: "#3f5f9a",
                color: "white",
                py: 3,
                px: 4,
                borderRadius: "md",
                fontSize: "0.875rem",
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": {
                  bg: "#324a7c",
                },
                "&:disabled": {
                  opacity: 0.5,
                  cursor: "not-allowed",
                },
              },
            },
            ".login-footer": {
              mt: 4,
              textAlign: "center",
              ".footer-text": {
                fontSize: "0.875rem",
                color: "gray400",
                ".footer-link": {
                  color: "emerald400",
                  textDecoration: "none",
                  fontWeight: 500,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                },
              },
            },
          },
        },
      }}
    >
      <div className="login-header">
        <motion.h1
          className="login-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Вхід
        </motion.h1>
      </div>

      <div className="login-form-container">
        <motion.div
          className="login-form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Електронна пошта
              </label>
              <div className="form-input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <div className="form-input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="spinning" size={18} />
                  Завантаження...
                </>
              ) : (
                <>
                  Увійти
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="footer-text">
              Немає облікового запису?{" "}
              <Link to="/signup" className="footer-link">
                Зареєструватися
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Box>
  );
};

export default LoginPage;
