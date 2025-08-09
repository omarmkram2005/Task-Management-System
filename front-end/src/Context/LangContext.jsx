import { useState } from "react";
import { useEffect } from "react";
import App from "../App";
import { langChanger } from "./CreateContexts";

function LangContext() {
  const [lang, setLang] = useState(
    window.localStorage.getItem("lang") || "eng"
  );

  const [text, setText] = useState({});

  useEffect(() => {
    async function ChangeLang() {
      try {
        const res = await fetch("/lang-text.json");
        let langText = await res.json();
        setText(langText[lang]);
        if (lang === "eng") {
          document.documentElement.setAttribute("dir", "ltr");
        } else {
          document.documentElement.setAttribute("dir", "rtl");
        }
      } catch (err) {
        console.log(err);
      }
    }
    ChangeLang();
  }, [lang]);
  const contProvider = { lang, setLang, text };
  return (
    <langChanger.Provider value={contProvider}>
      <App />
    </langChanger.Provider>
  );
}

export default LangContext;
