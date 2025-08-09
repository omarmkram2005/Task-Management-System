import { useState } from "react";
import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { langChanger, sessionSaver } from "../Context/CreateContexts";
import setTheme from "../Css/theme";
import { supabase } from "../supabase";
import darkMode from "../assets/darkMode.png";
export default function NavBar() {
  const [lango, setLango] = useState();
  const [drobDownOn, setDrobDownOn] = useState(false);
  const [user, setUser] = useState({ identity_data: { avatar: "", name: "" } });
  const session = useContext(sessionSaver);
  useEffect(() => {
    if (
      session?.session?.user?.identities &&
      session.session.user.identities.length > 0
    ) {
      setUser(session.session.user.identities[0]);
    }
  }, [session]);

  const nav = useNavigate();
  const { lang, setLang, text } = useContext(langChanger);
  useEffect(() => {
    setLango(text);
  }, [text]);
  useEffect(() => {
    function closeDropdown(e) {
      if (e.target.closest(".drobdown-parent")) return;

      if (!e.target.classList.contains("drobdown")) {
        setDrobDownOn(false);
      }
    }

    if (drobDownOn) {
      document.addEventListener("click", closeDropdown);
    }

    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, [drobDownOn]);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      <Navigate to="/login" replace />;
    }
  };
  return (
    <>
      <div
        className="navbar"
        style={{
          width: "100%",
          height: "70px",
          backgroundColor: "var(--navBgColor)",
          position: "absolute",
          top: "0",
          left: "0",
          boxShadow: "0 0 10px 0 #9292ffde",
          borderBottom: "1px solid #acacff",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          <h1
            style={{ margin: "0", padding: "0", cursor: "pointer" }}
            onClick={() => nav("/")}
          >
            Taskly
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <button
              id="theme-toggle"
              theme="light"
              style={{
                backgroundColor: "transparent",
                padding: "0",
                outline: "none",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={(e) => setTheme(e.target.getAttribute("theme"))}
            >
              <img
                width="37px"
                style={{
                  rotate: "var(--rotateIcon)",
                  transition: ".3s !important",
                }}
                src={darkMode}
                alt="not there"
              />
            </button>
            <button
              style={{
                backgroundColor: "var(--primary)",
                padding: "5px",
                width: "37px",
                height: "37px",
                outline: "none",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={(e) => {
                setLang(lang === "eng" ? "ع" : "eng");
                window.localStorage.setItem(
                  "lang",
                  lang === "eng" ? "ع" : "eng"
                );
              }}
            >
              {lang.toUpperCase()}
            </button>
            {session.session && (
              <div
                style={{
                  padding: "0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  cursor: "pointer",
                }}
                className="drobdown-parent"
              >
                {user?.identity_data?.avatar_url !== undefined ? (
                  <img
                    alt="sss"
                    width="37px"
                    style={{ borderRadius: "50%" }}
                    src={user?.identity_data?.avatar_url}
                    onClick={() => setDrobDownOn(true)}
                  ></img>
                ) : (
                  <svg
                    className="drobdown"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="var(--text-main)"
                    width={"37px"}
                    viewBox="0 0 24 24"
                    onClick={() => setDrobDownOn(true)}
                  >
                    <g data-name="60.User">
                      <path d="M12 12a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm0-6a2 2 0 1 0 2 2 2 2 0 0 0-2-2zM18.9 21.166l-1.972-.332a5 5 0 1 0-9.862 0l-1.966.332a7 7 0 1 1 13.806 0z" />
                      <path d="M12 24a12 12 0 1 1 12-12 12.013 12.013 0 0 1-12 12zm0-22a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2z" />
                    </g>
                  </svg>
                )}
                {drobDownOn && (
                  <div
                    className="drobdown"
                    style={{
                      padding: "0 15px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "absolute",
                      top: " 45px",
                      right:
                        document.documentElement.getAttribute("dir") === "ltr"
                          ? "0"
                          : "-150px",
                      backgroundColor: "var(--drobDownColor)",
                      borderRadius: " 6px",
                      flexWrap: "wrap",
                      width: "150px",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      className="listButton"
                      style={{ padding: "10px 60px " }}
                      onClick={(e) => setDrobDownOn(false)}
                    >
                      {user?.identity_data.name === undefined
                        ? lango.profile
                        : user?.identity_data.name}
                    </button>
                    <button
                      className="listButton"
                      onClick={(e) => setDrobDownOn(false)}
                    >
                      {lango.boards}
                    </button>
                    <button className="listButton" onClick={(e) => logout()}>
                      {lango.logout}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
