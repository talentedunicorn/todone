import React, { useState } from "react";
import Styles from "./form.module.css";

const Form = ({ handleFormSubmit }: any) => {
  const [content, setContent] = useState("");
  const [focus, setFocus] = useState(false);
  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Todo is atleast 3 characters long
    if (content.trim().length < 3) {
      return false;
    }

    handleFormSubmit({
      content,
      completed: false
    });

    setContent("");
  };

  return (
    <form data-testid="form" onSubmit={handleSubmit} className={Styles.Form}>
      <textarea
        data-testid="form-input"
        className={Styles.Input}
        rows={1}
        value={content}
        placeholder="Start typing..."
        onChange={e => setContent(e.target.value)}
        onFocus={_ => setFocus(true)}
        onBlur={_ => setFocus(false)}
        data-expanded={focus}
      />
      <button className={Styles.Button}>Add task</button>
    </form>
  );
};

export default Form;
