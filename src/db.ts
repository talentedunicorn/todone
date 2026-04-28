import { addRxPlugin, type RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { createCollection, createDatabase } from './lib/rxdb';
import { type Todo, todoSchema } from './domain/todo';
import { setupReplication } from './sync/replication';
import type { Observable } from 'rxjs';

if (import.meta.env.DEV) {
	addRxPlugin(RxDBDevModePlugin);
}

addRxPlugin(RxDBUpdatePlugin);

const dbName = import.meta.env.VITE_DB_NAME || 'Todone';

let db: RxDatabase;

const getDB = async () => {
	try {
		if (!db) {
			db = await createDatabase(dbName).then(async (db) => {
				await createCollection(db, 'todos', todoSchema);
				return db;
			});

			if (import.meta.env.VITE_SYNCED === 'true') {
				const url = import.meta.env.VITE_REMOTE_DB;
				setupReplication(db, url);
			}
		} else {
			return db;
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

export type { Todo };
