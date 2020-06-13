import React, { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import Styles from "./list.module.css";
import { TodoContext } from "../context/todoContext";
import { AuthContext } from "../context/authContext";
import { Todo } from "../models/todo";

const List = ({ title, items }: { title: string; items: Array<Todo> }) => {
  const { toggleTodo, deleteTodo, editTodo } = useContext(TodoContext);
  const { token } = useContext(AuthContext);
  const [selectedTodo, setSelected] = useState<null | any>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleEdit = (e: any) =>
    setSelected({ ...selectedTodo, content: e.target.value });

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
    handleActions("edit", selectedTodo);
  };

  const handleSelected = (item: any, e: any) => {
    // Prevent links triggering click events
    if (e.target.tagName.toLowerCase() === "a") {
      e.target.target = "blank";
      e.stopPropagation();
      return;
    }

    setSelected(item);
  };

  return (
    <section className={Styles.Wrapper} data-expanded={expanded}>
      <h3 className={Styles.ListTitle} onClick={_ => setExpanded(!expanded)}>
        {title}
      </h3>
      <ol
        data-testid="List"
        className={Styles.List}
        data-empty-message="All done..."
      >
        {items &&
          items
            .sort((a, b) => b.id - a.id)
            .map(item => (
              <li
                className={Styles.ListItem}
                key={item.id}
                data-loading={
                  loading && selectedTodo && selectedTodo.id === item.id
                }
              >
                {selectedTodo && selectedTodo.id === item.id ? (
                  <form onSubmit={handleSave} className={Styles.ListForm}>
                    <textarea
                      rows={1}
                      className={Styles.ListInput}
                      value={selectedTodo.content}
                      onChange={handleEdit}
                      data-expanded={true}
                    />
                    <button className={Styles.ListSave}>Save</button>
                    <button
                      className={Styles.ListCancel}
                      onClick={_ => setSelected(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div
                    className={Styles.ListContent}
                    data-completed={item.completed ? true : undefined}
                    onClick={e => handleSelected(item, e)}
                  >
                    <ReactMarkdown source={item.content} />
                  </div>
                )}
                <section className={Styles.ListControls}>
                  <input
                    className={Styles.ListCheckbox}
                    type="checkbox"
                    defaultChecked={item.completed}
                    onClick={() => handleActions("toggle", item)}
                  />
                  <button
                    onClick={() => handleActions("delete", item)}
                    className={Styles.ListDelete}
                  >
                    Delete
                  </button>
                </section>
              </li>
            ))}
      </ol>
    </section>
  );
};

export default List;
