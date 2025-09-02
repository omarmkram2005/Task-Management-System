import "../Css/home.css";
import "react-loading-skeleton/dist/skeleton.css";
import { NavLink, useNavigate } from "react-router-dom";
import { langChanger, sessionSaver } from "../Context/CreateContexts";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const { profile } = useContext(sessionSaver);
  const [lang, setLang] = useState({});
  const { text, lang: lango } = useContext(langChanger);

  useEffect(() => {
    setLang(text);
  }, [text]);

  useEffect(() => {
    document.title = lang.home;
  }, [lang]);
  const nav = useNavigate();

  return profile.team_id ? (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "center",

          alignItems: "center",
          height: "calc(100vh - 70px)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "30px",
            flexWrap: "wrap",
            justifyContent: "center",
            padding: "20px",
            flexDirection: "row",
          }}
        >
          <NavLink
            to={"/boards/personal"}
            style={{
              width: "220px",
              height: "300px",
              backgroundColor: "#fff",
              borderRadius: "12px",
              backgroundColor: "var(--card-bg)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              padding: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "23px",
                color: "var(--text-main)",
                fontWeight: "bold",
              }}
            >
              {lang.personalBoards}
            </h2>
          </NavLink>

          <NavLink
            to={"/boards/team"}
            style={{
              width: "220px",
              height: "300px",
              backgroundColor: "var(--card-bg)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              cursor: "pointer",
              padding: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "1.5em",
                color: "var(--text-main)",
                fontWeight: "bold",
              }}
            >
              {lang.teamBoards}
            </h2>
          </NavLink>
        </div>
      </div>
    </div>
  ) : (
    nav("boards/personal")
  );
}
