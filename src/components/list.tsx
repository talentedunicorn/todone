import React, { useContext, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Editor } from "@toast-ui/react-editor";
import Styles from "./list.module.css";
import { TodoContext } from "../context/todoContext";
import { AuthContext } from "../context/authContext";
import { Todo } from "../models/todo";

const List = ({ title, items }: { title: string; items: Array<Todo> }) => {
  const { toggleTodo, deleteTodo, editTodo } = useContext(TodoContext);
  const { token } = useContext(AuthContext);
  const [selectedTodo, setSelected] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const editorRef = useRef<Editor>(null);

  const handleActions = (type: string, item: any) => {
    setSelected(item);
    setLoading(true);
    let action;
    switch (type) {
      case "edit":
        action = editTodo(item.id, item.content, token);
        break;
      case "toggle":
        action = toggleTodo(item.id, token);
        break;
      case "delete":
        action = deleteTodo(item.id, token);
        break;
      default:
        break;
    }

    action.finally(() => {
      setSelected(null);
      setLoading(false);
    });
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    const content = editorRef.current?.getInstance().getMarkdown();
    handleActions("edit", { ...selectedTodo, content });
  };

  return (
    <section className={Styles.Wrapper} data-expanded={expanded}>
      <h3 className={Styles.ListTitle} onClick={(_) => setExpanded(!expanded)}>
        {title}
      </h3>
      <ol
        data-testid="List"
        className={Styles.List}
        data-empty-message="All done..."
      >
        {items &&
          items
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            )
            .map((item) => (
              <li
                className={Styles.ListItem}
                key={item.id}
                data-loading={
                  loading && selectedTodo && selectedTodo.id === item.id
                }
              >
                {selectedTodo && selectedTodo.id === item.id ? (
                  <form onSubmit={handleSave} className={Styles.ListForm}>
                    <Editor
                      ref={editorRef}
                      initialValue={selectedTodo.content}
                      initialEditType="wysiwyg"
                    />
                    <section className={Styles.ListControls}>
                      <button className={Styles.ListSave}>Save</button>
                      <button
                        className={Styles.ListCancel}
                        onClick={(_) => setSelected(null)}
                      >
                        Cancel
                      </button>
                    </section>
                  </form>
                ) : (
                  <>
                    <div
                      className={Styles.ListContent}
                      data-completed={item.completed ? true : undefined}
                    >
                      <ReactMarkdown plugins={[gfm]} children={item.content} />
                    </div>
                    <section className={Styles.ListControls}>
                      <input
                        className={Styles.ListCheckbox}
                        type="checkbox"
                        defaultChecked={item.completed}
                        onClick={() => handleActions("toggle", item)}
                      />
                      <button
                        onClick={() => setSelected(item)}
                        className={Styles.ListEdit}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleActions("delete", item)}
                        className={Styles.ListDelete}
                      >
                        Delete
                      </button>
                    </section>
                  </>
                )}
              </li>
            ))}
      </ol>
    </section>
  );
};

export default List;
