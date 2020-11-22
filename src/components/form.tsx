import React, { useRef, useState } from "react";
import Styles from "./form.module.css";

import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";

const Form = ({ handleFormSubmit }: any) => {
  const [opened, setOpened] = useState(true);
  const editorRef = useRef<Editor>(null);

  const handleSubmit = (e: any) => {
    let editorInstance;
    e.preventDefault();
    if (editorRef.current) {
      editorInstance = editorRef.current.getInstance();
      const content = editorInstance.getMarkdown();
      content.trim().length > 1 &&
        handleFormSubmit({
          content,
          completed: false,
        });

      editorInstance.reset();
    }
  };

  return (
    <form data-testid="form" onSubmit={handleSubmit} className={Styles.Form}>
      <button
        type="button"
        onClick={() => setOpened(!opened)}
        className={Styles.Toggle}
      >
        {opened ? "Close" : "Open"} editor
      </button>
      {opened && (
        <>
          <Editor
            data-testid="form-input"
            initialEditType="wysiwyg"
            placeholder="Start typing..."
            height="30vh"
            ref={editorRef}
            usageStatistics={false}
          />
          <div className={Styles.Controls}>
            <button type="submit" className={Styles.Submit}>
              Submit
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default Form;
