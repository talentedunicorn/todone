import React, { useState } from "react";
import "./form.css";

const Form = ({ handleFormSubmit, todoToEdit }) => {
  const [text, setText] = useState("");
  const handleSubmit = e => {
    e.preventDefault();

    // Todo is atleast 3 characters long
    if (text.trim().length < 3) {
      return false;
    }

    handleFormSubmit({
      text,
      completed: false
    });

    setText("");
  };

  return (
    <form data-testid="form" onSubmit={handleSubmit} className="Form">
      <input
        data-testid="form-input"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button>Add task</button>
    </form>
  );
};

export default Form;
