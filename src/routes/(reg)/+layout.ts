import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

const API_BASE_URL = 'http://localhost:8080/api';

export const load: LayoutLoad = async ({ fetch }) => {
	if (!browser) {
		return {};
	}

	try {
		const response = await fetch(`${API_BASE_URL}/auth/me`, {
			credentials: 'include'
		});

		if (response.ok) {
			throw redirect(302, '/app');
		}
	} catch (error) {
		if (error instanceof Response && error.status === 302) {
			throw error;
		}
	}

	return {};
};
