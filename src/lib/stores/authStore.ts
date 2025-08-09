import { writable } from 'svelte/store';
import { apiService, type User } from '$lib/api/apiService';
import { browser } from '$app/environment';

interface AuthState {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		isLoading: true,
		isAuthenticated: false
	});

	return {
		subscribe,

		// Initialize auth state on app load
		async init() {
			if (!browser) return;

			try {
				update((state) => ({ ...state, isLoading: true }));
				const response = await apiService.getCurrentUser();
				const user = response.data.user || response.data;

				set({
					user,
					isLoading: false,
					isAuthenticated: true
				});
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				console.log('User not authenticated');
				set({
					user: null,
					isLoading: false,
					isAuthenticated: false
				});
			}
		},

		// Logout user
		async logout() {
			try {
				await apiService.logout();
			} catch (error) {
				console.error('Logout error:', error);
			} finally {
				set({
					user: null,
					isLoading: false,
					isAuthenticated: false
				});

				if (browser) {
					window.location.href = '/login';
				}
			}
		},

		// Update user profile
		async updateProfile(userData: { firstName?: string; lastName?: string }) {
			const response = await apiService.updateUserProfile(userData);
			const updatedUser = response.data;

			update((state) => ({
				...state,
				user: updatedUser
			}));

			return { success: true, data: response };
		},

		clear() {
			set({
				user: null,
				isLoading: false,
				isAuthenticated: false
			});
		}
	};
}

export const authStore = createAuthStore();
