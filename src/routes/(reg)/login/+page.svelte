<script lang="ts">
	import { Mail, Lock, Eye, EyeOff, AlertCircle } from '@lucide/svelte';
	import logo from '$lib/assets/logo.png';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let showPassword = $state(false);
	let error = $state('');

	let authState = $derived($authStore);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	async function handleLogin(event: Event) {
		event.preventDefault();

		if (!email.trim() || !password.trim()) {
			error = 'Please fill in al fields';
			return;
		}

		error = '';

		try {
			await authStore.login(email.trim(), password.trim(), rememberMe);

			const redirectUrl = $page.url.searchParams.get('redirect') || '/app';
			goto(redirectUrl);
		} catch (err) {
			console.error('Login failed:', err);
			error =
				err instanceof Error
					? err.message.replace('API Error: 401 - ', '')
					: 'Login failed. Please try again.';
		}
	}

	// Google OAuth login
	function handleGoogleLogin() {
		// Redirect to backend OAuth endpoint
		window.location.href = 'http://localhost:8080/api/oauth2/authorization/google';
	}

	$effect(() => {
		if (error) {
			const timer = setTimeout(() => {
				error = '';
			}, 5000);
			return () => clearTimeout(timer);
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<!-- Header -->
		<div class="text-center">
			<div class="mb-6 flex justify-center">
				<a href="/" class="flex items-center gap-3">
					<img src={logo} alt="Paladin logo" class="h-10 w-10" />
					<span class="text-3xl font-bold text-[#030000]">Paladin</span>
				</a>
			</div>
			<h2 class="text-3xl font-bold text-gray-900">Welcome back</h2>
			<p class="mt-2 text-gray-600">Sign in to your account to continue your job search</p>
		</div>

		<!-- Error Alert -->
		{#if error}
			<div class="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
				<AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
				<p class="text-sm text-red-800">{error}</p>
			</div>
		{/if}

		<!-- Form -->
		<form class="mt-8 space-y-6" onsubmit={handleLogin}>
			<div class="space-y-4">
				<!-- Email -->
				<div>
					<label for="email" class="mb-1 block text-sm font-medium text-gray-700">
						Email address
					</label>
					<div class="relative">
						<Mail
							class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
						/>
						<input
							id="email"
							name="email"
							type="email"
							required
							bind:value={email}
							disabled={authState.isLoading}
							class="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 outline-0 transition-colors focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]"
							placeholder="Enter your email"
						/>
					</div>
				</div>

				<!-- Password -->
				<div>
					<label for="password" class="mb-1 block text-sm font-medium text-gray-700">
						Password
					</label>
					<div class="relative">
						<Lock
							class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
						/>
						<input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							required
							bind:value={password}
							disabled={authState.isLoading}
							class="w-full rounded-lg border border-gray-300 py-3 pr-12 pl-10 outline-0 transition-colors focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]"
							placeholder="Enter your password"
						/>
						<button
							type="button"
							disabled={authState.isLoading}
							onclick={(e) => togglePasswordVisibility()}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
						>
							{#if showPassword}
								<EyeOff class="h-5 w-5" />
							{:else}
								<Eye class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</div>
			</div>

			<!-- Remember me & Forgot password -->
			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						disabled={authState.isLoading}
						bind:checked={rememberMe}
						class="h-4 w-4 rounded border-gray-300 text-[#ff4d00] focus:ring-[#ff4d00]"
					/>
					<label for="remember-me" class="ml-2 block text-sm text-gray-700"> Remember me </label>
				</div>

				<div class="text-sm">
					<a href="/forgot-password" class="font-medium text-[#ff4d00] hover:text-[#ff4d00]/80">
						Forgot password?
					</a>
				</div>
			</div>

			<!-- Submit button -->
			<button
				type="submit"
				disabled={authState.isLoading}
				class="group relative flex w-full justify-center rounded-lg border border-transparent bg-[#ff4d00] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#ff4d00]/90 focus:ring-2 focus:ring-[#ff4d00] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if authState.isLoading}
					<svg
						class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Signing in...
				{:else}
					Sign in
				{/if}
			</button>

			<!-- Google OAuth Button -->
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-gray-50 px-2 text-gray-500">Or continue with</span>
				</div>
			</div>

			<button
				type="button"
				onclick={handleGoogleLogin}
				disabled={authState.isLoading}
				class="group relative flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-[#ff4d00] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				<svg class="mr-3 h-5 w-5" viewBox="0 0 24 24">
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
				Continue with Google
			</button>

			<!-- Register link -->
			<div class="text-center">
				<p class="text-sm text-gray-600">
					Don't have an account?
					<a href="/register" class="font-medium text-[#ff4d00] hover:text-[#ff4d00]/80">
						Create one now
					</a>
				</p>
			</div>
		</form>
	</div>
</div>
