/* eslint-disable @typescript-eslint/no-explicit-any */
import { tokenService } from '$lib/services/tokenService';
import { browser } from '$app/environment';

export const API_CONFIG = {
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
	apiURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
	oauthURL: import.meta.env.VITE_OAUTH_URL || 'http://localhost:8080/oauth2/authorization/google',
	timeout: 30000,
	withCredentials: true
} as const;

const API_BASE_URL = API_CONFIG.baseURL;

export interface ProfileCreateRequest {
	title: string;
	summary: string;
	skills: string[];
	cvId?: string;
}

export interface ProfileResponse {
	id: string;
	title: string;
	summary: string;
	skills: string[];
	cv?: {
		id: string;
		fileName: string;
		url: string;
		contentType: string;
		size: number;
		uploadedAt: string;
	};
	createdAt: string;
	updatedAt?: string;
}

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	createdAt?: string;
}

export interface AuthResponse {
	user: User;
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}

export interface ApiResponse<T> {
	message: string;
	httpStatus: string;
	data: T;
}

export interface JobAnalysisRequest {
	profileId: string;
	jobDescription: string;
}

export interface JobAnalysisResponse {
	jobDetails: {
		company: string;
		position: string;
		email: string;
		requirements: string[];
		keySkills: string[];
		experienceLevel: string;
		location?: string;
		salary?: string;
	};
	coverLetter: string;
	matchAnalysis: {
		overallMatchPercentage: number;
		matchingSkills: string[];
		missingSkills: string[];
		strengths: string[];
		weaknesses: string[];
		recommendation: string;
		confidenceLevel: 'High' | 'Medium' | 'Low';
	};
}

export interface GenerateTemplateProps {
	companyName: string;
	candidateName: string;
	position: string;
}

export type ApplicationStatus = 'SENT' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED' | 'FOLLOW_UP';

export interface Application {
	id: string;
	company: string;
	jobEmail: string;
	jobTitle: string;
	profile: string;
	status: ApplicationStatus;
	sentAt: string;
}
class ApiService {
	private isRefreshing = false;
	private refreshSubscribers: Array<(token: string) => void> = [];

	/**
	 * Get Authorization header with JWT token
	 */
	private getAuthHeaders(): HeadersInit {
		const token = tokenService.getAccessToken();
		const headers: HeadersInit = {
			'Content-Type': 'application/json'
		};

		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}

