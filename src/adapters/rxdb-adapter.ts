import type { RxDatabase } from 'rxdb';
import { createDatabase, createCollection } from '../lib/rxdb';
import { type Todo, todoSchema } from '../domain/todo';
import { type TaskDatabase, type Stream, type DbConfig } from './database';
export type { TaskDatabase, Stream, DbConfig };

import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';

class RxDBStream<T> implements Stream<T> {
	constructor(private observable: Observable<T>) {}

	subscribe(callback: (value: T) => void): () => void {
		const subscription = this.observable.subscribe(callback);
		return () => subscription.unsubscribe();
	}
}

export class RxDBTaskDatabase implements TaskDatabase {
	private db: RxDatabase | null = null;
	private config: DbConfig;

	constructor(config: DbConfig) {
		this.config = config;
	}

	async init(): Promise<void> {
		if (this.db) return;

		this.db = await createDatabase(this.config.name);
		await createCollection(this.db, 'todos', todoSchema);
	}

	getDatabase(): RxDatabase {
		if (!this.db) {
			throw new Error('Database not initialized. Call init() first.');
		}
		return this.db;
	}

	private getDb(): RxDatabase {
		if (!this.db) {
			throw new Error('Database not initialized. Call init() first.');
		}
		return this.db;
	}

	getTodos(): Stream<Todo[]> {
		const db = this.getDb();
		const observable = db.todos
			.find()
			.sort({ updated: 'desc' })
			.$.pipe(map((docs) => docs.map((d) => d.toJSON() as Todo)));
		return new RxDBStream(observable);
	}

	async add(data: { title: string; value: string }): Promise<Todo> {
		const db = this.getDb();
		const now = new Date().toISOString();
		return db.todos.insert({ ...data, updated: now, id: now });
	}

	async update(data: {
		id: string;
		title: string;
		value: string;
		completed: boolean;
	}): Promise<unknown> {
		const db = this.getDb();
		const now = new Date().toISOString();
		const todo = db.todos.findOne({ selector: { id: { $eq: data.id } } });
		return todo?.update({
			$set: {
				title: data.title,
				value: data.value,
				completed: data.completed,
				updated: now
			}
		});
	}

	async remove(id: string): Promise<unknown> {
		const db = this.getDb();
		return db.todos.findOne({ selector: { id } }).remove();
	}

	async setCompleted(id: string, completed: boolean): Promise<unknown> {
		const db = this.getDb();
		return db.todos.findOne({ selector: { id } }).update({
			$set: { completed }
		});
	}

	async exportTodos(): Promise<Todo[]> {
		const db = this.getDb();
		return db.todos.find().sort({ updated: 'desc' }).exec();
	}

	async importTodos(data: Todo[]): Promise<unknown> {
		const db = this.getDb();
		return db.todos.bulkUpsert(data);
	}

	async getDocCount(): Promise<{ complete: Stream<number>; incomplete: Stream<number> }> {
		const db = this.getDb();
		const complete = new RxDBStream(db.todos.count({ selector: { completed: true } }).$);
		const incomplete = new RxDBStream(db.todos.count({ selector: { completed: false } }).$);
		return { complete, incomplete };
	}
}

let databaseInstance: RxDBTaskDatabase | null = null;

export async function createTaskDatabase(config: DbConfig): Promise<TaskDatabase> {
	if (databaseInstance) {
		return databaseInstance;
	}
	databaseInstance = new RxDBTaskDatabase(config);
	await databaseInstance.init();
	return databaseInstance;
}

export function getTaskDatabase(): TaskDatabase | null {
	return databaseInstance;
}
