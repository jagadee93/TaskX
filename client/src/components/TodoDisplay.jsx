import { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { MdDeleteSweep, MdOutlineDone } from "react-icons/md";
import { TODO_ACTIONS } from "../constants/variables";
import { toast } from "react-toastify"
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const TodoDisplay = ({ dispatch, todo }) => {
  const axiosPrivate = useAxiosPrivate();
  const [editMode, setEditMode] = useState(false);
  const [textContent, setTextContent] = useState(todo.description);

  const navigate = useNavigate();
  const location = useLocation();

  const handleDone = async (_id) => {
    const controller = new AbortController();
    try {
      const payload = { taskId: _id, completed: !todo.completed }
      const response = await axiosPrivate.post("/update", JSON.stringify(payload), { signal: controller.signal })

      if (response.status === 200) {
        toast.success(response.data.message);
        dispatch({ type: TODO_ACTIONS.TOGGLE_TODO, payload: { _id } });
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      toast.error(err)
      navigate('/login', { state: { from: location }, replace: true });
    }
  };

  const handleDelete = async (_id) => {
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.delete(`/delete/${_id}`, { signal: controller.signal })

      if (response.status === 200) {
        toast.success(response.data.message)
      }
      dispatch({ type: TODO_ACTIONS.DEL_TODO, payload: { _id } });
    } catch (err) {
      toast.error(err)
      navigate('/login', { state: { from: location }, replace: true });
    }
  };

  const HandleEdit = () => {
    !todo.completed && setEditMode(!editMode);
    if (todo.completed) {
      toast.error("You cant edit a completed Task")
    }
  };

  const handleSubmit = async (e, _id) => {
    e.preventDefault();
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post("/update", { taskId: _id, description: textContent }, { signal: controller.signal });

      if (response.status === 200) {
        toast.success(response.data.message)
      }
      else {
        toast.error(response.data.message)
      }
      dispatch({ type: TODO_ACTIONS.EDIT_TODO, payload: { _id, textContent } });
      setEditMode(!editMode);
    } catch (err) {
      toast.error(err)
      navigate('/login', { state: { from: location }, replace: true });
    }
  };

  return (

    <form className="todo-single" onSubmit={(e) => handleSubmit(e, todo._id)}>
      {editMode ? (
        <input
          maxLength={25}
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
        />
      ) : (
        <span className={`todo - single__text ${todo.completed ? "strike" : ""}`}>
          {todo.description}
        </span>
      )}

      <div className="todo-single__icons">
        <span className="icon" onClick={() => HandleEdit()}>
          <BiSolidEdit />
        </span>
        <span className="icon" onClick={() => handleDelete(todo._id)}>
          <MdDeleteSweep />
        </span>
        <span className="icon" onClick={() => handleDone(todo._id)}>
          <MdOutlineDone />
        </span>
      </div>
    </form>
  );
};

export default TodoDisplay;
