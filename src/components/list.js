import React, { useContext } from "react";
import "./list.css";
import { TodoContext } from "../context/todoContext";

const List = ({ items, handleEdit }) => {
  const { toggleTodo, deleteTodo } = useContext(TodoContext);
  return (
    <ol data-testid="List" className="List" data-empty-message="All done...">
      {items &&
        items.map(item => (
          <li key={item.id}>
            <input
              type="checkbox"
              defaultChecked={item.completed}
              onClick={() => toggleTodo(item.id)}
            />
            <p
              title={item.text}
              data-completed={item.completed ? true : undefined}
            >
              {item.text}
            </p>
            {!item.completed && (
              <button
                onClick={() => deleteTodo(item.id)}
                className="Button-icon delete"
              >
                Delete
              </button>
            )}
          </li>
        ))}
    </ol>
  );
};

export default List;
