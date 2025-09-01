import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { langChanger, sessionSaver } from "../Context/CreateContexts";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddBoard({ setAddbutton }) {
  const location = useLocation();
  const { profile } = useContext(sessionSaver);

  const isTeam = location.pathname.includes("team");
  const [form, setForm] = useState({
    title: "",
  });
  const [submit, setSubmit] = useState(false);
  const [lang, setLang] = useState({});
  const nav = useNavigate();

  const { text } = useContext(langChanger);
  useEffect(() => {
    setLang(text);
  }, [text]);

  async function SubmitData(e) {
    e.preventDefault();
    if (submit) {
      return;
    }
    setSubmit(true);
    const { data, error } = await supabase.from("boards").insert([
      {
        title: form.title,
        team_id: isTeam ? profile.team_id : null,
      },
    ]);

    if (error) {
      // console.error(error);
    } else {
      setAddbutton(false);
      nav(isTeam ? "/boards/team" : "/boards/personal");
    }

    setSubmit(false);
  }
  function handleChangeSubmit(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#1e2125b5",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "980",
      }}
    >
      <form
        style={{
          display: "flex",
          flexWrap: "wrap",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          backgroundColor: "var(--card-bg)",
          width: "400px",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          borderRadius: "12px",
        }}
        onSubmit={(e) => SubmitData(e)}
      >
        <h2 style={{ margin: "10px 0", width: "100%", textAlign: "center" }}>
          {lang.addBoard}
        </h2>
        <label style={{ width: "100%" }} htmlFor="title">
          {lang.title}:
        </label>
        <input
          id="title"
          className="addInputs"
          onChange={(e) => {
            handleChangeSubmit(e);
          }}
          name="title"
          type="text"
          placeholder={lang.title}
        />
        <button
          className="button"
          onClick={(e) => SubmitData(e)}
          style={{ marginTop: "10px" }}
          disabled={submit || form.title === ""}
        >
          {submit ? `${lang.adding}` : `${lang.addBoard}`}
        </button>
      </form>
    </div>
  );
}
