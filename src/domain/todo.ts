export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Todo {
	id: string;
	title: string;
	value: string;
	status: TaskStatus;
	updated: string;
}
