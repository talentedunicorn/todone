import { addRxPlugin, type RxDatabase, type RxJsonSchema } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { replicateCouchDB } from 'rxdb/plugins/replication-couchdb';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { SyncStatus, status, token } from './stores';
import { createCollection, createDatabase } from './lib/rxdb';

export type Todo = {
	id: string;
	title: string;
	value: string;
	completed: boolean;
	updated: string;
};

if (import.meta.env.DEV) {
	addRxPlugin(RxDBDevModePlugin);
}

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

const dbName = import.meta.env.VITE_DB_NAME || 'Todone';

// Custom fetch with Auth token
const fetchWithAuth = async (url: RequestInfo | URL, options: any) => {
	let authToken;
	const optionsWithAuth = Object.assign({}, options);
	if (!optionsWithAuth.headers) {
		optionsWithAuth.headers = {};
	}

	token.subscribe((v) => (authToken = v));
	optionsWithAuth.headers['Authorization'] = `Bearer ${authToken}`;

	const response = await fetch(url, optionsWithAuth);

	if (!response.ok) {
		const { error, reason }: { error: string; reason: string } = await response.json();

		if (reason === 'exp not in future') {
			token.set(null);
			throw new Error('Token expired');
		}
	}

	return response;
};

// Schema
const todoSchema: RxJsonSchema<any> = {
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

let db: RxDatabase;

// Setup replication
const setupReplication = (db: RxDatabase) => {
	const url = import.meta.env.VITE_REMOTE_DB;

	const replicationState = replicateCouchDB({
		replicationIdentifier: 'couchdb-replication',
		collection: db.todos,
		live: true,
		url,
		fetch: fetchWithAuth,
		pull: {
			batchSize: 500 // increase this if sync doesn't fetch all records
		},
		push: {
			batchSize: 500
		}
	});

	replicationState.active$.subscribe(() => status.set(SyncStatus.ACTIVE));
	replicationState.error$.subscribe((e) => {
		// Handle expired token
		if (e.parameters?.errors?.at(0)?.message === 'Token expired') {
			token.set(null);
		}
		status.set(SyncStatus.ERROR);
	});
};

const getDB = async () => {
	try {
		// Create database instance
		if (!db) {
			db = await createDatabase(dbName).then(async (db) => {
				// Setup collections
				await createCollection(db, 'todos', todoSchema);
				return db;
			});
		} else {
			return db;
		}

		if (import.meta.env.VITE_SYNCED === 'true') {
			setupReplication(db);
		}

		return db;
	} catch (e) {
		console.error(`Error initializing database`, e);
	}
};

export const getDocCount = async () => {
	const db = await getDB();
	const complete = db!.todos.count({
		selector: {
			completed: true
		}
	}).$;

	const incomplete = db!.todos.count({
		selector: {
			completed: false
		}
	}).$;

	return {
		complete,
		incomplete
	};
};

export const getTodos = async () => {
	const db = await getDB();
	return db!.todos.find().sort({ updated: 'desc' }).$;
};

export const add = async (data: { title: string; value: string }) => {
	const db = await getDB();

	const now = new Date().toISOString();
	return db!.todos.insert({ ...data, updated: now, id: now });
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
	const db = await getDB();

	const now = new Date().toISOString();
	const todo = db!.todos.findOne({
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
	const db = await getDB();
	await db!.todos
		.findOne({
			selector: {
				id
			}
		})
		.remove();
};

export const setCompleted = async (id: string, completed: boolean) => {
	const db = await getDB();
	return await db!.todos
		.findOne({
			selector: {
				id
			}
		})
		.update({
			$set: {
				completed
			}
		});
};

export const exportTodos = async () => {
	const db = await getDB();
	return db!.todos.find().sort({ updated: 'desc' }).exec();
};

export const importTodos = async (data: Todo[]) => {
	const db = await getDB();
	return db!.todos.bulkUpsert(data);
};
