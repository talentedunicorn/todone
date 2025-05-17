import { SyncStatus, status, token, isLoggedin } from './stores';
import { createDatabase, pouchdbFetch, type Todo } from './lib/pouchdb';
import { LIMIT } from './stores/todos';

const dbName = import.meta.env.VITE_DB_NAME || 'Todone';
const synced = import.meta.env.VITE_SYNCED === 'true';
const remoteDBURL = import.meta.env.VITE_REMOTE_DB;

let authenticated = false;
isLoggedin.subscribe((v) => (authenticated = v));

// Custom fetch with Auth token
const fetchWithAuth = async (url: string | Request, options: RequestInit = {}) => {
	let authToken = '';
	token.subscribe((v) => (authToken = v));

	const headers = {
		...options.headers,
		Authorization: `Bearer ${authToken}`,
		'Content-Type': 'application/json'
	};

	const response = await pouchdbFetch(url, {
		...options,
		headers
	});
	if (!response.ok) {
		const { error, reason } = await response.json();
		if (reason === 'exp not in future') {
			throw new Error('Token expired');
		}
		throw new Error(error);
	}
	return response;
};

export const db: PouchDB.Database<Todo> = createDatabase(dbName);

// Setup replication
export const setupReplication = () => {
	if (synced && authenticated) {
		const remoteDB = createDatabase(remoteDBURL, {
			fetch: fetchWithAuth,
			skip_setup: true
		});

		// Send initial payload to server
		return db.replicate
			.to(remoteDB, {
				checkpoint: false
			})
			.on('complete', (info) => {
				console.info(`[Replication]: Push completed`, info);
				syncDB(remoteDB);
			})
			.on('error', (error: any) => {
				// Handle token expiry
				if (error.message === 'Token expired') {
					token.set('expired'); // will trigger logout
				}

				console.error(`[Replication error]:`, error);
				status.set(SyncStatus.ERROR);
			});
	}
	return null;
};

const syncDB = (remoteDb: PouchDB.Database<Todo>) => {
	// Initialize sync
	db.sync(remoteDb, { live: true, retry: true, checkpoint: false })
		.on('error', () => status.set(SyncStatus.ERROR))
		.on('active', () => status.set(SyncStatus.ACTIVE))
		.on('change', (info) => console.info(`[Sync change]`, info));
};

export const getTodos = async (query: string, limit = LIMIT, skip = 0) => {
	return db
		.createIndex({
			index: {
				fields: ['updated', 'title', 'value']
			}
		})
		.then(() =>
			db.find({
				selector: {
					...(query !== ''
						? {
								$or: [
									{
										title: {
											$regex: new RegExp(query, 'i')
										}
									},
									{
										value: {
											$regex: new RegExp(query, 'i')
										}
									}
								]
							}
						: undefined)
				},
				limit,
				skip,
				sort: [{ updated: 'desc' }]
			})
		);
};

export const add = async (data: Omit<Todo, '_id' | '_rev' | 'completed' | 'updated'>) => {
	const now = new Date().toISOString();
	return db.put({
		_id: now,
		title: data.title,
		value: data.value,
		completed: false,
		updated: now
	});
};

export const update = async ({ _id, _rev, title, value, completed }: Todo) => {
	const now = new Date().toISOString();
	return db.put({
		_id,
		_rev,
		title,
		value,
		completed,
		updated: now
	});
};

export const remove = async (_id: string) => {
	await db
		.find({
			selector: {
				_id
			}
		})
		.then(({ docs: [todo] }) => {
			return db.put({
				...todo,
				_deleted: true
			});
		});
};

export const setCompleted = async (_id: string, completed: boolean) => {
	const now = new Date().toISOString();
	return await db
		.find({
			selector: {
				_id
			}
		})
		.then(({ docs: [todo] }) => {
			const { _id, _rev } = todo;
			return db.put({
				...todo,
				_id,
				_rev,
				completed,
				updated: now
			});
		});
};

export const exportTodos = async (): Promise<Omit<Todo, '_rev'>[]> => {
	return (
		await db.allDocs({
			include_docs: true,
			descending: true
		})
	).rows
		.filter((d) => !d.doc?._id.startsWith('_design'))
		.map(({ doc }) => {
			const { _id, title, value, completed, updated } = doc!;
			return {
				_id,
				title,
				value,
				completed,
				updated
			};
		});
};

export const importTodos = async (docs: Omit<Todo, '_rev'>[]) => {
	return db.bulkDocs(docs);
};
