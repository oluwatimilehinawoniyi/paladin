<script lang="ts">
	import { Mail, Lock, Eye, EyeOff } from '@lucide/svelte';
	import logo from '$lib/assets/logo.png';

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let showPassword = $state(false);
	let isLoading = $state(false);

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	async function handleLogin() {
		isLoading = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));

		console.log('Login:', { email, password, rememberMe });

		// Redirect to dashboard
		window.location.href = '/app';

		isLoading = false;
	}
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

		<!-- Form -->
		<form
			class="mt-8 space-y-6"
			onsubmit={(e) => {
				e.preventDefault();
				handleLogin();
			}}
		>
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
							class="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-colors focus:border-[#ff4d00] focus:ring-2 outline-0 focus:ring-[#ff4d00]"
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
							class="w-full rounded-lg border border-gray-300 py-3 pr-12 pl-10 transition-colors focus:border-[#ff4d00] focus:ring-2 outline-0 focus:ring-[#ff4d00]"
							placeholder="Enter your password"
						/>
						<button
							type="button"
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
				disabled={isLoading}
				class="group relative flex w-full justify-center rounded-lg border border-transparent bg-[#ff4d00] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#ff4d00]/90 focus:ring-2 focus:ring-[#ff4d00] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{#if isLoading}
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
