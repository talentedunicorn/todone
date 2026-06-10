import type { TaskStatus } from '../domain/todo';

/**
 * Returns the next status in the cycle: todo → in-progress → done → todo
 */
export function nextStatus(current: TaskStatus): TaskStatus {
	const order: TaskStatus[] = ['todo', 'in-progress', 'done'];
	const idx = order.indexOf(current);
	return idx < order.length - 1 ? order[idx + 1] : order[0];
}
