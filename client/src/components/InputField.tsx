import React, { useRef } from "react";

const InputField = ({ todo, setTodo, onSubmitHandler }) => {
  const inputRef = useRef(null);
  return (
    <form
      className=""
      onSubmit={(e) => {
        onSubmitHandler(e);
        inputRef.current?.blur();
      }}
    >
      <div className="input">
        <input
          ref={inputRef}
          type="text"
          className="input__text"
          value={todo}
          placeholder="enter a task"
          maxLength={25}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button className="input__btn" value={"submit"}>
          GO
        </button>
      </div>
    </form>
  );
};

export default InputField;
