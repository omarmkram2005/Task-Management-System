import { useContext, useState } from "react";
import "../Css/forms.css";
import { supabase } from "../supabase";
import { useEffect } from "react";
import Login from "./LoginWithGoogle";
import { NavLink, useNavigate } from "react-router-dom";
import { langChanger, sessionSaver } from "../Context/CreateContexts";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState(false);
  const [invEmailErr, setInvEmailErr] = useState(false);
  const [netErr, setNetErr] = useState(false);
  const nav = useNavigate();
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState(false);
  const session = useContext(sessionSaver);
  useEffect(() => {
    if (
      session?.session?.user?.identities &&
      session.session.user.identities.length > 0
    ) {
      nav("/");
    }
  }, [session]);

  const [lang, setLang] = useState({});
  const { text } = useContext(langChanger);
  useEffect(() => {
    setLang(text);
  }, [text]);
  useEffect(() => {
    document.title = lang.signup;
  }, [lang]);
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (pass.length > 6) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: pass,
      });

      if (error) {
        console.error("Signup error:", error.message);
        error.message.includes("is invalid" && "Email") && setInvEmailErr(true);
        error.message === "Failed to fetch" && setNetErr(true);
      } else {
        if (!data.session && data.user && data.user.identities.length === 0) {
          setEmailErr(true);
        } else {
          nav("/signup/confermation");
        }
      }
    } else {
      setPassErr(true);
    }
  };
  return (
    <>
      <div className="signup container">
        <form className="card-bg" onSubmit={(e) => handleSignUp(e)}>
          <h2 className="m-text" style={{ margin: "0" }}>
            {lang.signup}
          </h2>
          <input
            type="email"
            placeholder={lang.email + "..."}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailErr ||
            (invEmailErr && (
              <div dir={lang === "ع" && "rtl"} className="err">
                {invEmailErr ? lang.invEmailErr : lang.emailErr}
              </div>
            ))}
          <input
            type="password"
            placeholder={lang.pass + `...`}
            value={pass}
            min={6}
            onChange={(e) => setPass(e.target.value)}
          />
          {passErr && (
            <div dir={lang === "ع" && "rtl"} className="err">
              {lang.passErr}
            </div>
          )}
          {netErr && (
            <div dir={lang === "ع" && "rtl"} className="err">
              NetWork Error!
            </div>
          )}
          <button className="button">{lang.signup}</button>

          <h2
            className="m-text"
            style={{ width: "100%", margin: "0", textAlign: "center" }}
          >
            {lang.or}
          </h2>
          <Login text={lang.signupWithGoogle} />
          <div>
            {lang.doYouHaveAnAccount}{" "}
            <NavLink to="/login">{lang.login}</NavLink>
          </div>
        </form>
      </div>
    </>
  );
}
