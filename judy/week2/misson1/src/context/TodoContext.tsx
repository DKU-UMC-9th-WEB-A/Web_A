/* eslint-disable react-refresh/only-export-components */
import { createContext, type PropsWithChildren, useState, useContext } from "react";
import type { TTodo } from "../types/todo";

interface ITodoContext {
    todos: TTodo[];
    doneTodos: TTodo[];
    addTodo: (text: string) => void;
    completeTodo: (todo: TTodo) => void;
    deleteTodo: (todo: TTodo) => void;
}

const TodoContext = createContext<ITodoContext | undefined>(undefined);

export const TodoProvider = ({children}: PropsWithChildren) => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

    const addTodo = (text: string) => {
        const newTodo: TTodo = { id: Date.now(), text };
        setTodos((prevTodos): TTodo[] => [...prevTodos, newTodo]);
    };

    const completeTodo = (todo: TTodo) => {
        setTodos(prev => prev.filter(t => t.id !== todo.id));
        setDoneTodos((prevTodos): TTodo[] => [...prevTodos, todo]);
    };

    const deleteTodo = (todo: TTodo) => {
        setDoneTodos((prevDoneTodo) : TTodo[] => prevDoneTodo.filter((t) => t.id !== todo.id));
    };

    return (
        <TodoContext.Provider value={{
            todos,
            doneTodos,
            addTodo,
            completeTodo,
            deleteTodo
        }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => {
    const context = useContext(TodoContext);
    // 컨텍스트가 없는 경우
    if(!context) {
        throw new Error('useTodo를 사용하기 위해서는, 무조건 TodoProvider로 감싸야 합니다.');
    }

    // 컨텍스트가 있는 경우
    return context;
}

export default TodoContext;