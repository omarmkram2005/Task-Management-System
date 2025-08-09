import { useContext, useEffect, useState } from "react";
import { langChanger } from "../Context/CreateContexts";
import { useNavigate } from "react-router-dom";
import "../Css/tasks.css";
import EditBoard from "./EditBoard";
export default function MakeBoard({ board, onEditClick, isEditing, onClose }) {
  const [time, setTime] = useState("");
  const [timeStatus, setTimeStatus] = useState("past");
  const nav = useNavigate();

  const [lang, setLang] = useState({});
  const { text } = useContext(langChanger);
  useEffect(() => {
    setLang(text);
  }, [text]);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  useEffect(() => {
    const dateObjict = new Date(`${board.closest_due_date}z`);
    function checkDate() {
      const today = new Date();
      const differenceInMS = dateObjict.getTime() - today.getTime();
      const oneDayInMS = 24 * 60 * 60 * 1000;
      if (isNaN(differenceInMS)) {
        setTime("Invalid Date");
        setTimeStatus("Invalid Date");
        return;
      }
      if (differenceInMS > 0) {
        if (differenceInMS < oneDayInMS) {
          const hours = Math.floor(differenceInMS / (1000 * 60 * 60));
          const minutes = Math.floor(
            (differenceInMS % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((differenceInMS % (1000 * 60)) / 1000);
          setTime({ hours: hours, minutes: minutes, seconds: seconds });
          setTimeStatus("future-soon");
        } else {
          setTime(dateObjict);
          setTimeStatus("future");
        }
      } else {
        setTime(dateObjict);

        setTimeStatus("past");
      }
    }
    const interval = setInterval(checkDate, 1000);

    return () => clearInterval(interval);
  }, [board.closest_due_date]);

  return (
    <div className="board" onClick={() => nav(`/boards/${board.id}`)}>
      <h2 className="title">{board.title}</h2>
      <div className="tasksCounter">
        <div className="tasks">
          <span>{lang.todo}</span> <span>{board.todo_count}</span>
        </div>
        <div className="tasks">
          <span>{lang.ongoing}</span> <span>{board.ongoing_count}</span>
        </div>
        <div className="tasks">
          <span>{lang.done}</span> <span>{board.done_count}</span>
        </div>
      </div>

      <span
        className="task-due-date"
        style={{
          margin: "15px 0",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
        dir="ltr"
      >
        <span style={{ display: "block" }}>{lang.nextDead}</span>

        {timeStatus === "future" ? (
          <span style={{ display: "block" }}>
            {" "}
            {time.toLocaleString("en-gb", options)}{" "}
          </span>
        ) : timeStatus === "past" ? (
          <span style={{ color: "red" }}>
            {time.toLocaleString("en-gb", options)}{" "}
          </span>
        ) : timeStatus === "future-soon" ? (
          <span style={{ color: "yellow" }}>
            {" "}
            {(String(time.hours).length == 1 ? "0" : "") +
              time.hours +
              " : " +
              (String(time.minutes).length == 1 ? "0" : "") +
              time.minutes +
              " : " +
              (String(time.seconds).length == 1 ? "0" : "") +
              time.seconds}
          </span>
        ) : (
          timeStatus === "Invalid Date" && (
            <span style={{ color: "var(--text-subtle)" }}>{lang.invDate}</span>
          )
        )}
      </span>
    </div>
  );
}
