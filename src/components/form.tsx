import React, { useState, useRef, useEffect } from "react";
import EasyMDE from "easymde";
import Styles from "./form.module.css";
import "easymde/dist/easymde.min.css";

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
  const [editor, setEditor] = useState<EasyMDE>();
  const [editing, setEditing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(true);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const content = editor!.value();

    if (content.trim.length < 1) return;

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
    setEditing(false);
    setHidden(true);
    onReset();
    editor!.value("");
  };

  useEffect(() => {
    if (defaultValue) {
      setEditing(true);
      setHidden(false);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (inputRef.current) {
      setEditor(
        new EasyMDE({
          element: inputRef.current as HTMLElement,
          placeholder: "Start typing...",
          initialValue: defaultValue,
          toolbar: [
            "bold",
            "italic",
            "heading-bigger",
            "heading-smaller",
            "|",
            "code",
            "quote",
            "link",
            "|",
            "image",
            "unordered-list",
            "ordered-list",
          ],
        })
      );
    }
  }, [hidden]);

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
    <div className={Styles.Wrapper}>
      {hidden ? (
        <button
          className={Styles.Toggle}
          data-testid="Toggle"
          onClick={() => setHidden(false)}
        >
          Add task
        </button>
      ) : (
        <form
          data-testid="form"
          onSubmit={handleSubmit}
          className={Styles.Form}
        >
          <textarea
            data-testid="form-input"
            className={Styles.Input}
            rows={1}
            ref={inputRef}
            placeholder="Start typing..."
          />
          <div className={Styles.Controls}>
            <button className={Styles.Reset} onClick={reset}>
              Cancel
            </button>
            <button
              type="submit"
              className={Styles.Submit}
              disabled={submitting}
            >
              {buttonText(
                (editing && "editing") ||
                  (submitting && "submitting") ||
                  "initial"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Form;
