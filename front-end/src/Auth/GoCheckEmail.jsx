import { useContext, useEffect } from "react";
import { useState } from "react";
import { langChanger } from "../Context/CreateContexts";

export default function GoCheckEmail() {
  const [lang, setLang] = useState({});
  const { lang: lango, text } = useContext(langChanger);
  useEffect(() => {
    setLang(text);
  }, [text]);
  return (
    <div className="container">
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          placeItems: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "350px",
            padding: "10px 15px",
            backgroundColor: "var(--card-bg)",
            borderRadius: "10px",
            boxShadow: "black 0px 0px 5px 1px",
          }}
        >
          <p dir={lango === "eng" ? "ltr" : "rtl"}>{lang.emailComf}</p>
        </div>
      </div>
    </div>
  );
}
