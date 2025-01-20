import { addRxPlugin, type RxDatabase, type RxJsonSchema } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { SyncStatus, status, token } from './stores';
import { createCollection, createDatabase } from './lib/rxdb';
import { migrateDocumentData, RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';

export type Todo = {
	id: string;
	title: string;
	value: string;
	completed: boolean;
	updated: string;
	expanded?: boolean;
};

if (import.meta.env.DEV) {
	addRxPlugin(RxDBDevModePlugin);
}

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

const dbName = import.meta.env.VITE_DB_NAME || 'Todone';

// Custom fetch with Auth token
const fetchWithAuth = (url: RequestInfo | URL, options: any) => {
	let authToken;
	const optionsWithAuth = Object.assign({}, options);
	if (!optionsWithAuth.headers) {
		optionsWithAuth.headers = {};
	}

	token.subscribe((v) => (authToken = v));
	optionsWithAuth.headers['Authorization'] = `Bearer ${authToken}`;

	return fetch(url, optionsWithAuth);
};

// Schema
const todoSchema: RxJsonSchema<any> = {
	version: 1,
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

const db: RxDatabase = await createDatabase(dbName);

if (!db.todos) {
	await db.addCollections({
		todos: {
			schema: todoSchema,
			migrationStrategies: {
				1: function (oldDoc) {
					return oldDoc;
				}
			}
		}
	});
}

// Setup replication
const setupReplication = (db: RxDatabase) => {
	const url = import.meta.env.VITE_REMOTE_DB;

	const replicationState = replicateCouchDB({
		replicationIdentifier: 'couchdb-replication',
		collection: db.todos,
		live: true,
		url,
		fetch: fetchWithAuth,
		pull: {},
		push: {}
	});

	replicationState.active$.subscribe(() => status.set(SyncStatus.ACTIVE));
	replicationState.error$.subscribe(() => status.set(SyncStatus.ERROR));
};

if (import.meta.env.VITE_SYNCED === 'true') {
	setupReplication(db);
}

export const getTodos = async (page: number = 0, limit: number = 5, completed: boolean = false) => {
	return db.todos
		.find({
			selector: {
				completed: {
					$eq: completed
				}
			}
		})
		.sort({ updated: 'desc' })
		.limit(limit)
		.skip(limit * page).$;
};

export const getTotalCount = async (completed: boolean = false) => {
	return db.todos.count({
		selector: {
			completed: {
				$eq: completed
			}
		}
	}).$;
};

export const add = async (data: { title: string; value: string }) => {
	const now = new Date().toISOString();
	return db.todos.insert({ ...data, updated: now, id: now });
};

export const update = async ({
	id,
	title,
	value,
	completed
}: {
	id: string;
	title: string;
	value: string;
	completed: boolean;
}) => {
	const now = new Date().toISOString();
	const todo = db.todos.findOne({
		selector: { id: { $eq: id } }
	});

	return todo?.update({
		$set: {
			title,
			value,
			completed,
			updated: now
		}
	});
};

export const remove = async (id: string) => {
	await db.todos
		.findOne({
			selector: {
				id
			}
		})
		.remove();
};

export const clearCompleted = async () => {
	return db.todos
		.find({
			selector: {
				completed: true
			}
		})
		.remove();
};

export const setCompleted = async (id: string, completed: boolean) => {
	return await db.todos
		.findOne({
			selector: {
				id
			}
		})
		.patch({
			completed
		});
};

export const exportTodos = async () => {
	return db.todos.find().sort({ updated: 'desc' }).exec();
};

export const importTodos = async (data: Todo[]) => {
	return db.todos.bulkUpsert(data);
};
