/* eslint-disable @typescript-eslint/no-explicit-any */

import { browser } from '$app/environment';

/**
 * Token Service
 * Manages JWT access and refresh tokens in localStorage
 */
class TokenService {
	private readonly ACCESS_TOKEN_KEY = 'paladin_access_token';
	private readonly REFRESH_TOKEN_KEY = 'paladin_refresh_token';

	/**
	 * Store tokens in localStorage
	 */
	setTokens(accessToken: string, refreshToken: string): void {
		if (!browser) return;

		try {
			if (!accessToken || !refreshToken) {
				console.error('Cannot store invalid tokens');
				return;
			}

			localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
			localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
			console.log('Tokens stored successfully');
		} catch (error: any) {
			console.error('Failed to store tokens:', error);

			if (error.name === 'QuotaExceededError') {
				console.error('❌ localStorage quota exceeded');
			}
		}
	}

	/**
	 * Get access token from storage
	 */
	getAccessToken(): string | null {
		if (!browser) return null;

		try {
			const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);

			// Validate token exists and is not empty
			if (!token || token.trim() === '') {
				return null;
			}

			return token;
		} catch (error) {
			console.error('Failed to get access token:', error);
			return null;
		}
	}

	/**
	 * Get refresh token from storage
	 */
	getRefreshToken(): string | null {
		if (!browser) return null;

		try {
			const token = localStorage.getItem(this.REFRESH_TOKEN_KEY);

			// Validate token exists and is not empty
			if (!token || token.trim() === '') {
				return null;
			}

			return token;
		} catch (error) {
			console.error('Failed to get refresh token:', error);
			return null;
		}
	}

	/**
	 * Clear all tokens from storage
	 */
	clearTokens(): void {
		if (!browser) return;

		try {
			localStorage.removeItem(this.ACCESS_TOKEN_KEY);
			localStorage.removeItem(this.REFRESH_TOKEN_KEY);
			console.log('Tokens cleared successfully');
		} catch (error) {
			console.error('Failed to clear tokens:', error);
		}
	}

	/**
	 * Check if user has valid tokens
	 */
	hasTokens(): boolean {
		const hasAccess = !!this.getAccessToken();
		const hasRefresh = !!this.getRefreshToken();
		return hasAccess && hasRefresh;
	}

	/**
	 * Check if user needs to refresh (has refresh token but no/expired access token)
	 */
	needsRefresh(): boolean {
		return !this.getAccessToken() && !!this.getRefreshToken();
	}

	/**
	 * Decode JWT token to read payload
	 */
	decodeToken(token: string): any {
		try {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split('')
					.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
					.join('')
			);
			return JSON.parse(jsonPayload);
		} catch (error) {
			console.error('Failed to decode token:', error);
			return null;
		}
	}

	/**
	 * Validate token structure and expiration
	 */
	isTokenValid(token: string): boolean {
		if (!token) return false;

		const decoded = this.decodeToken(token);
		if (!decoded || !decoded.exp) return false;

		// Check if token is expired
		return decoded.exp * 1000 > Date.now();
	}

	/**
	 * Check if token is expired
	 */
	isTokenExpired(token: string): boolean {
		if (!token) return false;

		const decoded = this.decodeToken(token);
		if (!decoded || !decoded.exp) return true;

		return decoded.exp * 1000 < Date.now();
	}

	/**
	 * Check if access token should be refreshed
	 * @param minutesBeforeExpiry - Refresh if expires within this many minutes (default: 1)
	 * @returns true if token should be refreshed
	 */
	shouldRefreshToken(minutesBeforeExpiry: number = 1): boolean {
		const accessToken = this.getAccessToken();
		if (!accessToken) return false;

		const decoded = this.decodeToken(accessToken);
		if (!decoded || !decoded.exp) return true;

		// Refresh if token expires within specified minutes
		const expiresIn = decoded.exp * 1000 - Date.now();
		const thresholdMs = minutesBeforeExpiry * 60 * 1000;

		return expiresIn < thresholdMs;
	}

	/**
	 * Get time until token expiration
	 * @returns milliseconds until expiration, or 0 if expired/invalid
	 */
	getTimeUntilExpiration(): number {
		const accessToken = this.getAccessToken();
		if (!accessToken) return 0;

		const decoded = this.decodeToken(accessToken);
		if (!decoded || !decoded.exp) return 0;

		const expiresIn = decoded.exp * 1000 - Date.now();
		return expiresIn > 0 ? expiresIn : 0;
	}

	/**
	 * Get user info from access token
	 */
	getUserFromToken(): { userId: string; email: string } | null {
		const accessToken = this.getAccessToken();
		if (!accessToken) return null;

		const decoded = this.decodeToken(accessToken);
		if (!decoded) return null;

		return {
			userId: decoded.userId || decoded.sub,
			email: decoded.sub || decoded.email
		};
	}
}

export const tokenService = new TokenService();
