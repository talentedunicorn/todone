import type { Todo } from '../domain/todo';

export interface Stream<T> {
	subscribe(callback: (value: T) => void): () => void;
}

export interface TaskDatabase {
	getTodos(): Stream<Todo[]>;
	add(data: { title: string; value: string }): Promise<Todo>;
	update(data: { id: string; title: string; value: string; completed: boolean }): Promise<unknown>;
	remove(id: string): Promise<unknown>;
	setCompleted(id: string, completed: boolean): Promise<unknown>;
	exportTodos(): Promise<Todo[]>;
	importTodos(data: Todo[]): Promise<unknown>;
	getDocCount(): Promise<{ complete: Stream<number>; incomplete: Stream<number> }>;
}

export interface DbConfig {
	name: string;
	synced: boolean;
	remoteUrl?: string;
}
