import { vi } from 'vitest';

const localStorageMock = {
	getItem: vi.fn(() => null),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};

Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock,
	writable: true
});

Object.defineProperty(globalThis, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		addEventListener: vi.fn(),
		removeListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
});

class MockResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
	value: MockResizeObserver,
	writable: true
});
