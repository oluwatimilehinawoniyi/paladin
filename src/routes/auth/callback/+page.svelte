<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import { tokenService } from '$lib/services/tokenService';
	import logo from '$lib/assets/logo.png';

	let status = $state<'loading' | 'success' | 'error'>('loading');
	let message = $state('');

	onMount(async () => {
		try {
			// Try to get tokens from BOTH hash and query params (supports both methods)
			let accessToken: string | null = null;
			let refreshToken: string | null = null;

			// First, try hash params (mobile-friendly)
			if (window.location.hash) {
				const hash = window.location.hash.substring(1); // Remove #
				const hashParams = new URLSearchParams(hash);
				accessToken = hashParams.get('accessToken');
				refreshToken = hashParams.get('refreshToken');
			}

			// Fallback to query params (desktop/backward compatibility)
			if (!accessToken || !refreshToken) {
				const urlParams = new URLSearchParams(window.location.search);
				accessToken = urlParams.get('accessToken');
				refreshToken = urlParams.get('refreshToken');
			}

			if (!accessToken || !refreshToken) {
				throw new Error('No tokens received from OAuth');
			}

			// Store tokens
			tokenService.setTokens(accessToken, refreshToken);

			// Initialize auth store with new tokens
			await authStore.init();

			// Check if user is authenticated
			const currentStore = $authStore;

			if (currentStore.isAuthenticated && currentStore.user) {
				status = 'success';
				message = `Welcome ${currentStore.user.firstName}! Redirecting to your dashboard...`;

				// Clean up URL
				window.history.replaceState({}, document.title, window.location.pathname);

				// Get redirect URL from sessionStorage or default to /app
				const redirectUrl = sessionStorage.getItem('oauth_redirect') || '/app';
				sessionStorage.removeItem('oauth_redirect');

				// Redirect after a short delay
				setTimeout(() => {
					goto(redirectUrl);
				}, 1500);
			} else {
				throw new Error('Authentication verification failed');
			}
		} catch (error) {
			console.error('OAuth callback error:', error);
			status = 'error';
			message = 'Authentication failed. Please try again.';

			// Clear any potentially invalid tokens
			tokenService.clearTokens();

			// Redirect to login after a short delay
			setTimeout(() => {
				goto('/auth/login?error=oauth_failed');
			}, 3000);
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="text-center">
		<!-- Logo -->
		<div class="mb-8 flex justify-center">
			<div class="flex items-center gap-3">
				<img src={logo} alt="Paladin logo" class="h-12 w-12" />
				<span class="text-3xl font-bold text-[#030000]">Paladin</span>
			</div>
		</div>

		<!-- Status Content -->
		{#if status === 'loading'}
			<div class="space-y-4">
				<div
					class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#ff4d00] border-t-transparent"
				></div>
				<h2 class="text-2xl font-semibold text-gray-900">Completing sign-in...</h2>
				<p class="text-gray-600">Please wait while we set up your account</p>
			</div>
		{:else if status === 'success'}
			<div class="space-y-4">
				<div
					class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
				>
					<svg
						class="h-6 w-6 text-green-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-semibold text-green-900">{message}</h2>
				<p class="text-gray-600">Taking you to your dashboard...</p>
			</div>
		{:else if status === 'error'}
			<div class="space-y-4">
				<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
					<svg
						class="h-6 w-6 text-red-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-semibold text-red-900">{message}</h2>
				<p class="text-gray-600">Redirecting back to login...</p>
			</div>
		{/if}
	</div>
</div>