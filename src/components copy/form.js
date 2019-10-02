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

  const handleOnChange = e => {
    setText(e.target.value);
  };

  return (
    <form data-testid="form" onSubmit={handleSubmit} className="Form">
      <input data-testid="form-input" value={text} onChange={handleOnChange} />
      <button>Add task</button>
    </form>
  );
};

export default Form;
