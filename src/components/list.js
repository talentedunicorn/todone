import React, { useContext, useState } from "react";
import "./list.css";
import { TodoContext } from "../context/todoContext";

const List = ({ items }) => {
  const { toggleTodo, deleteTodo, editTodo } = useContext(TodoContext);
  const [selectedTodo, setSelected] = useState(null);

  const handleEdit = e =>
    setSelected({ ...selectedTodo, text: e.target.value });
  const canDelete = item => {
    if (selectedTodo) {
      return selectedTodo.id !== item.id && !item.completed;
    }

    return true;
  };
  const handleSave = e => {
    e.preventDefault();
    editTodo(selectedTodo.id, selectedTodo.text);
    setSelected(null);
  };
  return (
    <ol data-testid="List" className="List" data-empty-message="All done...">
      {items &&
        items
          .sort((a, b) => b.id - a.id)
          .map(item => (
            <li key={item.id}>
              <input
                type="checkbox"
                defaultChecked={item.completed}
                onClick={() => toggleTodo(item.id)}
              />
              {selectedTodo && selectedTodo.id === item.id ? (
                <form onSubmit={handleSave}>
                  <input
                    type="text"
                    value={selectedTodo.text}
                    onChange={handleEdit}
                  />
                  <button className="Button-icon save">Save</button>
                  <button
                    className="Button-icon cancel"
                    onClick={_ => setSelected()}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <p
                  title={item.text}
                  data-completed={item.completed ? true : undefined}
                  onClick={() => setSelected(item)}
                >
                  {item.text}
                </p>
              )}
              {canDelete(item) && (
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
