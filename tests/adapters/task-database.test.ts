import { describe, it, expect, beforeEach } from 'vitest';
import { RxDBTaskDatabase } from '../../src/adapters/rxdb-adapter';
import { MemoryTaskDatabase } from './memory-adapter';
import type { TaskDatabase } from '../../src/adapters/database';
import type { Todo } from '../../src/domain/todo';

type Factory = () => Promise<TaskDatabase>;

const hasIndexedDB = typeof globalThis.indexedDB !== 'undefined';

const factories: { name: string; create: Factory }[] = [
	{
		name: 'MemoryTaskDatabase',
		create: async () => new MemoryTaskDatabase()
	}
];

if (hasIndexedDB) {
	factories.push({
		name: 'RxDBTaskDatabase',
		create: async () => {
			const db = new RxDBTaskDatabase({ name: 'test-db', synced: false });
			await db.init();
			return db;
		}
	});
}

describe.each(factories)('TaskDatabase (%s)', ({ name, create }) => {
	let db: TaskDatabase;

	beforeEach(async () => {
		db = await create();
	});

	describe('Stream<T> interface', () => {
		it('emits current value on subscribe', async () => {
			const stream = db.getTodos();
			const values: Todo[][] = [];
			const unsub = stream.subscribe((v) => values.push(v));
			await new Promise((r) => setTimeout(r, 100));
			expect(values.length).toBeGreaterThan(0);
			unsub();
		});

		it('returns unsubscribe function', () => {
			const stream = db.getTodos();
			const unsub = stream.subscribe(() => {});
			expect(typeof unsub).toBe('function');
			unsub();
		});
	});

	describe('CRUD operations', () => {
		it('add creates todo with id and timestamp', async () => {
			const result = await db.add({ title: 'Test', value: 'Content' });
			expect(result.id).toBeDefined();
			expect(result.updated).toBeDefined();
			expect(result.title).toBe('Test');
			expect(result.value).toBe('Content');
			expect(result.completed).toBe(false);
		});

		it('update modifies existing todo', async () => {
			const created = await db.add({ title: 'Test', value: 'Content' });
			await db.update({ ...created, title: 'Updated', completed: true });
			const todos = await db.exportTodos();
			expect(todos[0].title).toBe('Updated');
			expect(todos[0].completed).toBe(true);
		});

		it('setCompleted toggles boolean', async () => {
			const created = await db.add({ title: 'Test', value: 'Content' });
			await db.setCompleted(created.id, true);
			const todos = await db.exportTodos();
			expect(todos[0].completed).toBe(true);
		});

		it('remove deletes todo', async () => {
			const created = await db.add({ title: 'Test', value: 'Content' });
			await db.remove(created.id);
			const todos = await db.exportTodos();
			expect(todos.length).toBe(0);
		});
	});

	describe('getDocCount streams', () => {
		it('returns separate complete/incomplete streams', async () => {
			const { complete, incomplete } = await db.getDocCount();
			expect(complete).toBeDefined();
			expect(incomplete).toBeDefined();
			expect(typeof complete.subscribe).toBe('function');
			expect(typeof incomplete.subscribe).toBe('function');
		});
	});

	describe('exportTodos', () => {
		it('returns Todo[] with correct shape', async () => {
			await db.add({ title: 'A', value: '' });
			await db.add({ title: 'B', value: '' });
			const todos = await db.exportTodos();
			expect(todos).toBeInstanceOf(Array);
			for (const t of todos) {
				expect(t).toHaveProperty('id');
				expect(t).toHaveProperty('title');
				expect(t).toHaveProperty('value');
				expect(t).toHaveProperty('completed');
				expect(t).toHaveProperty('updated');
			}
		});

		it('returns sorted by updated desc', async () => {
			const a = await db.add({ title: 'A', value: '' });
			await new Promise((r) => setTimeout(r, 10));
			const b = await db.add({ title: 'B', value: '' });
			const todos = await db.exportTodos();
			expect(todos[0].id).toBe(b.id);
			expect(todos[1].id).toBe(a.id);
		});
	});

	describe('importTodos', () => {
		it('bulk inserts todos', async () => {
			await db.importTodos([
				{
					id: 'import-1',
					title: 'Imported',
					value: '',
					completed: false,
					updated: new Date().toISOString()
				},
				{
					id: 'import-2',
					title: 'Also',
					value: '',
					completed: true,
					updated: new Date().toISOString()
				}
			]);
			const todos = await db.exportTodos();
			expect(todos.length).toBe(2);
		});

		it('upserts on id collision', async () => {
			const original = await db.add({ title: 'Original', value: '' });
			await db.importTodos([
				{
					...original,
					title: 'Updated via import',
					completed: true,
					updated: new Date().toISOString()
				}
			]);
			const todos = await db.exportTodos();
			expect(todos.length).toBe(1);
			expect(todos[0].title).toBe('Updated via import');
		});
	});

	describe('reactive streams', () => {
		it('getTodos fires on add', async () => {
			const stream = db.getTodos();
			const values: Todo[][] = [];
			stream.subscribe((v) => values.push(v));
			await db.add({ title: 'New', value: '' });
			await new Promise((r) => setTimeout(r, 50));
			expect(values.length).toBeGreaterThan(1);
			expect(values[values.length - 1]).toHaveLength(1);
		});

		it('getTodos fires on remove', async () => {
			const created = await db.add({ title: 'ToDelete', value: '' });
			const stream = db.getTodos();
			const values: Todo[][] = [];
			stream.subscribe((v) => values.push(v));
			await db.remove(created.id);
			await new Promise((r) => setTimeout(r, 50));
			expect(values[values.length - 1]).toHaveLength(0);
		});
	});
});
