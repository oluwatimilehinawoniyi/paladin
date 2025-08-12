import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

const API_BASE_URL = 'http://localhost:8080/api';

export const load: LayoutLoad = async ({ fetch, url, depends }) => {
	if (!browser) {
		return {};
	}

	depends('app:user');

	try {
		console.log('🛡️ Checking auth for dashboard...');

		// Check if user is authenticated
		const response = await fetch(`${API_BASE_URL}/auth/me`, {
			credentials: 'include'
		});

		if (!response.ok) {
			throw redirect(302, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`);
		}

		const data = await response.json();
		console.log('✅ User authenticated for dashboard:', data.data?.user?.email);

		return {
			user: data.data?.user || data.user,
			streamed: {
				// notifications: fetch('/api/v1/notifications/unread').then((r) =>
				// r.ok ? r.json() : { count: 0 }
				// )
			}
		};
	} catch (error) {
		if (error instanceof Response && error.status === 302) {
			throw error;
		}

		throw redirect(302, `/auth/login?redirect=${encodeURIComponent(url.pathname)}`);
	}
};
