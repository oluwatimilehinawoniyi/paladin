import { onMount, onDestroy } from 'svelte';
import { browser } from '$app/environment';
import { tokenService } from '$lib/services/tokenService';
import { apiService } from '$lib/api/apiService';

export function useTokenRefresh() {
    let refreshInterval: ReturnType<typeof setInterval> | null = null;

    /**
     * Check token expiration and refresh if needed
     */
    const checkAndRefreshToken = async () => {
        if (!browser) return;

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
            
            console.log(`Token expires in ${minutesLeft} minutes`);
            
            // Refresh if token expires within 10 minutes (600000 ms)
            if (expiresIn < 600000 && expiresIn > 0) {
                await apiService.refreshToken();
            } else if (expiresIn <= 0) {
                console.warn('⚠️ Token already expired, will refresh on next API call');
            }
        } catch (error) {
            console.error('Background token refresh failed:', error);
        }
    };

    onMount(() => {
        if (!browser) return;

        // Only start monitoring if user is logged in
        if (tokenService.hasTokens()) {
            // Check immediately on mount
            checkAndRefreshToken();
            
            // Then check every 5 minutes (300000 ms)
            refreshInterval = setInterval(checkAndRefreshToken, 5 * 60 * 1000);
            
        } 
    });

    onDestroy(() => {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
    });
}