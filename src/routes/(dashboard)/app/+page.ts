/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, depends, parent }) => {
	depends('app:profiles');
	await parent();

	try {
		const profilesResponse = await fetch('/api/v1/profiles/me', { credentials: 'include' });

		return {
			profiles: profilesResponse.ok ? (await profilesResponse.json()).data : [],
			streamed: {
				recentApplications: fetch('/api/v1/applications')
					.then((r) => (r.ok ? r.json() : { data: [] }))
					.then((json) => json.data)

				// quickStats: fetch('/api/v1/analytics/quick-stats')
				// 	.then((r) => (r.ok ? r.json() : { data: null }))
				// 	.then((json) => json.data)
			}
		};
	} catch (error) {
		return {
			profiles: [],
			streamed: {
				recentApplications: Promise.resolve([])
				// quickStats: Promise.resolve(null)
			}
		};
	}
};
