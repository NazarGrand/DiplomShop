/** @jsxImportSource theme-ui */
import { Box } from "theme-ui";

const LoadingSpinner = (): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        ".spinner": {
          border: "4px solid",
          borderColor: "gray700",
          borderTopColor: "emerald400",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          animation: "spin 1s linear infinite",
          "@keyframes spin": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        },
      }}
    >
      <div className="spinner" />
    </Box>
  );
};

export default LoadingSpinner;

