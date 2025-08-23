import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useParams } from "react-router-dom";
import { langChanger } from "../Context/CreateContexts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale";
export default function AddTasks({ setAddbutton, setRefresh, board_id }) {
  const [startDate, setStartDate] = useState(new Date());
  const [submit, setSubmit] = useState(false);
  const { id } = useParams();

  const [form, setForm] = useState({
    title: "",
    description: "No Description",
    board_id: board_id,
    status: "to do",
    due_date: startDate,
  });
  const [lang, setLang] = useState({});
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
    const { data, error } = await supabase.from("tasks").insert([
      {
        title: form.title,
        description: form.description,
        board_id: id,
        status: form.status,
        due_date: startDate,
      },
    ]);

    if (!error) {
      setAddbutton(false);
      setRefresh((prev) => !prev);
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
        zIndex: "1200",
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
        {" "}
        <h2 style={{ margin: "10px 0", width: "100%", textAlign: "center" }}>
          {lang.addTask}
        </h2>
        <input
          className="addInputs"
          onChange={(e) => {
            handleChangeSubmit(e);
          }}
          name="title"
          type="text"
          placeholder={lang.title}
        />
        <input
          className="addInputs"
          onChange={(e) => {
            handleChangeSubmit(e);
          }}
          name="description"
          type="text"
          placeholder={lang.description}
        />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd h:mm aa"
          showTimeSelect
          value={null}
          locale={enUS}
          placeholderText="Select a date and time"
        />
        <select
          onChange={(e) => {
            handleChangeSubmit(e);
          }}
          name="status"
          id="status"
          className="addInputs"
          defaultValue={"to do"}
        >
          <option value="to do">{lang.todo}</option>
          <option value="on going">{lang.ongoing}</option>
          <option value="done">{lang.done}</option>
        </select>
        <button
          className="button"
          style={{ marginTop: "10px" }}
          onClick={(e) => SubmitData(e)}
          disabled={submit || form.title === ""}
        >
          {submit ? lang.adding : lang.addTask}
        </button>
      </form>
    </div>
  );
}
