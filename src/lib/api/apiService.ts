/* eslint-disable @typescript-eslint/no-explicit-any */
import { tokenService } from '$lib/services/tokenService';
import { browser } from '$app/environment';
import type { NotificationDTO, PaginatedResponse } from '$lib/types/notification.types';

export const API_CONFIG = {
	baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
	apiURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
	oauthURL: import.meta.env.VITE_OAUTH_URL || 'http://localhost:8080/oauth2/authorization/google',
	timeout: 30000,
	withCredentials: true
} as const;

const API_BASE_URL = API_CONFIG.baseURL;

export interface UnreadCountResponse {
	unreadCount: number;
}

export interface MarkAsReadResponse {
	message: string;
}

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

export interface FeatureRequest {
	id: string;
	userId: string;
	userEmail: string;
	title: string;
	description: string;
	category: string;
	categoryDisplayName: string;
	status: string;
	statusDisplayName: string;
	adminResponse: string | null;
	voteCount: number;
	hasVoted: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateFeatureRequestDTO {
	title: string;
	description: string;
	category: string;
}

class ApiService {
	private isRefreshing = false;
	private refreshSubscribers: Array<(token: string) => void> = [];
	private refreshAttempts = 0;
	private readonly MAX_REFRESH_ATTEMPTS = 3;

	/**
	 * Get base fetch configuration with proper CORS settings
	 */
	private getBaseFetchConfig(): RequestInit {
		return {
			mode: 'cors',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			}
		};
	}

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

