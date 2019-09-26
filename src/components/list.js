import React from "react";
import "./list.css";

const List = ({ items, handleItemClick, handleDelete }) => {
  if (!items || items.length === 0) {
    return <p data-testid="EmptyMessage">No items found...</p>;
  }

  return (
    <ol data-testid="List" className="List">
      {items.map(item => (
        <li key={item.id}>
          <p
            title={item.text}
            onClick={() => handleItemClick(item.id)}
            data-completed={item.completed ? true : undefined}
          >
            {item.text}
          </p>
          <button
            onClick={() => handleDelete(item.id)}
            className="Button-icon delete"
          >
            Delete
          </button>
        </li>
      ))}
    </ol>
  );
};

export default List;
