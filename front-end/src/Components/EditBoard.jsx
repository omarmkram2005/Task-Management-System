import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import { langChanger } from "../Context/CreateContexts";
import { useNavigate } from "react-router-dom";

export default function EditBoard({ board, onClose }) {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: board.title,
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
      .from("boards")
      .update([
        {
          title: form.title,
        },
      ])
      .eq("id", board.id);

    if (!error) {
      onClose();
    } else {
      // console.error( error);
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
    const { error: tasksError } = await supabase
      .from("tasks")
      .delete()
      .eq("board_id", board.id);

    const { error: boardsError } = await supabase
      .from("boards")
      .delete()
      .eq("id", board.id);

    if (!tasksError && !boardsError) {
      nav("/");
    } else {
      // console.error(
      //   tasksError || boardsError
      // );
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
          {lang.editBoard}
        </h2>
        <input
          className="addInputs"
          onChange={(e) => {
            handleChangeSubmit(e);
          }}
          name="title"
          type="text"
          placeholder={lang.title}
          value={form.title}
        />
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
            {submit ? lang.editing : lang.editBoard}
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
