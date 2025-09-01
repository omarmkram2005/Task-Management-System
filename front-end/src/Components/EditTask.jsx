import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { langChanger } from "../Context/CreateContexts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from "date-fns/locale";
export default function EditTask({ task, onClose }) {
  const [startDate, setStartDate] = useState(new Date());
  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    board_id: task.board_id,
    status: task.status,
    due_date: task.due_date,
  });

  const [submit, setSubmit] = useState(false);
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
    const { data, error } = await supabase
      .from("tasks")
      .update([
        {
          title: form.title,
          description: form.description,
          board_id: form.board_id,
          status: form.status,
          due_date: startDate,
        },
      ])
      .eq("id", task.id);

    if (!error) {
      onClose();
    }
    setSubmit(false);
  }
  function handleChangeSubmit(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  async function handleDelete(e) {
    e.preventDefault();
    if (submit) {
      return;
    }
    setSubmit(true);
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", task.id);

    if (!error) {
      onClose();
    }
    setSubmit(false);
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
        zIndex: "12",
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
          {lang.editTask}
        </h2>
        <input
          className="addInputs"
          onChange={(e) => {
            handleChangeSubmit(e);
          }}
          name="title"
          type="text"
          value={form.title}
          placeholder={lang.title}
        />
        <input
          className="addInputs"
          onChange={(e) => {
            handleChangeSubmit(e);
          }}
          name="description"
          value={form.description}
          type="text"
          placeholder={lang.description}
        />
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          dateFormat="yyyy-MM-dd h:mm aa"
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <button
            className="button"
            style={{ marginTop: "10px" }}
            onClick={(e) => SubmitData(e)}
            disabled={submit || form.title === ""}
          >
            {submit ? lang.editing : lang.editTask}
          </button>
          <button
            className="button"
            style={{ marginTop: "10px", backgroundColor: "var(--error)" }}
            onClick={(e) => handleDelete(e)}
          >
            {submit ? lang.deleting : lang.delete}
          </button>
        </div>
      </form>
    </div>
  );
}
