import React, { useContext } from "react";
import Markdown from "markdown-to-jsx";
import Styles from "./list.module.css";
import { TodoContext } from "../context/todoContext";
import { Todo } from "../models/todo";

const List = ({ title, items }: { title: string; items: Array<Todo> }) => {
  const { toggleTodo, deleteTodo, selected, selectTodo } =
    useContext(TodoContext);

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

  const getDateFromTime = (timestamp: number): Date => {
    if (timestamp < 10000000000) timestamp *= 1000; // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
    const converted = timestamp + new Date().getTimezoneOffset() * -1; // for timeZone
    return new Date(converted);
  };

  const formatTimestamp = (timestamp: number): string => {
    const formatted = getDateFromTime(timestamp);
    if (isNaN(formatted.getTime())) return "Invalid date"; // Check for invalid formats from old code
    // eslint-disable-next-line new-cap
    return Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(new Date(formatted));
  };

  const sortedList = items.sort((a, b) => {
    // Check for timestamps and convert those to date
    if (process.env.REACT_APP_OFFLINE_MODE) {
      a.updated_at = getDateFromTime(a.updated_at);
      b.updated_at = getDateFromTime(b.updated_at);
    }
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  return (
    <section data-testid="List" className={Styles.Wrapper}>
      <h3 className={Styles.ListTitle}>{title}</h3>
      <ol className={Styles.List} data-empty-message="All done...">
        {sortedList &&
          sortedList.map((item) => (
            <li
              className={Styles.ListItem}
              key={item.id}
              data-updated={`Updated at ${formatTimestamp(item.updated_at)}`}
            >
              <div
                className={Styles.ListContent}
                data-completed={item.completed ? true : undefined}
              >
                <Markdown>{item.content}</Markdown>
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
