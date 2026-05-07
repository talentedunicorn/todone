import { describe, it, expect, beforeEach } from 'vitest';
import { RxDBTaskDatabase } from '../../src/adapters/rxdb-adapter';
import type { Todo } from '../../src/domain/todo';

describe('RxDBTaskDatabase', () => {
	let db: RxDBTaskDatabase;

	beforeEach(async () => {
		db = new RxDBTaskDatabase({ name: 'test-db', synced: false });
		await db.init();
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
});
