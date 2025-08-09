// src/routes/(dashboard)/app/+layout.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

const API_BASE_URL = 'http://localhost:8080/api';

export const load: LayoutLoad = async ({ fetch, url }) => {
	if (!browser) {
		return {};
	}

	try {
		// Check if user is authenticated
		const response = await fetch(`${API_BASE_URL}/auth/me`, {
			credentials: 'include'
		});

		if (!response.ok) {
			throw redirect(302, `/login?redirect=${encodeURIComponent(url.pathname)}`);
		}

		const data = await response.json();

		return {
			user: data.user
		};
	} catch (error) {
		if (error instanceof Response && error.status === 302) {
			throw error;
		}

		throw redirect(302, `/login?redirect=${encodeURIComponent(url.pathname)}`);
	}
};
