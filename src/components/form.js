import React from "react";

const Form = ({ addTodo }) => {
  const handleSubmit = e => {
    e.preventDefault();
    addTodo({
      text: "New todo",
      completed: false
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input />
      <button>Add</button>
    </form>
  );
};

export default Form;
