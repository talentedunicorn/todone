import { Todo } from "../models/todo";

const daysAgo = (days: number) =>
  new Date().setDate(new Date(Date.now()).getDate() - days);

export const todolist: Todo[] = [
  {
    id: 1,
    content: "First todo",
    completed: false,
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
  },
  {
    id: 2,
    content: "Second todo",
    completed: true,
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
  },
  {
    id: 3,
    content: "Click [me](https://google.com)",
    completed: false,
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
  },
  {
    id: 4,
    content: "Updated last",
    completed: false,
    created_at: daysAgo(2),
    updated_at: daysAgo(0),
  },
];
