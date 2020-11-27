import { Todo } from "../models/todo";

export const todolist: Todo[] = [
  {
    id: 1,
    content: "First todo",
    completed: false,
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: 2,
    content: "Second todo",
    completed: true,
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: 3,
    content: "Click [me](https://google.com)",
    completed: false,
    created_at: Date.now(),
    updated_at: Date.now(),
  },
];
