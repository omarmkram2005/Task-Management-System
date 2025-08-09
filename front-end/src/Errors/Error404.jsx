import "../Css/Error404.css";
export default function Error404() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ color: "red" }}>404</h1>
      <h2 className="error404">Page Not Found</h2>
    </div>
  );
}
