import React, { useState } from "react";
import Styles from "./form.module.css";

const Form = ({ handleFormSubmit }: any) => {
  const [text, setText] = useState("");
  const handleSubmit = (e: any) => {
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
    <form data-testid="form" onSubmit={handleSubmit} className={Styles.Form}>
      <textarea
        data-testid="form-input"
        className={Styles.Input}
        rows={1}
        value={text}
        placeholder="Start typing..."
        onChange={e => setText(e.target.value)}
      />
      <button className={Styles.Button}>Add task</button>
    </form>
  );
};

export default Form;
