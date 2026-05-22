import type { TaskDatabase, Stream } from '../../src/adapters/database';
import type { Todo } from '../../src/domain/todo';

class SimpleStream<T> implements Stream<T> {
	private listeners = new Set<(value: T) => void>();

	constructor(private value: T) {}

	emit(value: T) {
		this.value = value;
		this.listeners.forEach((fn) => fn(value));
	}

	subscribe(callback: (value: T) => void): () => void {
		callback(this.value);
		this.listeners.add(callback);
		return () => this.listeners.delete(callback);
	}
}

export class MemoryTaskDatabase implements TaskDatabase {
	private todos = new Map<string, Todo>();
	private stream = new SimpleStream<Todo[]>([]);

	async init(): Promise<void> {}

	private persist() {
		const all = Array.from(this.todos.values()).sort(
			(a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
		);
		this.stream.emit(all);
	}

	getTodos(): Stream<Todo[]> {
		return this.stream;
	}

	async add(data: { title: string; value: string }): Promise<Todo> {
		const now = new Date().toISOString();
		const todo: Todo = { ...data, id: now, completed: false, updated: now };
		this.todos.set(todo.id, todo);
		this.persist();
		return todo;
	}

	async update(data: {
		id: string;
		title: string;
		value: string;
		completed: boolean;
	}): Promise<void> {
		const existing = this.todos.get(data.id);
		if (!existing) return;
		const updated: Todo = { ...existing, ...data, updated: new Date().toISOString() };
		this.todos.set(data.id, updated);
		this.persist();
	}

	async remove(id: string): Promise<void> {
		this.todos.delete(id);
		this.persist();
	}

	async setCompleted(id: string, completed: boolean): Promise<void> {
		const todo = this.todos.get(id);
		if (!todo) return;
		this.todos.set(id, { ...todo, completed });
		this.persist();
	}

	async exportTodos(): Promise<Todo[]> {
		return Array.from(this.todos.values()).sort(
			(a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
		);
	}

	async importTodos(data: Todo[]): Promise<void> {
		for (const todo of data) {
			this.todos.set(todo.id, todo);
		}
		this.persist();
	}

	async getDocCount(): Promise<{ complete: Stream<number>; incomplete: Stream<number> }> {
		const complete = new SimpleStream<number>(0);
		const incomplete = new SimpleStream<number>(0);

		const update = () => {
			let c = 0,
				i = 0;
			for (const t of this.todos.values()) {
				if (t.completed) c++;
				else i++;
			}
			complete.emit(c);
			incomplete.emit(i);
		};

		this.stream.subscribe(update);

		return { complete, incomplete };
	}
}
