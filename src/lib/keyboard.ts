/**
 * Keyboard shortcut registry.
 * Provides a centralized way to register global keyboard shortcuts
 * with automatic scoping (skipped when focus is inside an input/textarea/editor).
 */

type ShortcutHandler = (e: KeyboardEvent) => void;

interface Shortcut {
	key: string;
	ctrl?: boolean;
	meta?: boolean;
	handler: ShortcutHandler;
	description: string;
}

/**
 * Returns true if the keyboard event should be ignored
 * because the user is typing in an input/textarea/editor.
 */
export function isInputFocused(): boolean {
	const tag = document.activeElement?.tagName?.toLowerCase();
	const editable = document.activeElement?.getAttribute('contenteditable');
	return (
		tag === 'input' ||
		tag === 'textarea' ||
		tag === 'select' ||
		editable === '' ||
		editable === 'true'
	);
}

/**
 * Register global keyboard shortcuts.
 * Returns a cleanup function to remove the listener.
 */
export function registerShortcuts(shortcuts: Shortcut[]): () => void {
	const handler = (e: KeyboardEvent) => {
		for (const s of shortcuts) {
			const ctrlMatch = s.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
			if (e.key === s.key && ctrlMatch) {
				s.handler(e);
				return;
			}
		}
	};

	window.addEventListener('keydown', handler);
	return () => window.removeEventListener('keydown', handler);
}
