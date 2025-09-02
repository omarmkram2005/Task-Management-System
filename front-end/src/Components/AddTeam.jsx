import { useState, useContext, useEffect } from "react";
import { supabase } from "../supabase";
import { langChanger, sessionSaver } from "../Context/CreateContexts";
import { useNavigate } from "react-router-dom";

function AddTeam() {
  const { userId } = useContext(sessionSaver);
  const [teamid, setTeamid] = useState("");
  const [teamNotFoundErr, setTeamNotFoundErr] = useState(false);
  const [teamTitle, setTeamTitle] = useState("");
  const [active, setActive] = useState("join");
  const nav = useNavigate();
  const [lang, setLang] = useState({});

  const { lang: lango, text } = useContext(langChanger);
  useEffect(() => {
    setLang(text);
  }, [text]);

  useEffect(() => {
    document.title = lang.teams;
  }, [lang]);
  function generateUUID() {
    let bytes = new Uint8Array(16);

    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      const nodeCrypto = require("crypto");
      bytes = nodeCrypto.randomBytes(16);
    }

    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0"));
    return [
      hex.slice(0, 4).join(""),
      hex.slice(4, 6).join(""),
      hex.slice(6, 8).join(""),
      hex.slice(8, 10).join(""),
      hex.slice(10, 16).join(""),
    ].join("-");
  }
  async function joinTeam(teamid) {
    if (teamid) {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("id", teamid)
        .single();

      if (error) {
        // console.error(error);
        setTeamNotFoundErr(true);
      } else {
        const { error } = await supabase
          .from("profiles ")
          .update({ team_id: teamid, role: "member" })
          .eq("id", userId)
          .then(({ error }) => {
            if (error) {
              // console.error( error);
            } else {
              window.location.pathname = "/profile";
            }
          });
      }
    }
  }
  async function addTeam() {
    const id = generateUUID();
    const { data, error } = await supabase
      .from("teams")
      .insert({ id: id, title: teamTitle });

    if (error) {
      // console.error(error);
    } else {
      const { error: er } = await supabase
        .from("profiles ")
        .update({ team_id: id, role: "admin" })
        .eq("id", userId);
      if (!er) {
        window.location.pathname = "/profile";
      }
    }
  }
  function isUUID(value) {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return regex.test(value);
  }
  return (
    <div className=" container" style={{ marginTop: "100px" }}>
      <div dir="rtl" style={{ display: "flex" }}>
        <button
          style={{
            flexBasis: "50%",
            width: "45%",
            borderRadius: "0 10px 10px 0",
          }}
          type="button"
          className={active === "join" ? "active" : ""}
          onClick={(e) => {
            setActive("join");
          }}
        >
          {lang.joinTeam}
        </button>
        <button
          style={{
            flexBasis: "50%",
            width: "45%",
            borderRadius: "10px 0 0 10px",
          }}
          type="button"
          className={active === "add" ? "active" : ""}
          onClick={(e) => {
            setActive("add");
          }}
        >
          {lang.addTeam}
        </button>
      </div>
      {active === "add" && (
        <div
          className="signup "
          style={{
            flexDirection: "column",
            width: "100%",
            display: "flex",
            gap: "30px",
            height: "fit-content",
            marginTop: "20px",
          }}
        >
          <label>{lang.teamTitle}:</label>
          <input
            type="text"
            value={teamTitle}
            placeholder={lang.teamTitlePlaceholder}
            minLength={3}
            maxLength={30}
            required
            style={{ width: "100%" }}
            onChange={(e) => setTeamTitle(e.target.value)}
          />
          {teamTitle.length < 3 && teamTitle.length > 0 && (
            <div dir={lango === "ع" && "rtl"} className="err">
              {lang.teamTitleErr}
            </div>
          )}
          <button
            style={{
              flexBasis: "50%",
              width: "45%",
              cursor: !isUUID(teamid) ? "no-drop" : "pointer",
              borderRadius: "10px",
            }}
            type="button"
            disabled={teamTitle.length < 3}
            className={active === "add" ? "active" : ""}
            onClick={(e) => {
              addTeam();
            }}
          >
            {lang.addTeam}
          </button>
        </div>
      )}
      {active === "join" && (
        <div
          className="signup "
          style={{
            flexDirection: "column",
            width: "100%",
            display: "flex",
            gap: "30px",
            height: "fit-content",
            marginTop: "20px",
          }}
        >
          <label>{lang.teamId}:</label>
          <input
            type="text"
            placeholder={lang.teamIdPlaceholder}
            required
            style={{ width: "100%" }}
            onChange={(e) => setTeamid(e.target.value)}
          />

          {!isUUID(teamid) && teamid.length > 0 && (
            <div dir={lango === "ع" && "rtl"} className="err">
              {lang.teamIdErr}
            </div>
          )}
          {teamNotFoundErr && (
            <div dir={lango === "ع" && "rtl"} className="err">
              {lang.teamNotFound}
            </div>
          )}
          <button
            style={{
              flexBasis: "50%",
              width: "45%",
              borderRadius: "10px",
              cursor: !isUUID(teamid) ? "no-drop" : "pointer",
            }}
            type="button"
            disabled={!isUUID(teamid)}
            className={active === "join" ? "active" : ""}
            onClick={(e) => {
              joinTeam(teamid);
            }}
          >
            {lang.joinTeam}
          </button>
        </div>
      )}
    </div>
  );
}

export default AddTeam;
