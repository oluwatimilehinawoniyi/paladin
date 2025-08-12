import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

const API_BASE_URL = 'http://localhost:8080/api';

export const load: LayoutLoad = async ({ fetch, url }) => {
	if (!browser) {
		return {};
	}

	try {
		console.log('🛡️ Checking auth for dashboard...');

		// Check if user is authenticated
		const response = await fetch(`${API_BASE_URL}/auth/me`, {
			credentials: 'include'
		});

		if (!response.ok) {
			console.log('❌ User not authenticated for dashboard, redirecting to login');
			throw redirect(302, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`);
		}

		const data = await response.json();
		console.log('✅ User authenticated for dashboard:', data.data?.user?.email);

		return {
			user: data.data?.user || data.user
		};
	} catch (error) {
		console.log('🛡️ Dashboard auth check error:', error);

		if (error instanceof Response && error.status === 302) {
			throw error;
		}

		console.log('❌ Dashboard auth failed, redirecting to login');
		throw redirect(302, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`);
	}
};
