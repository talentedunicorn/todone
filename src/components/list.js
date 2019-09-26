import React from "react";
import "./list.css";

const List = ({ items, handleItemClick, handleDelete }) => (
  <ol
    data-testid="List"
    className="List"
    data-empty-message="No items added..."
  >
    {items &&
      items.map(item => (
        <li key={item.id}>
          <p
            title={item.text}
            onClick={() => handleItemClick(item.id)}
            data-completed={item.completed ? true : undefined}
          >
            {item.text}
          </p>
          {handleDelete && (
            <button
              onClick={() => handleDelete(item.id)}
              className="Button-icon delete"
            >
              Delete
            </button>
          )}
        </li>
      ))}
  </ol>
);

export default List;
