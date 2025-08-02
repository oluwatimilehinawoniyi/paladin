import { writable } from 'svelte/store';
import type { ComponentType } from 'svelte';

export interface ModalConfig {
	id: string;
	component: ComponentType | (() => Promise<{ default: ComponentType }>);
	props?: Record<string, unknown>;
	options?: {
		closeOnEscape?: boolean;
		closeOnBackdrop?: boolean;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		position?: 'center' | 'top' | 'bottom';
	};
}

interface ModalStore {
	modals: ModalConfig[];
}

function createModalStore() {
	const { subscribe, set, update } = writable<ModalStore>({ modals: [] });

	return {
		subscribe,

		// Open a new modal
		open: (config: Omit<ModalConfig, 'id'>) => {
			const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const modalConfig: ModalConfig = {
				id,
				...config,
				options: {
					closeOnEscape: true,
					closeOnBackdrop: true,
					size: 'md',
					position: 'center',
					...config.options
				}
			};

			update((store) => ({
				modals: [...store.modals, modalConfig]
			}));

			return id;
		},

		// Close a specific modal by ID
		close: (id: string) => {
			update((store) => ({
				modals: store.modals.filter((modal) => modal.id !== id)
			}));
		},

		// Close the topmost modal
		closeTop: () => {
			update((store) => ({
				modals: store.modals.slice(0, -1)
			}));
		},

		// Close all modals
		closeAll: () => {
			set({ modals: [] });
		},

		// Update modal props
		updateProps: (id: string, newProps: Record<string, unknown>) => {
			update((store) => ({
				modals: store.modals.map((modal) =>
					modal.id === id ? { ...modal, props: { ...modal.props, ...newProps } } : modal
				)
			}));
		}
	};
}

export const modalStore = createModalStore();
