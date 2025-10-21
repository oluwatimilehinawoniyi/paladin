/* eslint-disable @typescript-eslint/no-explicit-any */
import { onMount, onDestroy } from 'svelte';
import { browser } from '$app/environment';
import { tokenService } from '$lib/services/tokenService';
import { apiService } from '$lib/api/apiService';

export function useTokenRefresh() {
	let refreshInterval: ReturnType<typeof setInterval> | null = null;
	let isRefreshing = false;

	/**
	 * Check token expiration and refresh if needed
	 */
	const checkAndRefreshToken = async () => {
		if (!browser) return;

		if (isRefreshing) {
			console.log('⏳ Token refresh already in progress, skipping check...');
			return;
		}

		try {
			const accessToken = tokenService.getAccessToken();

			// No token = user not logged in, skip check
			if (!accessToken) {
				console.log('No access token found, skipping refresh check');
				return;
			}

			const decoded = tokenService.decodeToken(accessToken);
			if (!decoded || !decoded.exp) {
				console.warn('Invalid token format, cannot check expiration');
				return;
			}

			// Calculate time until expiration
			const expiresIn = decoded.exp * 1000 - Date.now();
			const minutesLeft = Math.floor(expiresIn / 60000);
			const hoursLeft = Math.floor(minutesLeft / 60);
			const remainingMinutes = minutesLeft % 60;

			// Log token status
			if (hoursLeft > 0) {
				console.log(`Token expires in ${hoursLeft}h ${remainingMinutes}m`);
			} else {
				console.log(`Token expires in ${minutesLeft} minutes`);
			}

			// Refresh if token expires within 10 minutes (600000 ms)
			if (expiresIn < 600000 && expiresIn > 0) {
				console.log('⚠️ Token expiring soon, initiating refresh...');

				isRefreshing = true;

				try {
					await apiService.refreshToken();
					console.log('✅ Background token refresh successful');
				} catch (error: any) {
					console.error('❌ Background token refresh failed:', error);
				} finally {
					isRefreshing = false;
				}
			} else if (expiresIn <= 0) {
				console.warn('⚠️ Token already expired, will refresh on next API call');
			} else {
				console.log('✅ Token still valid, no refresh needed');
			}
		} catch (error) {
			console.error('Background token refresh failed:', error);
			isRefreshing = false;
		}
	};

	/**
	 * Handle visibility change - check token when tab becomes visible
	 */
	const handleVisibilityChange = () => {
		if (!browser) return;

		if (document.visibilityState === 'visible') {
			console.log('Tab became visible, checking token...');
			checkAndRefreshToken();
		}
	};

	onMount(() => {
		if (!browser) return;

		// Only start monitoring if user is logged in
		if (tokenService.hasTokens()) {
			// Check immediately on mount
			checkAndRefreshToken();

			// Then check every 3 minutes (180000 ms)
			refreshInterval = setInterval(checkAndRefreshToken, 3 * 60 * 1000);

			document.addEventListener('visibilitychange', handleVisibilityChange);
		}
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}

        if (browser) {
					document.removeEventListener('visibilitychange', handleVisibilityChange);
				}
	});
}
