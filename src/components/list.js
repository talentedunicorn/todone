import React from "react";

const List = ({ items, handleItemClick, handleDelete }) => {
  if (!items || items.length === 0) {
    return <p data-testid="EmptyMessage">No items found...</p>;
  }

  return (
    <ol data-testid="List">
      {items.map(item => (
        <li key={item.id}>
          <p
            onClick={() => handleItemClick(item.id)}
            data-completed={item.completed ? true : undefined}
          >
            {item.text}
          </p>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </li>
      ))}
    </ol>
  );
};

export default List;