		return headers;
	}

	/**
	 * Refresh the access token
	 */
	private async refreshAccessToken(): Promise<string | null> {
		const refreshToken = tokenService.getRefreshToken();

		if (!refreshToken) {
			console.error('No refresh token available');
			return null;
		}

		try {
			const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ refreshToken })
			});

			if (!response.ok) {
				throw new Error('Failed to refresh token');
			}

			const data = await response.json();
			const { accessToken, refreshToken: newRefreshToken } = data.data;

			// Store new tokens
			tokenService.setTokens(accessToken, newRefreshToken);
			console.log('Token refreshed successfully');

			return accessToken;
		} catch (error) {
			console.error('Token refresh failed:', error);
			// Clear tokens and redirect to login
			tokenService.clearTokens();
			if (browser) {
				window.location.href = '/auth/login';
			}
			return null;
		}
	}

	/**
	 * Handle token refresh with queue
	 */
	private async handleTokenRefresh(): Promise<string | null> {
		if (!this.isRefreshing) {
			this.isRefreshing = true;
			const newToken = await this.refreshAccessToken();
			this.isRefreshing = false;

			// Notify all subscribers
			this.refreshSubscribers.forEach((callback) => callback(newToken || ''));
			this.refreshSubscribers = [];

			return newToken;
		}

		// If already refreshing, wait for it to complete
		return new Promise((resolve) => {
			this.refreshSubscribers.push((token: string) => {
				resolve(token);
			});
		});
	}

	/**
	 * Make authenticated API request
	 */
	private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
		// Check if token needs refresh before making request
		if (tokenService.shouldRefreshToken()) {
			console.log('Token expiring soon, refreshing...');
			await this.handleTokenRefresh();
		}

		try {
			const response = await fetch(`${API_BASE_URL}${url}`, {
				headers: this.getAuthHeaders(),
				...options
			});

			// Handle 401 - Try to refresh token once
			if (response.status === 401) {
				console.log('Received 401, attempting token refresh...');
				const newToken = await this.handleTokenRefresh();

				if (newToken) {
					// Retry request with new token
					const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
						headers: this.getAuthHeaders(),
						...options
					});

					return this.handleResponse<T>(retryResponse);
				} else {
					throw new Error('Authentication failed');
				}
			}

			return this.handleResponse<T>(response);
		} catch (error) {
			if (error instanceof TypeError && error.message.includes('fetch')) {
				throw new Error('Network error - please check your connection');
			}
			throw error;
		}
	}

	/**
	 * Handle API response
	 */
	private async handleResponse<T>(response: Response): Promise<T> {
		const contentType = response.headers.get('content-type');
		let responseData;

		if (response.status === 204) {
			responseData = { message: 'Success', data: null };
		} else if (contentType && contentType.includes('application/json')) {
			responseData = await response.json();
		} else {
			responseData = await response.text();
		}

		if (!response.ok) {
			if (response.status === 401) {
				if (browser) {
					tokenService.clearTokens();
					window.location.href = '/auth/login';
				}
				throw new Error('Authentication required');
			}

			const errorMessage =
				typeof responseData === 'object'
					? responseData.message || `HTTP ${response.status}`
					: responseData;
			throw new Error(`API Error: ${response.status} - ${errorMessage}`);
		}

		return responseData;
	}

	// Auth endpoints
	async getCurrentUser(): Promise<ApiResponse<any>> {
		return this.makeRequest('/auth/me');
	}

	async logout(): Promise<ApiResponse<any>> {
		const result = await this.makeRequest('/auth/logout', {
			method: 'POST'
		});
		tokenService.clearTokens();
		return result;
	}

	async checkAuth(): Promise<boolean> {
		try {
			if (!tokenService.hasTokens()) {
				return false;
			}
			await this.getCurrentUser();
			return true;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			return false;
		}
	}

	// Profile Management
	async createProfileWithCV(
		title: string,
		summary: string,
		skills: string[],
		cvFile: File
	): Promise<ApiResponse<any>> {
		const formData = new FormData();
		formData.append('title', title);
		formData.append('summary', summary);
		formData.append('skills', JSON.stringify(skills));
		formData.append('file', cvFile);

		const token = tokenService.getAccessToken();
		const response = await fetch(`${API_BASE_URL}/v1/profiles`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: formData
		});

		if (!response.ok) {
			if (response.status === 401) {
				if (browser) {
					window.location.href = '/auth/login';
				}
				throw new Error('Authentication required');
			}
			const error = await response.text();
			throw new Error(`Profile Creation Error: ${response.status} - ${error}`);
		}

		return response.json();
	}

	async getProfiles(): Promise<ApiResponse<any[]>> {
		return this.makeRequest('/v1/profiles/me');
	}

	async getProfile(profileId: string): Promise<ApiResponse<any>> {
		return this.makeRequest(`/v1/profiles/${profileId}`);
	}

	async updateProfile(profileId: string, profileData: any): Promise<ApiResponse<any>> {
		return this.makeRequest(`/v1/profiles/${profileId}`, {
			method: 'PATCH',
			body: JSON.stringify(profileData)
		});
	}

	async deleteProfile(profileId: string): Promise<ApiResponse<string>> {
		return this.makeRequest(`/v1/profiles/${profileId}`, {
			method: 'DELETE'
		});
	}

	// CV Management
	async uploadCV(file: File, profileId: string): Promise<ApiResponse<any>> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('profileId', profileId);

		const token = tokenService.getAccessToken();
		const response = await fetch(`${API_BASE_URL}/v1/cv/upload`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: formData
		});

		if (!response.ok) {
			if (response.status === 401) {
				if (browser) {
					window.location.href = '/auth/login';
				}
				throw new Error('Authentication required');
			}
			const error = await response.text();
			throw new Error(`CV Upload Error: ${response.status} - ${error}`);
		}

		return response.json();
	}

	async deleteCV(cvId: string): Promise<ApiResponse<string>> {
		return this.makeRequest(`/v1/cv/${cvId}`, {
			method: 'DELETE'
		});
	}

	async downloadCV(cvId: string): Promise<Blob> {
		const token = tokenService.getAccessToken();
		const response = await fetch(`${API_BASE_URL}/v1/cv/${cvId}/download`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			if (response.status === 401) {
				if (browser) {
					window.location.href = '/auth/login';
				}
				throw new Error('Authentication required');
			}
			throw new Error(`Download Error: ${response.status}`);
		}

		return response.blob();
	}

	// Job Applications
	async sendJobApplication(applicationData: any): Promise<ApiResponse<any>> {
		return this.makeRequest('/v1/job-applications/send', {
			method: 'POST',
			body: JSON.stringify(applicationData)
		});
	}

	async getMyApplications(): Promise<ApiResponse<any[]>> {
		return this.makeRequest('/v1/job-applications/me');
	}

	async updateApplicationStatus(applicationId: string, status: string): Promise<ApiResponse<any>> {
		return this.makeRequest(`/v1/job-applications/${applicationId}/status`, {
			method: 'PATCH',
			body: JSON.stringify(status)
		});
	}

	async analyseJobDescription(data: any): Promise<ApiResponse<any>> {
		return this.makeRequest(`/v1/job-applications/analyze-application`, {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	async generateTemplateCoverLetter(category: string, props: any): Promise<ApiResponse<string>> {
		const encodedCategory = encodeURIComponent(category);
		const response = await fetch(
			`${API_BASE_URL}/v1/cover-letters/generate/${encodedCategory}?candidateName=${props.candidateName}&companyName=${props.companyName}&position=${props.position}`,
			{
				method: 'GET',
				headers: this.getAuthHeaders()
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}
		return response.json();
	}

	// User Management
	async updateUserProfile(userData: {
		firstName?: string;
		lastName?: string;
	}): Promise<ApiResponse<User>> {
		return this.makeRequest('/v1/users/me', {
			method: 'PUT',
			body: JSON.stringify(userData)
		});
	}

	async deleteAccount(): Promise<ApiResponse<any>> {
		return this.makeRequest('/v1/users/me', {
			method: 'DELETE'
		});
	}
}

export const apiService = new ApiService();
