function PlaceholderImage({ text, bgColor = "#f0f0f0", textColor = "#666" }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      minHeight: "300px",
      background: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: textColor,
      fontSize: "18px",
      fontWeight: "500",
      borderRadius: "16px"
    }}>
      {text}
    </div>
  );
}

export default PlaceholderImage;