import { useState, useContext, useEffect } from "react";
import { supabase } from "../supabase";
import { langChanger, sessionSaver } from "../Context/CreateContexts";
import { useNavigate } from "react-router-dom";
import "../Css/forms.css";

export default function Profile() {
  const { profile } = useContext(sessionSaver);
  const [teamid, setTeamid] = useState("");
  const [team_title, setTeamTitle] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [role, setRole] = useState("member");
  const [editRole, setEditRole] = useState("");
  const [submitRole, setSubmitRole] = useState(false);
  const nav = useNavigate();
  const [lang, setLang] = useState({});
  const { text, lang: lango } = useContext(langChanger);

  useEffect(() => {
    setLang(text);
  }, [text]);

  useEffect(() => {
    document.title = lang.profile;
  }, [lang]);

  useEffect(() => {
    async function getTeam() {
      if (profile) {
        const { data, error } = await supabase
          .from("teams")
          .select("*")
          .eq("id", profile.team_id)
          .single();

        if (!error && data) {
          setTeamid(data.id);
          setTeamTitle(data.title);
          const { data: mem, error: err } = await supabase
            .from("profiles")
            .select("*")
            .eq("team_id", profile.team_id)
            .order("full_name", { ascending: true });
          if (!err) {
            setTeamMembers(mem || []);
          }
        }
      }
    }
    getTeam();
  }, [profile]);
  useEffect(() => {
    async function edit_role() {
      if (profile.role === "admin") {
        const { error } = await supabase
          .from("profiles")
          .update({ role: role })
          .eq("id", editRole);

        if (error) {
          // console.error( error.message);
        } else {
          window.location.reload();
        }
      }
      // if (profile.role === "member") {
      //   console.error("not an admin");
      // }
    }
    edit_role();
  }, [submitRole]);

  async function deleteMem(id) {
    const { error } = await supabase
      .from("profiles")
      .update({ role: "member", team_id: null })
      .eq("id", id);

    if (error) {
      // console.error( error.message);
    } else {
      window.location.reload();
    }
  }

  const showTeamMembers = teamMembers.map((member, index) => (
    <div key={index} className="member">
      <div style={{ width: "30px", height: "30px", borderRadius: "100%" }}>
        <img
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "100%",
            border: "2px solid var(--secondary)",
          }}
          src={
            member?.avatar_url?.length > 0
              ? member?.avatar_url
              : `https://ui-avatars.com/api/?name=${
                  member?.full_name || "No Name"
                }&background=random&color=fff`
          }
          alt="avatar"
        />
      </div>
      <div
        style={{
          width: "100%",
          marginTop: "5px",
          fontSize: "12px",
          color: "var(--text-subtle)",
          textAlign: lango === "ع" ? "right" : "left",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <strong
          title={member.full_name ? member.full_name : lang.noName}
          className="title"
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textWrap: "nowrap",
          }}
        >
          {member.full_name ? member.full_name : lang.noName}
        </strong>
        <br />
        <p style={{ margin: "0" }}>{member.role}</p>
      </div>
      {profile.role === "admin" && member.id !== profile.id ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <span
            style={{
              width: "15px",
              height: "15px",
              cursor: "pointer",
              marginRight: "10px",
              display: "block",
              top: "10px",
              right: "4px",
              zIndex: "980",
            }}
          >
            <svg
              onClick={() => {
                setEditRole(member.id);
              }}
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                {"{"}" "{"}"}
                <path
                  fill="var(--primary)"
                  d="M29.663,482.25l.087.087a24.847,24.847,0,0,0,17.612,7.342,25.178,25.178,0,0,0,8.1-1.345l142.006-48.172,272.5-272.5A88.832,88.832,0,0,0,344.334,42.039l-272.5,272.5L23.666,456.541A24.844,24.844,0,0,0,29.663,482.25Zm337.3-417.584a56.832,56.832,0,0,1,80.371,80.373L411.5,180.873,331.127,100.5ZM99.744,331.884,308.5,123.127,388.873,203.5,180.116,412.256,58.482,453.518Z"
                  className="ci-primary"
                />
                {"{"}" "{"}"}
              </g>
            </svg>
          </span>
          <span
            style={{
              width: "15px",
              height: "15px",
              cursor: "pointer",
              marginRight: "10px",
              top: "10px",
              right: "4px",
              zIndex: "980",
              display: "block",
            }}
          >
            <svg
              onClick={() => {
                deleteMem(member.id);
              }}
              fill="#ff0000"
              height="15px"
              width="15px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 60.167 60.167"
              xmlSpace="preserve"
              stroke="#ff0000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                {"{"}" "{"}"}
                <path d="M54.5,11.667H39.88V3.91c0-2.156-1.754-3.91-3.91-3.91H24.196c-2.156,0-3.91,1.754-3.91,3.91v7.756H5.667 c-0.552,0-1,0.448-1,1s0.448,1,1,1h2.042v40.5c0,3.309,2.691,6,6,6h32.75c3.309,0,6-2.691,6-6v-40.5H54.5c0.552,0,1-0.448,1-1 S55.052,11.667,54.5,11.667z M22.286,3.91c0-1.053,0.857-1.91,1.91-1.91H35.97c1.053,0,1.91,0.857,1.91,1.91v7.756H22.286V3.91z M50.458,54.167c0,2.206-1.794,4-4,4h-32.75c-2.206,0-4-1.794-4-4v-40.5h40.75V54.167z M38.255,46.153V22.847c0-0.552,0.448-1,1-1 s1,0.448,1,1v23.306c0,0.552-0.448,1-1,1S38.255,46.706,38.255,46.153z M29.083,46.153V22.847c0-0.552,0.448-1,1-1s1,0.448,1,1 v23.306c0,0.552-0.448,1-1,1S29.083,46.706,29.083,46.153z M19.911,46.153V22.847c0-0.552,0.448-1,1-1s1,0.448,1,1v23.306 c0,0.552-0.448,1-1,1S19.911,46.706,19.911,46.153z" />
                {"{"}" "{"}"}
              </g>
            </svg>
          </span>
        </div>
      ) : (
        ""
      )}
    </div>
  ));

  const cardStyle = {
    background: "var(--card-bg)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
    width: "100%",
    maxWidth: "400px",
    marginBottom: "20px",
    textAlign: "center",
    position: "relative",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    textTransform: "capitalize",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",
    color: "var(--text-main)",
  };

  const detailStyle = {
    fontSize: "14px",
    color: "var(--text-subtle)",
    marginBottom: "10px",
  };

  return (
    <>
      {editRole !== "" && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            padding: "20px",
            backgroundColor: "#151617ad",
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            position: "fixed",
            top: "0",
            left: "0",
            zIndex: "990",
            display: "flex",
          }}
        >
          <div className="signup container">
            <div
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                width: "25px",
                zIndex: "1300",
              }}
              onClick={() => {
                setEditRole("");
              }}
              id="close-form"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="var(--text-main)"
                x="0px"
                y="0px"
                width={25}
                height={25}
                viewBox="0 0 50 50"
              >
                <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z" />
              </svg>
            </div>
            <form
              className="card-bg"
              onSubmit={(e) => {
                e.preventDefault();
              }}
              style={{
                marginTop: "100px",
                flexDirection: "column",
                display: "flex",
              }}
            >
              <label>{lang.role}:</label>
              <select
                style={{ width: "100%" }}
                name="role"
                id="role"
                defaultValue="member"
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">{lang.admin}</option>
                <option value="member">{lang.member}</option>
              </select>
              <button
                type="submit"
                className="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSubmitRole(true);
                }}
              >
                {lang.editRole}
              </button>
            </form>
          </div>
        </div>
      )}
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 20px",
          position: "relative",
        }}
      >
        <div style={cardStyle}>
          <div style={titleStyle}>
            {lang.profile}
            <span
              style={{
                width: "20px",
                height: "20px",
                cursor: "pointer",
                marginRight: "10px",
                position: "absolute",
                top: "10px",
                right: "4px",
                zIndex: "980",
              }}
            >
              <svg
                onClick={() => {
                  nav("/profile/edit/profile");
                }}
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  {"{"}" "{"}"}
                  <path
                    fill="var(--primary)"
                    d="M29.663,482.25l.087.087a24.847,24.847,0,0,0,17.612,7.342,25.178,25.178,0,0,0,8.1-1.345l142.006-48.172,272.5-272.5A88.832,88.832,0,0,0,344.334,42.039l-272.5,272.5L23.666,456.541A24.844,24.844,0,0,0,29.663,482.25Zm337.3-417.584a56.832,56.832,0,0,1,80.371,80.373L411.5,180.873,331.127,100.5ZM99.744,331.884,308.5,123.127,388.873,203.5,180.116,412.256,58.482,453.518Z"
                    className="ci-primary"
                  />
                  {"{"}" "{"}"}
                </g>
              </svg>
            </span>
          </div>
          {
            <img
              style={{
                borderRadius: "100%",
                border: "3px solid var(--secondary)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                width: "120px",
                height: "120px",
              }}
              src={
                profile?.avatar_url?.length > 0
                  ? profile?.avatar_url
                  : "https://ui-avatars.com/api/?name=" +
                    (!profile?.full_name ? "No Name" : profile?.full_name) +
                    "&background=random&color=fff"
              }
              alt="Profile Avatar"
            />
          }

          <h2
            title={profile?.full_name || lang.noName}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              marginTop: "12px",
              fontWeight: "600",
            }}
          >
            {profile?.full_name || lang.noName}
          </h2>
        </div>

        <div style={cardStyle}>
          <span
            style={{
              width: "20px",
              height: "20px",
              cursor: "pointer",
              marginRight: "10px",
              position: "absolute",
              top: "10px",
              right: "4px",
              zIndex: "980",
            }}
          >
            <svg
              onClick={() => {
                nav("/profile/edit/team");
              }}
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth={0} />
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g id="SVGRepo_iconCarrier">
                {"{"}" "{"}"}
                <path
                  fill="var(--primary)"
                  d="M29.663,482.25l.087.087a24.847,24.847,0,0,0,17.612,7.342,25.178,25.178,0,0,0,8.1-1.345l142.006-48.172,272.5-272.5A88.832,88.832,0,0,0,344.334,42.039l-272.5,272.5L23.666,456.541A24.844,24.844,0,0,0,29.663,482.25Zm337.3-417.584a56.832,56.832,0,0,1,80.371,80.373L411.5,180.873,331.127,100.5ZM99.744,331.884,308.5,123.127,388.873,203.5,180.116,412.256,58.482,453.518Z"
                  className="ci-primary"
                />
                {"{"}" "{"}"}
              </g>
            </svg>
          </span>
          <div style={titleStyle}>{lang.team}</div>

          <p style={detailStyle} title={team_title || lang.noTeam}>
            <strong>{lang.teamTitle}:</strong> <br />
            {team_title || lang.noTeam}
          </p>
          <p style={detailStyle}>
            <strong>{lang.teamId}:</strong> <br />
            {teamid || "—"}
          </p>
          <p style={detailStyle}>
            <strong>{lang.teamRole}:</strong> <br />
            {profile?.role || lang.noRole}
          </p>
          <p style={detailStyle}>
            <strong>{lang.teamMembers}:</strong> <br />
          </p>
          <div
            style={{
              width: "100%",

              fontSize: "14px",
              color: "var(--text-subtle)",
              marginBottom: "10px",
              flexWrap: "wrap",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {showTeamMembers}
          </div>
        </div>
      </div>
    </>
  );
}
