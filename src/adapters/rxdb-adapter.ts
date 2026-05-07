import { createRxDatabase, addRxPlugin, type RxJsonSchema, type RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';

if (import.meta.env.DEV) {
	addRxPlugin(RxDBDevModePlugin);
}

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

const storage = wrappedValidateAjvStorage({
	storage: getRxStorageDexie()
});

import type { Todo } from '../domain/todo';

const todoSchema: RxJsonSchema<Todo> = {
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		title: { type: 'string' },
		value: { type: 'string' },
		completed: { type: 'boolean', default: false },
		updated: { type: 'string', format: 'date-time' }
	},
	required: ['id', 'title', 'value', 'updated', 'completed'],
	indexes: ['completed']
};

const createDatabase = (name: string) =>
	createRxDatabase({
		name,
		storage,
		ignoreDuplicate: import.meta.env.DEV
	});

const createCollection = async <T extends object>(
	db: RxDatabase,
	collectionName: string,
	schema: RxJsonSchema<T>
) => {
	await db.addCollections({
		[collectionName]: {
			schema
		}
	});
};

import { type TaskDatabase, type Stream, type DbConfig } from './database';
export type { TaskDatabase, Stream, DbConfig };

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
