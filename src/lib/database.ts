import PouchDB from 'pouchdb';
import type { Todo } from '$lib/types';
import { PUBLIC_DB_NAME, PUBLIC_REMOTE_DB, PUBLIC_SYNCED } from '$env/static/public';
import { status, SyncStatus } from '../stores';

const db = new PouchDB(PUBLIC_DB_NAME);

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
	if (PUBLIC_SYNCED === 'true') {
		db.replicate
			.to(PUBLIC_REMOTE_DB, {
				live: true,
				retry: true
			})
			.on('active', () => {
				status.set(SyncStatus.ACTIVE);
			})
			.on('error', (err) => {
				console.log(err);
				status.set(SyncStatus.ERROR);
			});
	}

	db.changes({
		since: 'now',
		live: true
	}).on('change', callback);
};

export { getTodos, add, update, remove, onChangeHandler };
