
import TodoDisplay from "./TodoDisplay";


import PropTypes from 'prop-types';


const TodoList = ({ todoList, dispatch, }) => {
  return todoList ? (
    <>
      {todoList?.map((todo) => {

        return (
          <TodoDisplay
            key={todo._id}
            dispatch={dispatch}
            todo={todo}
            todoList={todoList}
          />
        );
      })}
    </>
  ) : <p>Loading</p>;
};

TodoList.propTypes = {
  todoList: PropTypes.arrayOf(PropTypes.object),
  dispatch: PropTypes.func.isRequired,
};

export default TodoList;
