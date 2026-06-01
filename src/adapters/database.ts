import type { Todo } from '../domain/todo';

export interface Stream<T> {
	subscribe(callback: (value: T) => void): () => void;
}

import type { TaskStatus } from '../domain/todo';

export interface TaskDatabase {
	getTodos(): Stream<Todo[]>;
	add(data: { title: string; value: string }): Promise<Todo>;
	update(data: { id: string; title: string; value: string; status: TaskStatus }): Promise<unknown>;
	remove(id: string): Promise<unknown>;
	setStatus(id: string, status: TaskStatus): Promise<unknown>;
	exportTodos(): Promise<Todo[]>;
	importTodos(data: Todo[]): Promise<unknown>;
	getDocCount(): Promise<{
		todo: Stream<number>;
		inProgress: Stream<number>;
		done: Stream<number>;
	}>;
}

export interface DbConfig {
	name: string;
	synced: boolean;
	remoteUrl?: string;
}
