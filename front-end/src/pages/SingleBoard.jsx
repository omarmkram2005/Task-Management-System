import { useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../Css/home.css";
import "../Css/tasks.css";
import MakeTask from "../Components/MakeTask";
import AddTasks from "../Components/AddTask";
import { langChanger, sessionSaver } from "../Context/CreateContexts";
import EditBoard from "../Components/EditBoard";

export default function SingleBoard() {
  const [board, setBoard] = useState([]);
  const [tasks, setTasks] = useState(["no data yet"]);
  const [toDo, setToDo] = useState([]);
  const [onGoing, setOnGoing] = useState([]);
  const [done, setDone] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addbutton, setAddbutton] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(false);
  const [editBoard, setEditBoard] = useState(false);
  const { profile } = useContext(sessionSaver);

  const nav = useNavigate();
  const [lang, setLang] = useState({});
  const { lang: lango, text } = useContext(langChanger);
  useEffect(() => {
    setLang(text);
  }, [text]);

  const { id } = useParams();
  useEffect(() => {
    if (!id) {
      return;
    }
    async function getdata() {
      const { data: boardData, error: boardError } = await supabase
        .from("boards")
        .select("*")
        .eq("id", id);

      if (boardError) {
        console.error("خطأ في الإضافة:", boardError);
        nav("/404");
      } else if (boardData.length === 0) {
        nav("/404");
      } else {
        setBoard(boardData);
        document.title = boardData[0].title;

        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .eq("board_id", id);

        if (tasksError) {
          console.error("خطأ في الإضافة:", tasksError);
        } else {
          setTasks(tasksData);
        }
      }
    }
    getdata();
  }, [id, refresh]);
  const baseColor = getComputedStyle(document.documentElement).getPropertyValue(
    "--baseColor"
  );
  const highLightColor = getComputedStyle(
    document.documentElement
  ).getPropertyValue("--highlightColor");

  useEffect(() => {
    if (tasks.length > 0) {
      const newToDoTasks = tasks.filter((task) => task.status === "to do");
      const newOnGoingTasks = tasks.filter(
        (task) => task.status === "on going"
      );
      const newDoneTasks = tasks.filter((task) => task.status === "done");

      setToDo(newToDoTasks);
      setOnGoing(newOnGoingTasks);
      setDone(newDoneTasks);
    }
  }, [tasks]);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      const columnStatus = source.droppableId;
      let newTasksArray;

      if (columnStatus === "to do") newTasksArray = [...toDo];
      else if (columnStatus === "on going") newTasksArray = [...onGoing];
      else newTasksArray = [...done];

      const [reorderedItem] = newTasksArray.splice(source.index, 1);

      newTasksArray.splice(destination.index, 0, reorderedItem);

      if (columnStatus === "to do") setToDo(newTasksArray);
      else if (columnStatus === "on going") setOnGoing(newTasksArray);
      else setDone(newTasksArray);

      return;
    }

    const updatedTasks = tasks.map((task) =>
      task.id === draggableId
        ? { ...task, status: destination.droppableId }
        : task
    );

    setTasks(updatedTasks);
    updateTaskStatus(draggableId, destination.droppableId);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task status:", error);
    }
  };

  function handelCloseForms() {
    setAddbutton(false);
    setEditBoard(false);
    setEditingTaskId(false);
    setRefresh((prev) => !prev);
  }
  const handleEditTaskClick = (taskId) => {
    setEditingTaskId(taskId);
  };
  const handleEditBoardClick = () => {
    setEditBoard(true);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {editBoard && <EditBoard board={board[0]} onClose={handelCloseForms} />}
      <div
        className="container"
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {addbutton ? (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              width: "25px",
              zIndex: "1300",
            }}
            onClick={() => {
              handelCloseForms();
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
        ) : editBoard ? (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              width: "25px",
              zIndex: "1300",
            }}
            onClick={() => {
              handelCloseForms();
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
        ) : (
          editingTaskId && (
            <div
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                width: "25px",
                zIndex: "1300",
              }}
              onClick={() => {
                handelCloseForms();
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
          )
        )}
        {addbutton && (
          <AddTasks
            board_id={board.id}
            setAddbutton={setAddbutton}
            setRefresh={setRefresh}
          />
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          className="sml-btn"
        >
          {board[0] ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
              }}
              className="sml"
            >
              <h1
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {board[0].title}
              </h1>
              {(profile.role === "admin" ||
                profile.id === board[0].user_id) && (
                <span
                  style={{ width: "35px", height: "35px", cursor: "pointer" }}
                >
                  <svg
                    onClick={() => {
                      handleEditBoardClick(board.id);
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
              )}
            </div>
          ) : (
            <SkeletonTheme
              baseColor={baseColor}
              highlightColor={highLightColor}
            >
              <Skeleton width={"190px"} height={"50px"} />
            </SkeletonTheme>
          )}

          <button
            className="button"
            style={{ margin: "40px 0" }}
            onClick={() => setAddbutton(true)}
          >
            {lang.addTask}
          </button>
        </div>

        <div className="grid-container">
          {["to do", "on going", "done"].map((columnName) => {
            let columnTasks = [];
            if (columnName === "to do") columnTasks = toDo;
            else if (columnName === "on going") columnTasks = onGoing;
            else if (columnName === "done") columnTasks = done;

            return (
              <Droppable key={columnName} droppableId={columnName}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid-column"
                  >
                    <h2
                      style={{ textAlign: lango === "eng" ? "left" : "right" }}
                    >
                      {columnName === "to do"
                        ? lang.todo
                        : columnName === "on going"
                        ? lang.ongoing
                        : lang.done}
                    </h2>
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                        isDragDisabled={
                          !(
                            profile.id === task.user_id ||
                            profile.role === "admin"
                          )
                        }
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              boxShadow: snapshot.isDragging
                                ? " rgba(146, 146, 255, 0.87) 0px 0px 10px 0px"
                                : "none",

                              border: snapshot.isDragging
                                ? " 1px solid rgb(172, 172, 255)"
                                : "none",
                              marginBottom: snapshot.isDragging
                                ? "none"
                                : "none",
                              height: snapshot.isDragging && "fit-content",
                              borderRadius: snapshot.isDragging && "15px",
                            }}
                          >
                            {
                              <MakeTask
                                task={task}
                                onEditClick={handleEditTaskClick}
                                isEditing={editingTaskId == task.id}
                                onClose={handelCloseForms}
                              />
                            }
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {toDo.length === 0 &&
                    columnName == "to do" &&
                    tasks[0] !== "no data yet" ? (
                      <p
                        style={{
                          margin: "0",
                          backgroundColor: "var(--task-bg)",
                          padding: "5px ",
                          borderRadius: "10px",
                          textAlign: lango === "eng" ? "left" : "right",
                        }}
                      >
                        {lang.noToDos}
                      </p>
                    ) : onGoing.length === 0 &&
                      columnName == "on going" &&
                      tasks[0] !== "no data yet" ? (
                      <p
                        style={{
                          margin: "0",
                          backgroundColor: "var(--task-bg)",
                          padding: "5px ",
                          borderRadius: "10px",
                          textAlign: lango === "eng" ? "left" : "right",
                        }}
                      >
                        {lang.noOnGoing}
                      </p>
                    ) : done.length === 0 &&
                      columnName == "done" &&
                      tasks[0] !== "no data yet" ? (
                      <p
                        style={{
                          margin: "0",
                          backgroundColor: "var(--task-bg)",
                          padding: "5px ",
                          borderRadius: "10px",
                          textAlign: lango === "eng" ? "left" : "right",
                        }}
                      >
                        {lang.noDone}
                      </p>
                    ) : (
                      ""
                    )}
                    {tasks[0] === "no data yet" ? (
                      <SkeletonTheme
                        baseColor={baseColor}
                        highlightColor={highLightColor}
                      >
                        <Skeleton height={"135px"} />
                      </SkeletonTheme>
                    ) : (
                      ""
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}
