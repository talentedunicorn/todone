import React from "react";

const List = ({ items, handleItemClick, handleDelete }) =>
  Boolean(items.length) ? (
    <ol>
      {items.map(item => (
        <li key={item.id}>
          <p onClick={() => handleItemClick(item.id)}>{item.text}</p>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </li>
      ))}
    </ol>
  ) : (
    <p>No items added...</p>
  );

export default List;
