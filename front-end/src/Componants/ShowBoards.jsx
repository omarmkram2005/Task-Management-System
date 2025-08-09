import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { langChanger, sessionSaver } from "../Context/CreateContexts";
import MakeBoard from "./MakeBoard";
import AddBoard from "../Componants/AddBoard";

export default function ShowBoards() {
  const [boards, setBoards] = useState(["no data yet"]);
  const [addbutton, setAddbutton] = useState();

  const [lang, setLang] = useState({});
  const session = useContext(sessionSaver);
  const { text } = useContext(langChanger);
  useEffect(() => {
    setLang(text);
  }, [text]);
  const nav = useNavigate();

  useEffect(() => {
    async function getdata(e) {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("user_id", session.session.user.id);

      if (data) {
        setBoards(data);
      }
    }
    getdata();
  }, [addbutton]);

  const baseColor = getComputedStyle(document.documentElement).getPropertyValue(
    "--baseColor"
  );
  const highLightColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--highlightColor");
  const showBoards = boards.map((board, ind) => (
    <MakeBoard key={ind} board={board} />
  ));
  return (
    <div>
      {addbutton && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            width: "25px",
            zIndex: "10000",
            cursor: "pointer",
          }}
          onClick={() => setAddbutton(false)}
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
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ fontSize: "40px" }}>{lang.boards}</h1>
        <button className="button" onClick={() => setAddbutton(true)}>
          {lang.addBoard}
        </button>
      </div>
      {addbutton && <AddBoard setAddbutton={setAddbutton} />}
      <div className="boardsContainer sml-justi">
        {showBoards.length === 0 && boards[0] === undefined && (
          <h2
            style={{
              width: "100%",
              textAlign: "center",
              color: "var(--text-subtle)",
            }}
          >
            {lang.noBoards}
          </h2>
        )}
        {console.log(showBoards.length === 0 && boards[0] === "no data yet")}
        {boards[0] === "no data yet" ? (
          <SkeletonTheme baseColor={baseColor} highlightColor={highLightColor}>
            <Skeleton width={"220px"} height={"230px"} />
            <Skeleton width={"220px"} height={"230px"} />
            <Skeleton width={"220px"} height={"230px"} />
            <Skeleton width={"220px"} height={"230px"} />
            <Skeleton width={"220px"} height={"230px"} />
          </SkeletonTheme>
        ) : (
          showBoards
        )}
      </div>
    </div>
  );
}
