import React, { useState, useEffect, useRef } from "react";
import Styles from "./form.module.css";

const Form = ({ handleFormSubmit, defaultValue, onReset }: any) => {
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
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

    reset();
  };

  const reset = () => {
    setContent("");
    setEditing(false);
    onReset && onReset();
  };

  useEffect(() => {
    const inputEl = inputRef.current;
    if (defaultValue) {
      setContent(defaultValue);
      inputEl && inputEl.focus();
      setEditing(true);
    }
  }, [defaultValue, inputRef]);

  return (
    <form data-testid="form" onSubmit={handleSubmit} className={Styles.Form}>
      <textarea
        data-testid="form-input"
        className={Styles.Input}
        rows={1}
        value={content}
        ref={inputRef}
        placeholder="Start typing..."
        onChange={(e) => setContent(e.target.value)}
      />
      <div className={Styles.Controls}>
        {content && (
          <button className={Styles.Reset} onClick={reset}>
            Cancel
          </button>
        )}
        <button type="submit" className={Styles.Submit}>
          {editing ? "Update" : "Add"}&nbsp;task
        </button>
      </div>
    </form>
  );
};

export default Form;
