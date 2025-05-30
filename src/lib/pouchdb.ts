import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

export type Todo = {
	_id?: string;
	_rev?: string;
	title: string;
	value: string;
	completed: boolean;
	updated: string;
};

export const pouchdbFetch = PouchDB.fetch;

export const createDatabase = (
	name: string,
	options?: PouchDB.Configuration.DatabaseConfiguration
) => new PouchDB<Todo>(name, options);
