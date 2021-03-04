import React, { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import Styles from "./list.module.css";
import { TodoContext } from "../context/todoContext";
import { Todo } from "../models/todo";

const List = ({ title, items }: { title: string; items: Array<Todo> }) => {
  const { toggleTodo, deleteTodo, selected, selectTodo } = useContext(
    TodoContext
  );
  const [expanded, setExpanded] = useState(true);

  const handleActions = async (type: string, item: any) => {
    switch (type) {
      case "toggle":
        await toggleTodo(item.id);
        break;
      case "delete":
        if (window.confirm("Are you sure?")) {
          await deleteTodo(item.id);
        }
        break;
    }
  };

  return (
    <section
      data-testid="List"
      className={Styles.Wrapper}
      data-expanded={expanded}
    >
      <h3 className={Styles.ListTitle} onClick={(_) => setExpanded(!expanded)}>
        {title}
      </h3>
      <ol className={Styles.List} data-empty-message="All done...">
        {items &&
          items
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            )
            .map((item) => (
              <li className={Styles.ListItem} key={item.id}>
                <div
                  className={Styles.ListContent}
                  data-completed={item.completed ? true : undefined}
                >
                  <ReactMarkdown plugins={[gfm]} children={item.content} />
                </div>
                <section className={Styles.ListControls}>
                  <input
                    disabled={selected === item}
                    className={Styles.ListCheckbox}
                    type="checkbox"
                    defaultChecked={item.completed}
                    onClick={() => handleActions("toggle", item)}
                  />
                  <button
                    disabled={selected === item}
                    onClick={() => selectTodo(item)}
                    className={Styles.ListEdit}
                  >
                    Edit
                  </button>
                  <button
                    disabled={selected === item}
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
