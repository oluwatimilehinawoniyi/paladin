/* eslint-disable @typescript-eslint/no-explicit-any */

import { browser } from '$app/environment';

class TokenService {
	private readonly ACCESS_TOKEN_KEY = 'paladin_access_token';
	private readonly REFRESH_TOKEN_KEY = 'paladin_refresh_token';

	/**
	 * Store tokens in localStorage
	 */
	setTokens(accessToken: string, refreshToken: string): void {
		if (!browser) return;

		try {
			localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
			localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
			console.log('Tokens stored successfully');
		} catch (error) {
			console.error('Failed to store tokens:', error);
		}
	}

	/**
	 * Get access token from storage
	 */
	getAccessToken(): string | null {
		if (!browser) return null;

		try {
			return localStorage.getItem(this.ACCESS_TOKEN_KEY);
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
			return localStorage.getItem(this.REFRESH_TOKEN_KEY);
		} catch (error) {
			console.error('Failed to get refresh token:', error);
			return null;
		}
	}

	/**
	 * clear all tokens from storage
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
		return !!this.getAccessToken() && !!this.getRefreshToken();
	}

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
	 * check if token is expired
	 */
	isTokenExpired(token: string): boolean {
		const decoded = this.decodeToken(token);
		if (!decoded || !decoded.exp) return true;

		return decoded.exp * 1000 < Date.now();
	}

	/**
	 * check if access token is expired or about to expire (within 1 minute)
	 */
	shouldRefreshToken(): boolean {
		const accessToken = this.getAccessToken();
		if (!accessToken) return false;

		const decoded = this.decodeToken(accessToken);
		if (!decoded || !decoded.exp) return true;

		// refresh if token expires in less than 1 minute
		const expiresIn = decoded.exp * 1000 - Date.now();
		return expiresIn < 60000;
	}
}

export const tokenService = new TokenService();
