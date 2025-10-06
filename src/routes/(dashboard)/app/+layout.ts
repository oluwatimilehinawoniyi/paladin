import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { tokenService } from '$lib/services/tokenService';
import { API_CONFIG } from '$lib/api/apiService';

const API_BASE_URL = API_CONFIG.baseURL;

export const load: LayoutLoad = async ({ fetch, url }) => {
	if (!browser) {
		return {};
	}

	try {
		// Check if user has JWT tokens
		if (!tokenService.hasTokens()) {
			console.log('🛡️ No tokens found, redirecting to login');
			throw redirect(302, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`);
		}

		// Verify token is valid by checking user info
		const token = tokenService.getAccessToken();
		const response = await fetch(`${API_BASE_URL}/auth/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			console.log('🛡️ Token validation failed, redirecting to login');
			tokenService.clearTokens();
			throw redirect(302, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`);
		}

		const data = await response.json();

		return {
			user: data.data?.user || data.user
		};
	} catch (error) {
		console.log('🛡️ Dashboard auth check error:', error);

		// If it's already a redirect, re-throw it
		if (error instanceof Response && error.status === 302) {
			throw error;
		}

		// Clear tokens and redirect to login
		tokenService.clearTokens();
		throw redirect(302, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`);
	}
};
