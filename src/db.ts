import { createTaskDatabase, getTaskDatabase, type TaskDatabase } from './adapters/rxdb-adapter';
import { setupReplication } from './sync/replication';
import { type Todo } from './domain/todo';
import type { Stream } from './adapters/database';

const dbName = import.meta.env.VITE_DB_NAME || 'Todone';
const synced = import.meta.env.VITE_SYNCED === 'true';
const remoteUrl = import.meta.env.VITE_REMOTE_DB;

let dbPromise: Promise<TaskDatabase> | null = null;

const getDB = async (): Promise<TaskDatabase> => {
	if (!dbPromise) {
		dbPromise = createTaskDatabase({
			name: dbName,
			synced,
			remoteUrl
		});

		const db = await dbPromise;
		if (synced && remoteUrl) {
			(db as any).getDatabase && setupReplication((db as any).getDatabase(), remoteUrl);
		}
	}
	return dbPromise;
};

export const getDocCount = async () => {
	const db = await getDB();
	return db.getDocCount();
};

export const getTodos = async () => {
	const db = await getDB();
	return db.getTodos();
};

export const add = async (data: { title: string; value: string }) => {
	const db = await getDB();
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
	const db = await getDB();
	return db.update({ id, title, value, completed });
};

export const remove = async (id: string) => {
	const db = await getDB();
	return db.remove(id);
};

export const setCompleted = async (id: string, completed: boolean) => {
	const db = await getDB();
	return db.setCompleted(id, completed);
};

export const exportTodos = async () => {
	const db = await getDB();
	return db.exportTodos();
};

export const importTodos = async (data: Todo[]) => {
	const db = await getDB();
	return db.importTodos(data);
};

export type { Todo, Stream };
