export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'archived';

export interface Todo {
	id: string;
	title: string;
	value: string;
	status: TaskStatus;
	updated: string;
}
