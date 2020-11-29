import React, { useContext, useState } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import Styles from "./list.module.css";
import { TodoContext } from "../context/todoContext";
import { Todo } from "../models/todo";

const List = ({ title, items }: { title: string; items: Array<Todo> }) => {
  const { toggleTodo, deleteTodo, editTodo } = useContext(TodoContext);
  const [selectedTodo, setSelected] = useState<null | any>(null);
  const [expanded, setExpanded] = useState(true);

  const handleEdit = (e: any) =>
    setSelected({ ...selectedTodo, content: e.target.value });

  const handleActions = async (type: string, item: any) => {
    switch (type) {
      case "edit":
        setSelected(item);
        await editTodo(item.id, item.content);
        break;
      case "toggle":
        await toggleTodo(item.id);
        break;
      case "delete":
        await deleteTodo(item.id);
        break;
    }
    setSelected(null);
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    handleActions("edit", selectedTodo);
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
                {selectedTodo && selectedTodo.id === item.id ? (
                  <form onSubmit={handleSave} className={Styles.ListForm}>
                    <textarea
                      rows={1}
                      className={Styles.ListInput}
                      value={selectedTodo.content}
                      onChange={handleEdit}
                      data-expanded={true}
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
