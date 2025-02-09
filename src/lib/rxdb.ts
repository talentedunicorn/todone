import { createRxDatabase, addRxPlugin, type RxJsonSchema, type RxDatabase } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';

if (import.meta.env.DEV) {
	addRxPlugin(RxDBDevModePlugin);
}

addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);

export const createDatabase = (name: string) =>
	createRxDatabase({
		name,
		storage: getRxStorageDexie(),
		ignoreDuplicate: import.meta.env.DEV
	});

export const createCollection = async (
	db: RxDatabase,
	collectionName: string,
	schema: RxJsonSchema<unknown>
) => {
	await db.addCollections({
		[collectionName]: {
			schema
		}
	});
};
