import { writable } from 'svelte/store';
import { apiService, type ProfileResponse } from '$lib/api/apiService';

interface ProfilesState {
	profiles: ProfileResponse[];
	isLoading: boolean;
	error: string | null;
}

const initialState: ProfilesState = {
	profiles: [],
	isLoading: false,
	error: null
};

function createProfilesStore() {
	const { subscribe, set, update } = writable<ProfilesState>(initialState);

	return {
		subscribe,

		// Load all profiles
		async loadProfiles() {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await apiService.getProfiles();
				update((state) => ({
					...state,
					profiles: response.data,
					isLoading: false
				}));
			} catch (error) {
				console.error('Failed to load profiles:', error);
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : 'Failed to load profiles',
					isLoading: false
				}));
			}
		},

		// Create new profile
		async createProfile(profileData: {
			title: string;
			summary: string;
			skills: string[];
			cvFile?: File;
		}) {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				let response;

				if (profileData.cvFile) {
					// Create profile with CV
					response = await apiService.createProfileWithCV(
						profileData.title,
						profileData.summary,
						profileData.skills,
						profileData.cvFile
					);
				} else {
					// Create profile without CV
					response = await apiService.createProfile({
						title: profileData.title,
						summary: profileData.summary,
						skills: profileData.skills
					});
				}

				// Add new profile to the store
				update((state) => ({
					...state,
					profiles: [...state.profiles, response.data],
					isLoading: false
				}));

				return response.data;
			} catch (error) {
				console.error('Failed to create profile:', error);
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : 'Failed to create profile',
					isLoading: false
				}));
				throw error;
			}
		},

		// Update existing profile
		async updateProfile(
			profileId: string,
			profileData: {
				title?: string;
				summary?: string;
				skills?: string[];
			}
		) {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				const response = await apiService.updateProfile(profileId, profileData);

				// Update profile in the store
				update((state) => ({
					...state,
					profiles: state.profiles.map((profile) =>
						profile.id === profileId ? response.data : profile
					),
					isLoading: false
				}));

				return response.data;
			} catch (error) {
				console.error('Failed to update profile:', error);
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : 'Failed to update profile',
					isLoading: false
				}));
				throw error;
			}
		},

		// Delete profile
		async deleteProfile(profileId: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				await apiService.deleteProfile(profileId);

				// Remove profile from the store
				update((state) => ({
					...state,
					profiles: state.profiles.filter((profile) => profile.id !== profileId),
					isLoading: false
				}));
			} catch (error) {
				console.error('Failed to delete profile:', error);
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : 'Failed to delete profile',
					isLoading: false
				}));
				throw error;
			}
		},

		// Download CV
		async downloadCV(cvId: string, fileName: string) {
			try {
				const blob = await apiService.downloadCV(cvId);

				// Create download link
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			} catch (error) {
				console.error('Failed to download CV:', error);
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : 'Failed to download CV'
				}));
				throw error;
			}
		},

		// Delete CV
		async deleteCV(cvId: string, profileId: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));

			try {
				await apiService.deleteCV(cvId);

				// Update profile to remove CV reference
				update((state) => ({
					...state,
					profiles: state.profiles.map((profile) =>
						profile.id === profileId ? { ...profile, cv: undefined } : profile
					),
					isLoading: false
				}));
			} catch (error) {
				console.error('Failed to delete CV:', error);
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : 'Failed to delete CV',
					isLoading: false
				}));
				throw error;
			}
		},

		// Replace/Add CV for a profile
		async replaceCVForProfile(profileId: string, file: File) {
			try {
				const response = await apiService.uploadCV(file, profileId);

				update((state) => ({
					...state,
					profiles: state.profiles.map((profile) =>
						profile.id === profileId ? { ...profile, cv: response.data } : profile
					)
				}));

				return response.data;
			} catch (error) {
				console.error('Failed to replace CV:', error);
				throw error;
			}
		},

		// Clear error
		clearError() {
			update((state) => ({ ...state, error: null }));
		},

		// Reset store
		reset() {
			set(initialState);
		}
	};
}

export const profilesStore = createProfilesStore();
