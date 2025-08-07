/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = 'http://localhost:8080/api';

export interface ProfileCreateRequest {
	title: string;
	summary: string;
	skills: string[];
	cvId?: string;
}

export interface ProfileResponse {
	message: string;
	data: [
		{
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
		}
	];
	httpStatus: string;
}

export interface ApiResponse<T> {
	message: string;
	httpStatus: string;
	data: T;
}

class ApiService {
	private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
		const response = await fetch(`${API_BASE_URL}${url}`, {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			...options
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`API Error: ${response.status} - ${error}`);
		}

		return response.json();
	}

	async createProfileWithCV(
		title: string,
		summary: string,
		skills: string[],
		cvFile: File
	): Promise<ApiResponse<ProfileResponse>> {
		const formData = new FormData();
		formData.append('title', title);
		formData.append('summary', summary);
		formData.append('skills', JSON.stringify(skills));
		formData.append('file', cvFile);

		const response = await fetch(`${API_BASE_URL}/v1/profiles`, {
			method: 'POST',
			credentials: 'include',
			body: formData
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`Profile Creation Error: ${response.status} - ${error}`);
		}

		return response.json();
	}

	// Profile Management
	async createProfile(profileData: ProfileCreateRequest): Promise<ApiResponse<ProfileResponse>> {
		return this.makeRequest('/v1/profiles', {
			method: 'POST',
			body: JSON.stringify(profileData)
		});
	}

	async getProfiles(): Promise<ApiResponse<ProfileResponse[]>> {
		return this.makeRequest('/v1/profiles/me');
	}

	async updateProfile(
		profileId: string,
		profileData: Partial<ProfileCreateRequest>
	): Promise<ApiResponse<ProfileResponse>> {
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

		const response = await fetch(`${API_BASE_URL}/v1/cv/upload`, {
			method: 'POST',
			credentials: 'include',
			body: formData
		});

		if (!response.ok) {
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
		const response = await fetch(`${API_BASE_URL}/v1/cv/${cvId}/download`, {
			credentials: 'include'
		});

		if (!response.ok) {
			throw new Error(`Download Error: ${response.status}`);
		}

		return response.blob();
	}

	// Job Applications
	async sendJobApplication(applicationData: {
		profileId: string;
		jobEmail: string;
		subject: string;
		bodyText: string;
		company: string;
		jobTitle: string;
	}): Promise<ApiResponse<any>> {
		return this.makeRequest('/v1/job-applications/send', {
			method: 'POST',
			body: JSON.stringify(applicationData)
		});
	}

	async getMyApplications(): Promise<ApiResponse<any[]>> {
		return this.makeRequest('/v1/job-applications/me');
	}

	// Auth & user mgmt
	async getCurrentUser(): Promise<ApiResponse<any>> {
		return this.makeRequest('/v1/users/me');
	}

	async updateUserProfile(userData: {
		firstName?: string;
		lastName?: string;
	}): Promise<ApiResponse<any>> {
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

	async login(
		email: string,
		password: string,
		rememberMe: boolean = false
	): Promise<ApiResponse<any>> {
		return this.makeRequest('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password, rememberMe })
		});
	}

	async register(userData: {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
	}): Promise<ApiResponse<any>> {
		return this.makeRequest('/auth/register', {
			method: 'POST',
			body: JSON.stringify(userData)
		});
	}

	async logout(): Promise<ApiResponse<any>> {
		return this.makeRequest('/auth/logout', {
			method: 'POST'
		});
	}
}

export const apiService = new ApiService();
