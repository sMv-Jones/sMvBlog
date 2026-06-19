function Logo({ width }) {
  return (
    <img
      src="logo.png"
      alt="Logo"
      style={{
        width: width || "150px",
        height: width || "150px",
        aspectRatio: "1 / 1",
        flexShrink: 0,
        objectFit: "cover",
        display: "block",
        borderRadius: "50%",
      }}
    />
  );
}

export default Logo;