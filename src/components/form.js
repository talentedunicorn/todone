import React, { useState } from "react";
import "./form.css";

const Form = ({ text, formChange, formSubmit }) => {
  const handleFormChange = e => {
    formChange(e.target.value);
  };

  return (
    <form data-testid="form" className="Form" onSubmit={formSubmit}>
      <input
        data-testid="form-input"
        value={text}
        onChange={handleFormChange}
      />
      <button>Add task</button>
    </form>
  );
};

export default Form;