		if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS) {
			console.error('Max refresh attempts exceeded');
			this.refreshAttempts = 0;
			return null;
		}

		this.refreshAttempts++;

		try {
			console.log(
				`Attempting token refresh (attempt ${this.refreshAttempts}/${this.MAX_REFRESH_ATTEMPTS})...`
			);

			const baseFetchConfig = this.getBaseFetchConfig();

			const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
				...baseFetchConfig,
				method: 'POST',
				body: JSON.stringify({ refreshToken })
			});

			if (!response.ok) {
				console.error('❌ Token refresh failed with status:', response.status);

				// Check if it's a CORS error
				if (response.type === 'opaque' || response.status === 0) {
					console.error('❌ CORS error detected during token refresh');
				}

				throw new Error(`Failed to refresh token: ${response.status}`);
			}

			const data = await response.json();
			const { accessToken, refreshToken: newRefreshToken } = data.data;

			// Store new tokens
			tokenService.setTokens(accessToken, newRefreshToken);

			this.refreshAttempts = 0;

			console.log('Token refreshed successfully');

			return accessToken;
		} catch (error: any) {
			console.error('Token refresh failed:', error);

			if (error instanceof TypeError && error.message.includes('fetch')) {
				console.error('Network/CORS error during token refresh');
			}

			if (this.refreshAttempts >= this.MAX_REFRESH_ATTEMPTS || error.message.includes('401')) {
				console.error('Clearing tokens and redirecting to login');
				tokenService.clearTokens();
				this.refreshAttempts = 0;

				if (browser) {
					window.location.href = '/auth/login?session=expired';
				}
			}

			return null;
		}
	}

	/**
	 * Handle token refresh with queue
	 */
	private async handleTokenRefresh(): Promise<string | null> {
		// If already refreshing, wait for it to complete
		if (this.isRefreshing) {
			console.log('⏳ Token refresh already in progress, queuing request...');
			return new Promise((resolve) => {
				this.refreshSubscribers.push((token: string) => {
					resolve(token || null);
				});
			});
		}

		// Start refresh process
		this.isRefreshing = true;
		console.log('🔄 Starting token refresh process...');

		const newToken = await this.refreshAccessToken();

		this.isRefreshing = false;

		// Notify all subscribers (queued requests)
		if (this.refreshSubscribers.length > 0) {
			console.log(`📢 Notifying ${this.refreshSubscribers.length} queued requests...`);
			this.refreshSubscribers.forEach((callback) => callback(newToken || ''));
			this.refreshSubscribers = [];
		}

		return newToken;
	}

	/**
	 * Public method to manually refresh token
	 * Used by background refresh hook
	 */
	async refreshToken(): Promise<void> {
		console.log('refreshing token');
		const newToken = await this.handleTokenRefresh();

		if (!newToken) {
			throw new Error('Token refresh failed');
		}
	}

	/**
	 * Make authenticated API request
	 */
	private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
		// Check if token needs refresh before making request
		if (tokenService.shouldRefreshToken(10)) {
			console.log('Token expiring soon, refreshing...');
			await this.handleTokenRefresh();
		}

		try {
			const baseFetchConfig = this.getBaseFetchConfig();

			const response = await fetch(`${API_BASE_URL}${url}`, {
				...baseFetchConfig,
				...options,
				headers: {
					...baseFetchConfig.headers,
					...this.getAuthHeaders(),
					...(options.headers || {})
				}
			});

			// Handle 401 - Try to refresh token once
			if (response.status === 401) {
				console.log('Received 401, attempting token refresh...');
				const newToken = await this.handleTokenRefresh();

				if (newToken) {
					// Retry request with new token
					const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
						...baseFetchConfig,
						...options,
						headers: {
							...baseFetchConfig.headers,
							...this.getAuthHeaders(),
							...(options.headers || {})
						}
					});

					return this.handleResponse<T>(retryResponse);
				} else {
					throw new Error('Authentication failed');
				}
			}

			return this.handleResponse<T>(response);
		} catch (error: any) {
			if (error instanceof TypeError && error.message.includes('fetch')) {
				throw new Error('Network error - please check your connection');
			}

			// Handle CORS errors
			if (error.message && error.message.toLowerCase().includes('cors')) {
				console.error('CORS error detected:', error);
				throw new Error('Connection error - please try again');
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
					window.location.href = '/auth/login?session=expired';
				}
				throw new Error('Authentication required');
			}

			const errorMessage =
				typeof responseData === 'object'
					? responseData.message || responseData.error || 'Request failed'
					: responseData || 'Request failed';

			throw new Error(errorMessage);
		}

		return responseData as T;
	}

	// ==================== PUBLIC API METHODS ====================

	/**
	 * GET request
	 */
	async get<T>(url: string): Promise<T> {
		return this.makeRequest<T>(url, { method: 'GET' });
	}

	/**
	 * POST request
	 */
	async post<T>(url: string, data?: any): Promise<T> {
		return this.makeRequest<T>(url, {
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined
		});
	}

	/**
	 * PUT request
	 */
	async put<T>(url: string, data: any): Promise<T> {
		return this.makeRequest<T>(url, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	/**
	 * PATCH request
	 */
	async patch<T>(url: string, data: any): Promise<T> {
		return this.makeRequest<T>(url, {
			method: 'PATCH',
			body: JSON.stringify(data)
		});
	}

	/**
	 * DELETE request
	 */
	async delete<T>(url: string): Promise<T> {
		return this.makeRequest<T>(url, { method: 'DELETE' });
	}

	/**
	 * Upload file with multipart/form-data
	 */
	async upload<T>(url: string, formData: FormData): Promise<T> {
		const token = tokenService.getAccessToken();
		const baseFetchConfig = this.getBaseFetchConfig();

		try {
			const response = await fetch(`${API_BASE_URL}${url}`, {
				...baseFetchConfig,
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});

			// Handle 401
			if (response.status === 401) {
				const newToken = await this.handleTokenRefresh();
				if (newToken) {
					const retryResponse = await fetch(`${API_BASE_URL}${url}`, {
						...baseFetchConfig,
						method: 'POST',
						headers: {
							Authorization: `Bearer ${newToken}`
						},
						body: formData
					});
					return this.handleResponse<T>(retryResponse);
				}
			}

			return this.handleResponse<T>(response);
		} catch (error: any) {
			if (error instanceof TypeError && error.message.includes('fetch')) {
				throw new Error('Network error - please check your connection');
			}
			throw error;
		}
	}

	// Auth endpoints
	async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
		return this.get<ApiResponse<{ user: User }>>('/auth/me');
	}

	async logout(): Promise<void> {
		try {
			await this.post('/auth/logout');
		} finally {
			tokenService.clearTokens();
			if (browser) {
				window.location.href = '/auth/login';
			}
		}
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

	// async createProfile(data: ProfileCreateRequest): Promise<ApiResponse<ProfileResponse>> {
	// 	return this.post<ApiResponse<ProfileResponse>>('/profiles', data);
	// }

	async getProfiles(): Promise<ApiResponse<ProfileResponse[]>> {
		return this.get<ApiResponse<ProfileResponse[]>>('/v1/profiles/me');
	}

	async getProfile(id: string): Promise<ApiResponse<ProfileResponse>> {
		return this.get<ApiResponse<ProfileResponse>>(`/v1/profiles/${id}`);
	}

	// async updateProfile(profileId: string, profileData: any): Promise<ApiResponse<any>> {
	// 	return this.makeRequest(`/v1/profiles/${profileId}`, {
	// 		method: 'PATCH',
	// 		body: JSON.stringify(profileData)
	// 	});
	// }

	async updateProfile(
		id: string,
		data: Partial<ProfileCreateRequest>
	): Promise<ApiResponse<ProfileResponse>> {
		return this.put<ApiResponse<ProfileResponse>>(`/v1/profiles/${id}`, data);
	}

	async deleteProfile(id: string): Promise<void> {
		await this.delete(`/v1/profiles/${id}`);
	}

	// async deleteProfile(profileId: string): Promise<ApiResponse<string>> {
	// 	return this.makeRequest(`/v1/profiles/${profileId}`, {
	// 		method: 'DELETE'
	// 	});
	// }

	// CV Management

	async uploadCV(profileId: string, file: File): Promise<ApiResponse<any>> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('profileId', profileId);

		return this.upload<ApiResponse<any>>('/v1/cv/upload', formData);
	}

	async deleteCV(cvId: string): Promise<void> {
		await this.delete(`/v1/cv/${cvId}`);
	}

	// async uploadCV(file: File, profileId: string): Promise<ApiResponse<any>> {
	// 	const formData = new FormData();
	// 	formData.append('file', file);
	// 	formData.append('profileId', profileId);

	// 	const token = tokenService.getAccessToken();
	// 	const response = await fetch(`${API_BASE_URL}/v1/cv/upload`, {
	// 		method: 'POST',
	// 		headers: {
	// 			Authorization: `Bearer ${token}`
	// 		},
	// 		body: formData
	// 	});

	// 	if (!response.ok) {
	// 		if (response.status === 401) {
	// 			if (browser) {
	// 				window.location.href = '/auth/login';
	// 			}
	// 			throw new Error('Authentication required');
	// 		}
	// 		const error = await response.text();
	// 		throw new Error(`CV Upload Error: ${response.status} - ${error}`);
	// 	}

	// 	return response.json();
	// }

	// async deleteCV(cvId: string): Promise<ApiResponse<string>> {
	// 	return this.makeRequest(`/v1/cv/${cvId}`, {
	// 		method: 'DELETE'
	// 	});
	// }

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

	/**
	 * Feature Request Management
	 */

	// Create a new feature request
	// async createFeatureRequest(data: CreateFeatureRequestDTO): Promise<ApiResponse<FeatureRequest>> {
	// 	return this.makeRequest('/v1/feature-requests', {
	// 		method: 'POST',
	// 		body: JSON.stringify(data)
	// 	});
	// }

	// // Get all feature requests
	// async getFeatureRequests(status?: string): Promise<ApiResponse<FeatureRequest[]>> {
	// 	const url = status ? `/v1/feature-requests?status=${status}` : '/v1/feature-requests';
	// 	return this.makeRequest(url);
	// }

	// Get single feature request
	async getFeatureRequest(id: string): Promise<ApiResponse<FeatureRequest>> {
		return this.makeRequest(`/v1/feature-requests/${id}`);
	}

	// Get user's own feature requests
	async getMyFeatureRequests(): Promise<ApiResponse<FeatureRequest[]>> {
		return this.makeRequest('/v1/feature-requests/my-requests');
	}

	// Update feature request (only if PENDING)
	async updateFeatureRequest(
		id: string,
		data: CreateFeatureRequestDTO
	): Promise<ApiResponse<FeatureRequest>> {
		return this.makeRequest(`/v1/feature-requests/${id}`, {
			method: 'PUT',
			body: JSON.stringify(data)
		});
	}

	// Delete feature request (only if PENDING)
	async deleteFeatureRequest(id: string): Promise<void> {
		return this.makeRequest(`/v1/feature-requests/${id}`, {
			method: 'DELETE'
		});
	}

	// Upvote a feature request
	async upvoteFeatureRequest(id: string): Promise<{ message: string; totalVotes: number }> {
		return this.makeRequest(`/v1/feature-requests/${id}/upvote`, {
			method: 'POST'
		});
	}

	// Remove upvote
	async removeUpvote(id: string): Promise<{ message: string; totalVotes: number }> {
		return this.makeRequest(`/v1/feature-requests/${id}/upvote`, {
			method: 'DELETE'
		});
	}

	async getFeatureRequests(): Promise<ApiResponse<FeatureRequest[]>> {
		return this.get<ApiResponse<FeatureRequest[]>>('/v1/feature-requests');
	}

	async createFeatureRequest(data: CreateFeatureRequestDTO): Promise<ApiResponse<FeatureRequest>> {
		return this.post<ApiResponse<FeatureRequest>>('/v1/feature-requests', data);
	}

	async voteFeatureRequest(id: string): Promise<ApiResponse<FeatureRequest>> {
		return this.post<ApiResponse<FeatureRequest>>(`/v1/feature-requests/${id}/upvote`);
	}

	async unvoteFeatureRequest(id: string): Promise<ApiResponse<FeatureRequest>> {
		return this.delete<ApiResponse<FeatureRequest>>(`/v1/feature-requests/${id}/upvote`);
	}

	// Check if user has voted
	async hasUserVoted(id: string): Promise<{ hasVoted: boolean }> {
		return this.makeRequest(`/v1/feature-requests/${id}/my-vote`);
	}

	/**
	 * ============================================
	 * NOTIFICATION MANAGEMENT
	 * ============================================
	 */

	/**
	 * Get paginated notifications
	 * @param page - Page number (0-indexed)
	 * @param size - Number of items per page
	 */
	async getNotifications(
		page: number = 0,
		size: number = 20
	): Promise<ApiResponse<PaginatedResponse<NotificationDTO>>> {
		return this.makeRequest(`/v1/notifications?page=${page}&size=${size}`);
	}

	/**
	 * Get only unread notifications
	 */
	async getUnreadNotifications(): Promise<ApiResponse<NotificationDTO[]>> {
		return this.makeRequest('/v1/notifications/unread');
	}

	/**
	 * Get unread notification count (for badge)
	 */
	async getUnreadNotificationCount(): Promise<ApiResponse<UnreadCountResponse>> {
		return this.makeRequest('/v1/notifications/unread-count');
	}

	/**
	 * Mark a single notification as read
	 * @param id - Notification ID
	 */
	async markNotificationAsRead(id: string): Promise<ApiResponse<MarkAsReadResponse>> {
		return this.makeRequest(`/v1/notifications/${id}/read`, {
			method: 'PATCH'
		});
	}

	/**
	 * Mark all notifications as read
	 */
	async markAllNotificationsAsRead(): Promise<ApiResponse<MarkAsReadResponse>> {
		return this.makeRequest('/v1/notifications/read-all', {
			method: 'PATCH'
		});
	}
}

export const apiService = new ApiService();
