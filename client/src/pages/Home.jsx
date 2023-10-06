import { useEffect, useReducer, useState } from "react";
import InputField from "../components/InputField";

import TodoList from "../components/TodoList";
import { TODO_ACTIONS } from "../constants/variables";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { toast } from "react-toastify";

import { useNavigate, useLocation } from "react-router-dom";

function reducer(state, action) {
    switch (action.type) {
        case TODO_ACTIONS.FETCH_START:
            return {
                ...state,
                loading: true,
            }

        case TODO_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                todoList: [...action.payload.data]
            }

        case TODO_ACTIONS.FETCH_ERROR:
            return {
                ...state,
                loading: false,
                error: true
            }

        case TODO_ACTIONS.ADD_TODO:

            return {
                ...state,
                todoList: [...state.todoList, action.payload.todo]
            }

        case TODO_ACTIONS.DEL_TODO:
            return {
                ...state,
                todoList: state.todoList.filter((todoItem) => {
                    return todoItem._id !== action.payload._id;
                })
            }
        case TODO_ACTIONS.EDIT_TODO:
            return {
                ...state,
                todoList: state.todoList.map((todoItem) => {
                    return todoItem._id === action.payload._id
                        ? { ...todoItem, description: action.payload.textContent }
                        : todoItem;
                })
            }


        case TODO_ACTIONS.TOGGLE_TODO:

            return {
                ...state,
                todoList: state.todoList.map((todoItem) => {
                    return todoItem._id === action.payload._id
                        ? { ...todoItem, completed: !todoItem.completed }
                        : todoItem;
                })
            }

        default:
            return {
                ...state
            };
    }
}



const initialState = {
    loading: false,
    todoList: [],
    error: null,
}

const Home = () => {
    const [todo, setTodo] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const [state, dispatch] = useReducer(reducer, initialState);
    const navigate = useNavigate();
    const location = useLocation();
    const { todoList, loading, error } = state;
    function onSubmitHandler(e) {

        e.preventDefault();
        if (todo) {

            let isMounted = true;
            const controller = new AbortController();

            (async () => {
                try {
                    const response = await axiosPrivate.post("/new", JSON.stringify({ task: { _id: Date.now(), description: todo, completed: false } }), { signal: controller.signal });
                    if (response.status === 201) toast.success("Created a new todo In Db")
                    dispatch({ type: TODO_ACTIONS.ADD_TODO, payload: { todo: response?.data?.task } });
                } catch (e) {

                    toast.error(e.message)
                    navigate('/login', { state: { from: location }, replace: true });
                }
            })();
        }
        return;
    }



    useEffect(() => {
        dispatch({ type: TODO_ACTIONS.FETCH_START })
        let isMounted = true;
        const controller = new AbortController();
        try {
            (async () => {
                const response = await axiosPrivate.get("/lists", { signal: controller.signal });

                dispatch({ type: TODO_ACTIONS.FETCH_SUCCESS, payload: { data: response?.data } })
                if (response.status === 200) {
                    toast.success("Fetched All tasks from Db")
                }
            })();

        } catch (e) {

            toast.error(e.message)
            dispatch({ type: TODO_ACTIONS.FETCH_ERROR })
            navigate('/login', { state: { from: location }, replace: true });
        }

        return () => {
            isMounted = false;
            controller.abort()
        };

    }, [])



    return (
        <div className="main container" >
            {loading ? (
                <p>loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <div>
                    <h1 className="center font-3 mtb-2">{"Make things Happen"}</h1>
                    <InputField
                        todo={todo}
                        setTodo={setTodo}
                        onSubmitHandler={onSubmitHandler}
                    />

                    <div className="todo-list">
                        <TodoList todoList={todoList} axiosPrivate={axiosPrivate} dispatch={dispatch} />
                    </div>
                </div>
            )
            }


        </div>
    );
};

export default Home;
