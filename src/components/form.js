import React, { useState } from "react";
import "./form.css";

const Form = ({ handleFormSubmit }) => {
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
      <textarea
        data-testid="form-input"
        className="Form-input"
        rows={1}
        value={text}
        placeholder="Start typing..."
        onChange={e => setText(e.target.value)}
      />
      <button className="Button">Add task</button>
    </form>
  );
};

export default Form;
