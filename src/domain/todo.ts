import type { RxJsonSchema } from 'rxdb';

export type Todo = {
	id: string;
	title: string;
	value: string;
	completed: boolean;
	updated: string;
};

export const todoSchema: RxJsonSchema<Todo> = {
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: { type: 'string', maxLength: 100 },
		title: { type: 'string' },
		value: { type: 'string' },
		completed: { type: 'boolean', default: false },
		updated: { type: 'string', format: 'date-time' }
	},
	required: ['id', 'title', 'value', 'updated', 'completed'],
	indexes: ['completed']
};
