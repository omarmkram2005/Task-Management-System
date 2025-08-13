import { useState } from "react";
import "../Css/forms.css";
import { supabase } from "../supabase";
import { useEffect } from "react";
import Login from "./LoginWithGoogle";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { langChanger, sessionSaver } from "../Context/CreateContexts";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [wrongInfo, setWrongInfo] = useState(false);
  const [notConf, setNotConf] = useState(false);
  const [netErr, setNetErr] = useState(false);
  const [pass, setPass] = useState("");

  const [lang, setLang] = useState({});
  const nav = useNavigate();
  const { text } = useContext(langChanger);
  useEffect(() => {
    setLang(text);
  }, [text]);
  useEffect(() => {
    document.title = lang.login;
  }, [lang]);
  async function handleLogin(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pass,
    });
    if (data) {
      nav("/");
    }
    if (error) {
      error.message === "Invalid login credentials"
        ? setWrongInfo(true)
        : error.message === "Email not confirmed"
        ? setNotConf(true)
        : setNetErr(true);
    }
  }

  return (
    <div className="signup container">
      <form className="card-bg" onSubmit={(e) => handleLogin(e)}>
        <h2 className="m-text" style={{ margin: "0" }}>
          {lang.login}
        </h2>
        <input
          type="email"
          placeholder={lang.email + "..."}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {notConf && (
          <div dir={lang === "ع" && "rtl"} className="err">
            {lang.notConf}
          </div>
        )}
        <input
          type="password"
          placeholder={lang.pass + `...`}
          value={pass}
          min={6}
          onChange={(e) => setPass(e.target.value)}
        />
        {wrongInfo && (
          <div dir={lang === "ع" && "rtl"} className="err">
            {lang.wrongInfo}
          </div>
        )}
        {netErr && (
          <div dir={lang === "ع" && "rtl"} className="err">
            NetWork Error!
          </div>
        )}
        <button className="button">{lang.login}</button>

        <h2
          className="m-text"
          style={{ width: "100%", margin: "0", textAlign: "center" }}
        >
          {lang.or}
        </h2>
        <Login text={lang.loginWithGoogle} />
        <div>
          {lang.dontYouHaveAnAccount}{" "}
          <NavLink to="/signup">{lang.signup}</NavLink>
        </div>
      </form>
    </div>
  );
}
