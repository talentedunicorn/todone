import type { Todo } from '$lib/types';
import PouchDB from 'pouchdb';
import { DB_NAME } from './constants';

const db = new PouchDB(DB_NAME);

const add = async ({ title, value }: { title: string; value: string }) => {
	await db.put({
		_id: new Date().toISOString(),
		title,
		value,
		completed: false
	});
};

const update = async (todo: Todo) => {
	await db.put(todo);
};

const remove = async (id: string, rev: string) => {
	await db.remove(id, rev);
};

export { db, add, update, remove };
