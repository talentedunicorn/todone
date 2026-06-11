import { type TaskDatabase, RxDBTaskDatabase } from './adapters/rxdb-adapter';
import { setupReplication } from './sync/replication';
import { type Todo } from './domain/todo';
import type { Stream } from './adapters/database';
import { isLoggedin, user } from './stores/auth';
import { getClient } from './auth';

const dbName = import.meta.env.VITE_DB_NAME || 'Todone';
const synced = import.meta.env.VITE_SYNCED === 'true';
const remoteUrl = import.meta.env.VITE_REMOTE_DB;

let dbInstance: TaskDatabase | null = null;

const onTokenExpired = async (): Promise<string | null> => {
	const auth0 = getClient();
	if (!auth0) return null;

	try {
		const { id_token } = await auth0.getTokenSilently({
			authorizationParams: {
				redirect_uri: window.location.origin
			},
			detailedResponse: true,
			cacheMode: 'off'
		});
		return id_token;
	} catch {
		isLoggedin.set(false);
		user.set({});
		window.location.href = '/login';
		return null;
	}
};

const initDB = async (): Promise<TaskDatabase> => {
	if (!dbInstance) {
		const rxDb = new RxDBTaskDatabase({ name: dbName, synced, remoteUrl });
		await rxDb.init();
		dbInstance = rxDb;

		if (synced && remoteUrl) {
			setupReplication(
				rxDb.getDatabase(),
				remoteUrl,
				async () => {
					const auth0 = getClient();
					if (!auth0) return null;
					try {
						const { id_token } = await auth0.getTokenSilently({
							authorizationParams: {
								redirect_uri: window.location.origin
							},
							detailedResponse: true,
							cacheMode: 'off'
						});
						return id_token;
					} catch {
						return null;
					}
				},
				onTokenExpired
			);
		}
	}
	return dbInstance;
};

export const getDocCount = async () => {
	const db = await initDB();
	return db.getDocCount();
};

export const getTodos = async () => {
	const db = await initDB();
	return db.getTodos();
};

export const getTodosPage = async (opts: {
	sortField: 'updated' | 'created';
	sortDir: 'asc' | 'desc';
	searchQuery?: string;
	skip: number;
	limit: number;
}) => {
	const db = await initDB();
	return db.getTodosPage(opts);
};

export const add = async (data: { title: string; value: string }) => {
	const db = await initDB();
	return db.add(data);
};

import type { TaskStatus } from './domain/todo';

export const update = async ({
	id,
	title,
	value,
	status
}: {
	id: string;
	title: string;
	value: string;
	status: TaskStatus;
}) => {
	const db = await initDB();
	return db.update({ id, title, value, status });
};

export const remove = async (id: string) => {
	const db = await initDB();
	return db.remove(id);
};

export const setStatus = async (id: string, status: TaskStatus) => {
	const db = await initDB();
	return db.setStatus(id, status);
};

export const exportTodos = async () => {
	const db = await initDB();
	return db.exportTodos();
};

export const importTodos = async (data: Todo[]) => {
	const db = await initDB();
	return db.importTodos(data);
};

export const restore = async (task: Todo) => {
	const db = await initDB();
	return db.restore(task);
};

export const createTaskDatabase = initDB;

export type { Todo, Stream };
