import { type TaskDatabase, RxDBTaskDatabase } from './adapters/rxdb-adapter';
import { setupReplication } from './sync/replication';
import { type Todo } from './domain/todo';
import type { Stream } from './adapters/database';
import { get } from 'svelte/store';
import { token } from './stores/auth';

const dbName = import.meta.env.VITE_DB_NAME || 'Todone';
const synced = import.meta.env.VITE_SYNCED === 'true';
const remoteUrl = import.meta.env.VITE_REMOTE_DB;

let dbInstance: TaskDatabase | null = null;

const initDB = async (): Promise<TaskDatabase> => {
	if (!dbInstance) {
		const rxDb = new RxDBTaskDatabase({ name: dbName, synced, remoteUrl });
		await rxDb.init();
		dbInstance = rxDb;

		if (synced && remoteUrl) {
			setupReplication(rxDb.getDatabase(), remoteUrl, () => get(token) ?? null);
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

export const add = async (data: { title: string; value: string }) => {
	const db = await initDB();
	return db.add(data);
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
	const db = await initDB();
	return db.update({ id, title, value, completed });
};

export const remove = async (id: string) => {
	const db = await initDB();
	return db.remove(id);
};

export const setCompleted = async (id: string, completed: boolean) => {
	const db = await initDB();
	return db.setCompleted(id, completed);
};

export const exportTodos = async () => {
	const db = await initDB();
	return db.exportTodos();
};

export const importTodos = async (data: Todo[]) => {
	const db = await initDB();
	return db.importTodos(data);
};

export const createTaskDatabase = initDB;

export type { Todo, Stream };
