import { createRxDatabase, addRxPlugin, type RxJsonSchema, type RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { map } from 'rxjs/operators';
import type { Observable } from 'rxjs';

if (import.meta.env.DEV) {
	addRxPlugin(RxDBDevModePlugin);
}

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

const storage = wrappedValidateAjvStorage({
	storage: getRxStorageDexie()
});

import type { Todo, TaskStatus } from '../domain/todo';

const todoSchema: RxJsonSchema<Todo> = {
	version: 2,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		title: { type: 'string' },
		value: { type: 'string' },
		status: {
			type: 'string',
			default: 'todo',
			maxLength: 20,
			enum: ['todo', 'in-progress', 'done']
		},
		updated: { type: 'string', format: 'date-time' }
	},
	required: ['id', 'title', 'value', 'updated', 'status'],
	indexes: ['status']
};

const createDatabase = (name: string) =>
	createRxDatabase({
		name,
		storage,
		ignoreDuplicate: import.meta.env.DEV
	});

const migrationStrategies = {
	1: (oldDoc: any) => {
		// v0 had 'completed: boolean', v1 uses 'status: string'
		oldDoc.status = oldDoc.completed ? 'done' : 'todo';
		delete oldDoc.completed;
		return oldDoc;
	},
	2: (oldDoc: any) => {
		// v1 had 'archived' status, v2 restricts to ['todo', 'in-progress', 'done']
		if (oldDoc.status === 'archived') {
			oldDoc.status = 'done';
		}
		return oldDoc;
	}
};

const createCollection = async <T extends object>(
	db: RxDatabase,
	collectionName: string,
	schema: RxJsonSchema<T>
) => {
	await db.addCollections({
		[collectionName]: {
			schema,
			migrationStrategies,
			autoMigrate: true
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
		return db.todos.insert({ ...data, status: 'todo', updated: now, id: now });
	}

	async update(data: {
		id: string;
		title: string;
		value: string;
		status: TaskStatus;
	}): Promise<unknown> {
		const db = this.getDb();
		const now = new Date().toISOString();
		const todo = db.todos.findOne({ selector: { id: { $eq: data.id } } });
		return todo?.update({
			$set: {
				title: data.title,
				value: data.value,
				status: data.status,
				updated: now
			}
		});
	}

	async remove(id: string): Promise<unknown> {
		const db = this.getDb();
		return db.todos.findOne({ selector: { id } }).remove();
	}

	async setStatus(id: string, status: TaskStatus): Promise<unknown> {
		const db = this.getDb();
		const now = new Date().toISOString();
		return db.todos.findOne({ selector: { id } }).update({
			$set: { status, updated: now }
		});
	}

	async restore(task: Todo): Promise<unknown> {
		const db = this.getDb();
		return db.todos.upsert(task);
	}

	async exportTodos(): Promise<Todo[]> {
		const db = this.getDb();
		const docs = await db.todos.find().sort({ updated: 'desc' }).exec();
		return docs.map((d) => d.toJSON() as Todo);
	}

	async importTodos(data: Todo[]): Promise<unknown> {
		const db = this.getDb();
		// Migrate legacy imports
		const migrated = data.map((doc) => {
			const d = doc as Todo & { completed?: boolean };
			// v0 had 'completed: boolean' instead of 'status: string'
			if (d.completed !== undefined && !d.status) {
				d.status = d.completed ? 'done' : 'todo';
				delete d.completed;
			}
			// v1 had 'archived' status, removed in v2
			if ((d as any).status === 'archived') {
				(d as any).status = 'done';
			}
			return d;
		});
		return db.todos.bulkUpsert(migrated);
	}

	async getDocCount(): Promise<{
		todo: Stream<number>;
		inProgress: Stream<number>;
		done: Stream<number>;
	}> {
		const db = this.getDb();
		const todo = new RxDBStream(db.todos.count({ selector: { status: 'todo' } }).$);
		const inProgress = new RxDBStream(db.todos.count({ selector: { status: 'in-progress' } }).$);
		const done = new RxDBStream(db.todos.count({ selector: { status: 'done' } }).$);
		return { todo, inProgress, done };
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
