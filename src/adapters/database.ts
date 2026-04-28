import type { Observable } from 'rxjs';
import type { Todo } from '../domain/todo';

export interface TaskDatabase {
	getTodos(): Observable<Todo[]>;
	add(data: { title: string; value: string }): Promise<Todo>;
	update(data: { id: string; title: string; value: string; completed: boolean }): Promise<unknown>;
	remove(id: string): Promise<unknown>;
	setCompleted(id: string, completed: boolean): Promise<unknown>;
	exportTodos(): Promise<Todo[]>;
	importTodos(data: Todo[]): Promise<unknown>;
	getDocCount(): Promise<{ complete: Observable<number>; incomplete: Observable<number> }>;
}
