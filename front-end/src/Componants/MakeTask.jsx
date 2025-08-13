import { useContext, useEffect, useState } from "react";
import EditTask from "./EditTask";
import { langChanger } from "../Context/CreateContexts";

export default function MakeTask({
  task,
  onEditClick,
  setRefresh,
  isEditing,
  onClose,
}) {
  const [time, setTime] = useState("");
  const [timeStatus, setTimeStatus] = useState("past");

  const [lang, setLang] = useState({});
  const { lang: lango, text } = useContext(langChanger);
  useEffect(() => {
    setLang(text);
  }, [text]);
  const dateObjict = new Date(`${task.due_date}z`);
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  useEffect(() => {
    function checkDate() {
      const today = new Date();
      const differenceInMS = dateObjict.getTime() - today.getTime();
      const oneDayInMS = 24 * 60 * 60 * 1000;

      // حالة المستقبل
      if (differenceInMS > 0) {
        if (differenceInMS < oneDayInMS) {
          // أقل من 24 ساعة
          const hours = Math.floor(differenceInMS / (1000 * 60 * 60));
          const minutes = Math.floor(
            (differenceInMS % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((differenceInMS % (1000 * 60)) / 1000); // هذا السطر الجديد

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
  }, [task.due_date]);

  return (
    <div
      className="task-card "
      style={{
        textAlign: lango === "ع" ? "right" : "left",
      }}
    >
      {isEditing && (
        <EditTask task={task} onClose={onClose} setRefresh={setRefresh} />
      )}
      <h4 className="task-title">{task.title}</h4>
      <p className="task-description">{task.description}</p>
      <div className="penContainer">
        <span className="pen">
          <svg
            onClick={() => {
              onEditClick(task.id);
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
      <span
        style={lango === "ع" ? { left: "15px" } : { right: "15px" }}
        className={`task-status ${
          task.status === "done"
            ? "done"
            : task.status === "to do"
            ? "to-do"
            : task.status === "on going"
            ? "on-going"
            : ""
        }`}
      ></span>
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
        <span style={{ display: "block" }}>{lang.deadLine}</span>

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
          ""
        )}
      </span>
    </div>
  );
}
