<script lang="ts">
	import { ArrowRight, Shield, Zap, CheckCircle } from '@lucide/svelte';
	import logo from '$lib/assets/logo.png';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { API_CONFIG } from '$lib/api/apiService';
	import { tokenService } from '$lib/services/tokenService';

	let isLoading = $state(false);
	let error = $state('');
	let isCheckingAuth = $state(true);

	onMount(async () => {
		// Check for OAuth error
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('error') === 'oauth_failed') {
			error = 'Authentication failed. Please try again.';
			// Clean up the URL
			const newUrl = new URL(window.location.href);
			newUrl.searchParams.delete('error');
			window.history.replaceState({}, '', newUrl.toString());
		}

		// Check if user already has valid tokens
		if (tokenService.hasTokens()) {
			try {
				const token = tokenService.getAccessToken();
				const response = await fetch(`${API_CONFIG.baseURL}/auth/me`, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				});

				if (response.ok) {
					console.log('User already authenticated, redirecting...');
					const redirectUrl = $page.url.searchParams.get('redirect') || '/app';
					goto(redirectUrl);
					return;
				} else {
					// Token invalid, clear it
					console.log('Token invalid, clearing...');
					tokenService.clearTokens();
				}
			} catch (e) {
				console.log('Auth check failed:', e);
				tokenService.clearTokens();
			}
		}

		isCheckingAuth = false;
	});

	function handleGoogleLogin() {
		if (isLoading) return;

		isLoading = true;
		error = '';

		// Get redirect URL from query params
		const redirectUrl = $page.url.searchParams.get('redirect') || '/app';

		// Store redirect URL in sessionStorage
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('oauth_redirect', redirectUrl);
		}

		// Redirect to backend OAuth endpoint
		window.location.href = API_CONFIG.oauthURL;
	}

	// Clear error after 5 seconds
	$effect(() => {
		if (error) {
			const timer = setTimeout(() => {
				error = '';
			}, 5000);
			return () => clearTimeout(timer);
		}
	});

	// Features for the login page
	const features = [
		{
			icon: Zap,
			title: 'Instant Setup',
			description: 'Get started in seconds with your Google account'
		},
		{
			icon: Shield,
			title: 'Secure Authentication',
			description: 'JWT security with no passwords to remember'
		},
		{
			icon: CheckCircle,
			title: 'Seamless Experience',
			description: 'All your data synced automatically'
		}
	];
</script>

<!-- Show loading spinner while checking auth -->
{#if isCheckingAuth}
	<div class="flex min-h-screen items-center justify-center bg-gray-50">
		<div class="text-center">
			<div
				class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#ff4d00] border-t-transparent"
			></div>
			<p class="mt-4 text-gray-600">Checking authentication...</p>
		</div>
	</div>
{:else}
	<!-- Your existing login page content -->
	<div class="flex min-h-screen">
		<!-- Left Side - Login Form -->
		<div class="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
			<div class="mx-auto w-full max-w-sm lg:w-96">
				<!-- Header -->
				<div class="text-center lg:text-left">
					<div class="mb-8 flex justify-center lg:justify-start">
						<a href="/" class="flex items-center gap-3">
							<img src={logo} alt="Paladin logo" class="h-10 w-10" />
							<span class="text-3xl font-bold text-[#030000]">Paladin</span>
						</a>
					</div>
					<h2 class="text-3xl font-bold text-gray-900">Welcome to Paladin</h2>
					<p class="mt-2 text-gray-600">Sign in with Google to start your job search journey</p>
				</div>

				<!-- Error Alert -->
				{#if error}
					<div class="mt-6 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
						<svg
							class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
						<p class="text-sm text-red-800">{error}</p>
					</div>
				{/if}

				<!-- OAuth Button -->
				<div class="mt-8">
					<button
						onclick={handleGoogleLogin}
						disabled={isLoading}
						class="group relative flex w-full items-center justify-center rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-all hover:border-[#ff4d00] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isLoading}
							<div class="absolute left-4">
								<div
									class="h-5 w-5 animate-spin rounded-full border-2 border-[#ff4d00] border-t-transparent"
								></div>
							</div>
							<span>Connecting to Google...</span>
						{:else}
							<svg class="absolute left-4 h-5 w-5" viewBox="0 0 24 24">
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							<span>Continue with Google</span>
							<ArrowRight class="absolute right-4 h-5 w-5 transition-transform group-hover:translate-x-1" />
						{/if}
					</button>
				</div>

				<!-- Security notice -->
				<p class="mt-4 text-center text-xs text-gray-500">
					By continuing, you agree to Paladin's
					<a href="/terms" class="text-[#ff4d00] hover:underline">Terms of Service</a>
					and
					<a href="/privacy" class="text-[#ff4d00] hover:underline">Privacy Policy</a>
				</p>
			</div>
		</div>

		<!-- Right Side - Features (Hidden on mobile) -->
		<div class="hidden bg-gray-50 lg:flex lg:w-1/2 lg:items-center lg:justify-center lg:p-12">
			<div class="max-w-md">
				<h3 class="mb-8 text-3xl font-bold text-gray-900">Why choose Paladin?</h3>
				<div class="space-y-6">
					{#each features as feature}
						{@const Icon = feature.icon}
						<div class="flex gap-4">
							<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#ff4d00]/10">
								<Icon class="h-6 w-6 text-[#ff4d00]" />
							</div>
							<div>
								<h4 class="mb-1 font-semibold text-gray-900">{feature.title}</h4>
								<p class="text-sm text-gray-600">{feature.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}