import React, { useState, useEffect, useRef } from "react";
import Styles from "./form.module.css";

const Form = ({
  handleFormSubmit,
  defaultValue,
  onReset,
}: {
  handleFormSubmit: (data: {
    content: string;
    completed: boolean;
  }) => Promise<any>;
  defaultValue?: string;
  onReset: () => void;
}) => {
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Todo is atleast 3 characters long
    if (content.trim().length < 3) {
      return false;
    }

    setSubmitting(true);
    setEditing(false);
    handleFormSubmit({
      content,
      completed: false,
    }).finally(() => {
      setSubmitting(false);
      reset();
    });
  };

  const reset = () => {
    setContent("");
    onReset();
  };

  useEffect(() => {
    const inputEl = inputRef.current;
    if (defaultValue) {
      setContent(defaultValue);
      inputEl && inputEl.focus();
      setEditing(true);
    }
  }, [defaultValue, inputRef]);

  const buttonText = (status: "editing" | "submitting" | "initial") => {
    switch (status) {
      case "editing":
        return "Update task";
      case "submitting":
        return "Submitting";
      default:
        return "Add task";
    }
  };

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
        {!submitting && content && (
          <button className={Styles.Reset} onClick={reset}>
            Cancel
          </button>
        )}
        <button type="submit" className={Styles.Submit} disabled={submitting}>
          {editing && buttonText("editing")}
          {submitting && buttonText("submitting")}
          {!editing && !submitting && buttonText("initial")}
        </button>
      </div>
    </form>
  );
};

export default Form;
