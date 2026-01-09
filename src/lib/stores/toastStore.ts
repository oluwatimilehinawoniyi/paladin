import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	return {
		subscribe,
		add: (message: string, type: ToastType = 'info', duration: number = 3000) => {
			const id = Math.random().toString(36).substring(2);
			const toast = { id, message, type, duration };

			update((toasts) => [...toasts, toast]);

			if (duration > 0) {
				setTimeout(() => {
					update((toasts) => toasts.filter((t) => t.id !== id));
				}, duration);
			}
		},
		remove: (id: string) => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		}
	};
}

export const toastStore = createToastStore();
