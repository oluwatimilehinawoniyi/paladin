/* eslint-disable @typescript-eslint/no-explicit-any */
// const API_BASE_URL = 'http://localhost:8080/api';
const API_BASE_URL = 'https://paladin-be-8eieva.fly.dev/';

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
	firstName: string;
	lastName: string;
	email: string;
	createdAt: string;
	updatedAt?: string;
}

export interface AuthResponse {
	user: User;
	token?: string;
	message: string;
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
	private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
		try {
			const response = await fetch(`${API_BASE_URL}${url}`, {
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					...options.headers
				},
				...options
			});

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
				// Handle authentication errors
				if (response.status === 401) {
					// Redirect to login if user is not authenticated
					if (typeof window !== 'undefined') {
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
		} catch (error) {
			if (error instanceof TypeError && error.message.includes('fetch')) {
				throw new Error('Network error - please check your connection', error);
			}
			throw error;
		}
	}

	// generate cover letter for manual mode
	async generateTemplateCoverLetter(
		category: string,
		{ companyName, candidateName, position }: GenerateTemplateProps
	): Promise<ApiResponse<string>> {
		const encodedCategory = encodeURIComponent(category);

		const response = await fetch(
			`${API_BASE_URL}/v1/cover-letters/generate/${encodedCategory}?candidateName=${candidateName}&companyName=${companyName}&position=${position}`,
			{
				credentials: 'include',
				method: 'GET'
			}
		);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}
		return response.json();
	}

	// job description analysis
	async analyseJobDescription(data: JobAnalysisRequest): Promise<ApiResponse<JobAnalysisResponse>> {
		return this.makeRequest(`/v1/job-applications/analyze-application`, {
			method: 'POST',
			body: JSON.stringify(data)
		});
	}

	// Profile Management
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
			if (response.status === 401) {
				if (typeof window !== 'undefined') {
					window.location.href = '/auth/login';
				}
				throw new Error('Authentication required');
			}
			const error = await response.text();
			throw new Error(`Profile Creation Error: ${response.status} - ${error}`);
		}

		return response.json();
	}

	async createProfile(profileData: ProfileCreateRequest): Promise<ApiResponse<ProfileResponse>> {
		return this.makeRequest('/v1/profiles', {
			method: 'POST',
			body: JSON.stringify(profileData)
		});
	}

	async getProfiles(): Promise<ApiResponse<ProfileResponse[]>> {
		return this.makeRequest('/v1/profiles/me');
	}

	async getProfile(profileId: string): Promise<ApiResponse<ProfileResponse>> {
		return this.makeRequest(`/v1/profiles/${profileId}`);
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
			if (response.status === 401) {
				if (typeof window !== 'undefined') {
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
		const response = await fetch(`${API_BASE_URL}/v1/cv/${cvId}/download`, {
			credentials: 'include'
		});

		if (!response.ok) {
			if (response.status === 401) {
				if (typeof window !== 'undefined') {
					window.location.href = '/auth/login';
				}
				throw new Error('Authentication required');
			}
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

	async getMyApplications(): Promise<ApiResponse<Application[]>> {
		return this.makeRequest('/v1/job-applications/me');
	}

	async updateApplicationStatus(
		applicationId: string,
		status: ApplicationStatus
	): Promise<ApiResponse<Application>> {
		return this.makeRequest(`/v1/job-applications/${applicationId}/status`, {
			method: 'PATCH',
			body: JSON.stringify(status)
		});
	}

	// Auth & user mgmt
	async getCurrentUser(): Promise<ApiResponse<any>> {
		return this.makeRequest('/auth/me');
	}

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

	async logout(): Promise<ApiResponse<any>> {
		return this.makeRequest('/auth/logout', {
			method: 'POST'
		});
	}

	async checkAuth(): Promise<boolean> {
		try {
			await this.getCurrentUser();
			return true;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (error) {
			return false;
		}
	}
}

export const apiService = new ApiService();
