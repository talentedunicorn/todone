import React, { useState } from "react";
import "./list.css";

const List = ({ items, handleItemClick, handleDelete, setTodos, todos }) => {
  const [todoToEdit, setTodoToEdit] = useState(null);

  const handleEdit = item => {
    setTodoToEdit(item);
  };

  const editTodo = e => {
    e.preventDefault();
    if (todoToEdit.text.trim().length < 3) {
      return false;
    }

    const newTodos = todos.map(todo =>
      todo.id === todoToEdit.id ? todoToEdit : todo
    );
    setTodos(newTodos);
    setTodoToEdit(null);
  };

  return (
    <ol
      data-testid="List"
      className="List"
      data-empty-message="No items added..."
    >
      {items &&
        items.map(item => {
          return (
            <li key={item.id}>
              {todoToEdit && item.id === todoToEdit.id ? (
                <form className="EditForm">
                  <input
                    type="text"
                    value={todoToEdit.text}
                    onChange={e =>
                      setTodoToEdit({ ...todoToEdit, text: e.target.value })
                    }
                  />
                  <button onClick={editTodo}>Save Task</button>
                  <button
                    className="cancel"
                    onClick={() => setTodoToEdit(null)}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <p
                    title={item.text}
                    onClick={() => handleItemClick(item.id)}
                    data-completed={item.completed ? true : undefined}
                  >
                    {item.text}
                  </p>
                  {todos && (
                    <button
                      onClick={() => handleEdit(item)}
                      className="Button-icon edit"
                    >
                      Edit
                    </button>
                  )}
                  {handleDelete && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="Button-icon delete"
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
            </li>
          );
        })}
    </ol>
  );
};

export default List;
