import { writable } from 'svelte/store';
import { apiService, type JobAnalysisResponse } from '$lib/api/apiService';

interface JobAnalysisState {
	jobAnalysis: JobAnalysisResponse | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: JobAnalysisState = {
	jobAnalysis: null,
	isLoading: false,
	error: null
};

function createJobAnalysisStore() {
	const { subscribe, set, update } = writable<JobAnalysisState>(initialState);

	return {
		subscribe,
		// request analysis
		async analyzeJobDescription(profileId: string, jobDescription: string) {
			update((state) => ({ ...state, isLoading: true, error: null }));
			try {
				const response = await apiService.analyseJobDescription({
					profileId,
					jobDescription
				});
				update((state) => ({
					...state,
					jobAnalysis: response.data,
					isLoading: false
				}));
				return response.data;
			} catch (error) {
				console.error('Failed to analyze job description:', error);
				update((state) => ({
					...state,
					error: error instanceof Error ? error.message : 'Failed to analyze job description',
					isLoading: false
				}));
			}
		},
		reset() {
			set(initialState);
		}
	};
}

export const jobAnalysisStore = createJobAnalysisStore();
