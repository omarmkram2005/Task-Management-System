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

  const profile = useContext(sessionSaver);
  // useEffect(() => {
  //   if (profile) {
  //     setUser(profile);
  //   }
  // }, [profile]);

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
      window.location.pathname = "/";
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
            {profile.session && (
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
                {
                  <img
                    alt="sss"
                    width="37px"
                    height="37px"
                    style={{
                      borderRadius: "50%",
                      border: "2px solid var(--secondary)",
                    }}
                    src={
                      profile?.profile?.avatar_url?.length > 0
                        ? profile?.profile?.avatar_url
                        : "https://ui-avatars.com/api/?name=" +
                          (!profile?.profile?.full_name
                            ? "No Name"
                            : profile?.profile?.full_name) +
                          "&background=random&color=fff"
                    }
                    onClick={() => setDrobDownOn(true)}
                  />
                }
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
                      zIndex: "990",
                    }}
                  >
                    <button
                      className="listButton"
                      onClick={(e) => {
                        setDrobDownOn(false);
                        nav("/profile");
                      }}
                      title={lango.profile}
                    >
                      {lango.profile}
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
