/** @jsxImportSource theme-ui */
import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { Box } from "theme-ui";
import { useUserStore } from "../stores/useUserStore";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = (): JSX.Element => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, loading } = useUserStore();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    signup(formData);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      className="signup-page"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 12,
        px: [0, 6, 8],
        ".signup-header": {
          mx: "auto",
          width: "100%",
          maxWidth: "28rem",
          ".signup-title": {
            mt: 6,
            textAlign: "center",
            fontSize: "1.875rem",
            fontWeight: 900,
            color: "emerald400",
          },
        },
        ".signup-form-container": {
          mt: 1,
          mx: "auto",
          width: "100%",
          maxWidth: "50rem",
          ".signup-form-card": {
            bg: "gray800",
            py: 5,
            px: [4, 35],
            boxShadow: "medium",
            borderRadius: "xl",
            ".signup-form": {
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
            ".signup-footer": {
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
      <div className="signup-header">
        <motion.h1
          className="signup-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Реєстрація
        </motion.h1>
      </div>

      <div className="signup-form-container">
        <motion.div
          className="signup-form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Ім&apos;я
              </label>
              <div className="form-input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Ваше ім'я"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Електронна пошта
              </label>
              <div className="form-input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Підтвердження пароля
              </label>
              <div className="form-input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
                  Зареєструватися
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="signup-footer">
            <p className="footer-text">
              Вже є обліковий запис?{" "}
              <Link to="/login" className="footer-link">
                Увійти
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </Box>
  );
};

export default SignUpPage;
