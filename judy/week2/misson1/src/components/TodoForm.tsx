import { useState, type FormEvent } from "react";
import { useTodo } from "../context/TodoContext";

const TodoForm = (): React.ReactElement => {
    const [input, setInput] = useState<string>('');
    const { addTodo } = useTodo();
        
    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const text = input.trim(); // 공백 제거
        
        if (text) {
            addTodo(text);
            setInput('');
        }
    };

    return(
        <form onSubmit={handleSubmit} className="todo-container__form">
            <input 
                type="text" 
                value={input} 
                onChange={(e) : void => setInput(e.target.value)} 
                className="todo-container__input" 
                placeholder="입력" 
                required
            />
            <button 
                type="submit" 
                className="todo-container__button"
            >할 일 추가</button>
        </form>
    )
}
export default TodoForm;