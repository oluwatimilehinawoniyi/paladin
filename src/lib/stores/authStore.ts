/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/stores/authStore.ts (UPDATED for JWT)

import { writable } from 'svelte/store';
import { apiService, type User } from '$lib/api/apiService';
import { tokenService } from '$lib/services/tokenService';
import { browser } from '$app/environment';

interface AuthState {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	isInitialized: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		user: null,
		isLoading: false,
		isAuthenticated: false,
		isInitialized: false
	});

	return {
		subscribe,

		// Set user data directly (used by layout)
		setUser(user: User) {
			set({
				user,
				isLoading: false,
				isAuthenticated: true,
				isInitialized: true
			});
		},

		// Initialize auth state on app load
		async init() {
			if (!browser) return;

			// Don't initialize multiple times
			const currentState = get(authStore);
			if (currentState.isInitialized) {
				return;
			}

			try {
				update((state) => ({ ...state, isLoading: true }));

				// Check if tokens exist
				if (!tokenService.hasTokens()) {
					set({
						user: null,
						isLoading: false,
						isAuthenticated: false,
						isInitialized: true
					});
					return;
				}

				// Verify tokens are valid by fetching user
				const response = await apiService.getCurrentUser();
				const user = response.data.user || response.data;

				set({
					user,
					isLoading: false,
					isAuthenticated: true,
					isInitialized: true
				});
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				// Clear invalid tokens
				tokenService.clearTokens();

				set({
					user: null,
					isLoading: false,
					isAuthenticated: false,
					isInitialized: true
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
				// Clear tokens from storage
				tokenService.clearTokens();

				set({
					user: null,
					isLoading: false,
					isAuthenticated: false,
					isInitialized: true
				});

				if (browser) {
					window.location.href = '/auth/login';
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

		// Clear auth state
		clear() {
			tokenService.clearTokens();
			set({
				user: null,
				isLoading: false,
				isAuthenticated: false,
				isInitialized: false
			});
		}
	};
}

export const authStore = createAuthStore();

// Helper function to get current state
function get(store: any) {
	let value: any;
	store.subscribe((val: any) => (value = val))();
	return value;
}
