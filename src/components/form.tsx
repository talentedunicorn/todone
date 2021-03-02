import React, { useState } from "react";
import Styles from "./form.module.css";

const Form = ({ handleFormSubmit, defaultValue }: any) => {
  const [content, setContent] = useState(defaultValue);
  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Todo is atleast 3 characters long
    if (content.trim().length < 3) {
      return false;
    }

    handleFormSubmit({
      content,
      completed: false,
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
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={Styles.Controls}>
        <button type="submit" className={Styles.Submit}>
          Add task
        </button>
      </div>
    </form>
  );
};

export default Form;
