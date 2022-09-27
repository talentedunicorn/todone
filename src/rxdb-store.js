import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';

import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
addRxPlugin(RxDBUpdatePlugin);

import { RxDBReplicationGraphQLPlugin } from 'rxdb/plugins/replication-graphql';
addRxPlugin(RxDBReplicationGraphQLPlugin);

// import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
// addRxPlugin(RxDBDevModePlugin);

const schema = {
	title: 'Todos Schema',
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		title: { type: 'string' },
		value: { type: 'string' },
		updated: { type: 'number' },
		completed: { type: 'boolean', default: false }
	}
};
/** @type {import('rxdb').RxDatabase} */
let dbPromise;

const pullQueryBuilder = (checkpoint, limit) => {
	const query = `query getTodos($checkpoint: CheckpointInput, $limit: Int!) {
		todos(checkpoint: $checkpoint, limit: $limit) {
			documents {
				id
				title
				value
				completed
				updated
			}
			checkpoint {
				id
				updated
			}
		}
	}`;

	return {
		query,
		variables: {
			checkpoint,
			limit
		}
	}
}

const pullStreamQueryBuilder = () => {
	const query = `subscription onStream {
		streamTodos {
			documents {
				id,
				title,
				value,
				completed,
				updated
			},
			checkpoint {
				id
				updated
			}
		}
	}`

	return {
		query,
		variables: {}
	}
}

const _init = async () => {
	const db = await createRxDatabase({
		name: 'todone',
		storage: getRxStorageDexie()
	});

	if (!db.todos) await db.addCollections({ todos: { schema } });
	dbPromise = db;

	// Setup replication
	const replicationState = db.todos.syncGraphQL({
		url: { http: '/api/todos' },
		pull: {
			queryBuilder: pullQueryBuilder,
			streamQueryBuilder: pullStreamQueryBuilder,
			responseModifier: async function(plainResponse, origin, requestCheckpoint) {
				if (origin === 'stream') {
					debugger
				}
				return {
					documents: plainResponse.documents,
					checkpoint: requestCheckpoint
				}
			}
		},
		live: true,
		deletedField: 'deleted',
		waitForLeadership: true,
		autoStart: true,
	})

	replicationState.error$.subscribe(err => {
		console.error('Replication error:')
		console.dir(err)
	})

	return db;
};

export const db = () => (dbPromise ? dbPromise : _init());

const getUpdated = () => Math.floor(Date.now() / 1000)

export const add = async (/** @type {{ title: String, value: String }} */ { title, value }) => {
	const dbInstance = await db();
	const id = new Date().toISOString();
	dbInstance.todos.insert({
		id,
		title,
		value,
		updated: getUpdated()
	});
};

export const edit = async (
	/** @type {{ id: String, title: String, value: String }} */ { id, title, value }
) => {
	const dbInstance = await db();
	const query = dbInstance.todos.findOne({ selector: { id: { $eq: id } } });
	await query.update({
		$set: { title, value, updated: getUpdated() }
	});
};

export const remove = async (/** @type {string} */ id) => {
	const dbInstance = await db();
	const query = dbInstance.todos.findOne({ selector: { id: { $eq: id } } });
	await query.remove();
};

export const toggleComplete = async (/** @type {string} */ id) => {
	const dbInstance = await db();
	const query = dbInstance.todos.findOne({ selector: { id: { $eq: id } } });
	const completed = !(await query.exec()).completed;
	await query.update({
		$set: { completed, updated: getUpdated() }
	});
};
