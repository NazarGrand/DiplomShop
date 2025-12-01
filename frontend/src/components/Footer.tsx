/** @jsxImportSource theme-ui */
import { Link } from "react-router-dom";
import { Box } from "theme-ui";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Heart,
} from "lucide-react";

const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      className="footer"
      sx={{
        position: "relative",
        zIndex: 10,
        bg: "gray900",
        borderTop: "1px solid",
        borderColor: "gray700",
        mt: "auto",
        ".footer-container": {
          maxWidth: "1280px",
          mx: "auto",
          px: ["1rem", "1.5rem", "2rem"],
          py: 4,
          ".footer-content": {
            display: "grid",
            gridTemplateColumns: [
              "1fr",
              "1fr",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ],
            gap: 5,
            mb: 4,
            ".footer-column": {
              ".footer-title": {
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "emerald400",
                mb: 3,
                fontFamily: "oswald",
                letterSpacing: "1px",
              },
              ".footer-links": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
                ".footer-link": {
                  color: "gray400",
                  textDecoration: "none",
                  fontSize: "1rem",
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: "emerald400",
                  },
                },
              },
              ".footer-contact": {
                display: "flex",
                flexDirection: "column",
                gap: 2,
                ".contact-item": {
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: "gray400",
                  fontSize: "1rem",
                  ".contact-icon": {
                    color: "emerald400",
                    flexShrink: 0,
                  },
                },
              },
              ".footer-social": {
                display: "flex",
                gap: 3,
                mt: 2,
                ".social-link": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "full",
                  bg: "gray800",
                  color: "gray400",
                  border: "1px solid",
                  borderColor: "gray700",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bg: "#3f5f9a",
                    color: "white",
                    borderColor: "#25365c",
                    transform: "translateY(-2px)",
                  },
                },
              },
              ".footer-description": {
                color: "gray400",
                fontSize: "1rem",
                lineHeight: 1.7,
                mb: 3,
              },
            },
          },
          ".footer-bottom": {
            pt: 4,
            borderTop: "1px solid",
            borderColor: "gray700",
            display: "flex",
            flexDirection: ["column", "row"],
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
            ".footer-copyright": {
              color: "gray500",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
              ".heart-icon": {
                color: "red",
              },
            },
            ".footer-payments": {
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: "gray500",
              fontSize: "0.875rem",
            },
          },
        },
      }}
    >
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-title">ElectroLab</h3>
            <p className="footer-description">
              Ваш надійний партнер у світі електроніки. Широкий вибір техніки
              високої якості за доступними цінами.
            </p>
            <div className="footer-social">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Навігація</h3>
            <div className="footer-links">
              <Link to="/" className="footer-link">
                Головна
              </Link>
              <Link to="/category/smartphones" className="footer-link">
                Смартфони
              </Link>
              <Link to="/category/laptops" className="footer-link">
                Ноутбуки
              </Link>
              <Link to="/category/computers" className="footer-link">
                Комп&apos;ютери
              </Link>
              <Link to="/category/gaming" className="footer-link">
                Геймінг
              </Link>
            </div>
          </div>

          <div className="footer-column">
            <h3 className="footer-title">Контакти</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <Mail className="contact-icon" size={18} />
                <span>info@electrolab.com</span>
              </div>
              <div className="contact-item">
                <MapPin className="contact-icon" size={18} />
                <span>м. Чернівці, вул. Головна, 75</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span>© {currentYear} ElectroLab. Всі права захищені.</span>
            <span>Зроблено з</span>
            <Heart className="heart-icon" size={14} />
            <span>в Україні</span>
          </div>
          <div className="footer-payments">
            <span>Приймаємо оплату:</span>
            <span>💳 Visa, MasterCard, PayPal</span>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Footer;

