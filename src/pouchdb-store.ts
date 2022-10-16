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

const getTodos = async () => {
	const todos = (await db.allDocs({ include_docs: true, descending: true })).rows.map(
		(t) => t.doc
	) as Todo[];
	return todos;
};

const onChangeHandler = (callback: () => void) => {
	db.changes({
		since: 'now',
		live: true
	}).on('change', callback);
};

export { getTodos, add, update, remove, onChangeHandler };
