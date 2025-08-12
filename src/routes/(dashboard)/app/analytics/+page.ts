import type { PageLoad } from "../$types";

export const load: PageLoad = async ({ fetch, url }) => {
    const timeframe = url.searchParams.get('timeframe') || '30d';
    
    const [stats, applications, goals] = await Promise.all([
        fetch(`/api/v1/analytics/stats?timeframe=${timeframe}`),
        fetch(`/api/v1/applications/me?limit=50`),
        fetch(`/api/v1/analytics/goals`)
    ]);
    
    return {
        stats: stats.ok ? (await stats.json()).data : null,
        applications: applications.ok ? (await applications.json()).data : [],
        goals: goals.ok ? (await goals.json()).data : null
    };
};