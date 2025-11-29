/** @jsxImportSource theme-ui */
const LoadingSpinner = () => {
  return (
    <div
      className="loading-spinner"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bg: "gray900",
        ".spinner-container": {
          position: "relative",
          ".spinner-base": {
            width: "80px",
            height: "80px",
            border: "2px solid",
            borderColor: "#4dbeff",
            borderRadius: "full",
          },
          ".spinner-animated": {
            width: "80px",
            height: "80px",
            border: "2px solid",
            borderColor: "transparent",
            borderTopColor: "#c7d0d8",
            borderRadius: "full",
            position: "absolute",
            left: 0,
            top: 0,
            animation: "spin 1s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          },
        },
      }}
    >
      <div className="spinner-container">
        <div className="spinner-base" />
        <div className="spinner-animated" />
        <div
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
          }}
        >
          Loading
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
