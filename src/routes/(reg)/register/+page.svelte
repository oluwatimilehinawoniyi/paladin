<script lang="ts">
	import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from '@lucide/svelte';
	import { apiService } from '$lib/api/apiService';
	import logo from '$lib/assets/logo.png';

	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let acceptTerms = $state(false);
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isLoading = $state(false);
	let error = $state('');
	let successMessage = $state('');

	// Password validation
	let passwordValidation = $derived({
		length: password.length >= 8,
		uppercase: /[A-Z]/.test(password),
		lowercase: /[a-z]/.test(password),
		number: /\d/.test(password),
		match: password === confirmPassword && password.length > 0
	});

	let isFormValid = $derived(
		firstName.trim() &&
			lastName.trim() &&
			email.trim() &&
			Object.values(passwordValidation).every(Boolean) &&
			acceptTerms
	);

	function togglePasswordVisibility(field: 'password' | 'confirm') {
		if (field === 'password') {
			showPassword = !showPassword;
		} else {
			showConfirmPassword = !showConfirmPassword;
		}
	}

	async function handleRegister(event: Event) {
		event.preventDefault();

		if (!isFormValid) {
			error = 'Please fill in all fields correctly';
			return;
		}

		isLoading = true;
		error = '';
		successMessage = '';

		try {
			const response = await apiService.register({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim(),
				password: password
			});
			console.log('Registration successful:', response);

			// Show success message
			successMessage =
				'Account created successfully! Please check your email to verify your account before logging in.';

			// Reset form
			firstName = '';
			lastName = '';
			email = '';
			password = '';
			confirmPassword = '';
			acceptTerms = false;
		} catch (err) {
			console.error('Registration failed:', err);
			error = err instanceof Error ? err.message : 'Registration failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function handleGoogleRegister() {
		// Redirect to backend OAuth endpoint
		window.location.href = 'http://localhost:8080/api/oauth2/authorization/google';
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
			<h2 class="text-3xl font-bold text-gray-900">Create your account</h2>
			<p class="mt-2 text-gray-600">Start your journey to landing your dream job</p>
		</div>

		<!-- Success Message -->
		{#if successMessage}
			<div class="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3">
				<CheckCircle class="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
				<p class="text-sm text-green-800">{successMessage}</p>
			</div>
		{/if}

		<!-- Error Alert -->
		{#if error}
			<div class="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
				<AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
				<p class="text-sm text-red-800">{error}</p>
			</div>
		{/if}

		<!-- Form -->
		<form class="mt-8 space-y-6" onsubmit={handleRegister}>
			<div class="space-y-4">
				<!-- Name fields -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="firstName" class="mb-1 block text-sm font-medium text-gray-700">
							First name
						</label>
						<div class="relative">
							<User
								class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
							/>
							<input
								id="firstName"
								name="firstName"
								type="text"
								required
								bind:value={firstName}
								disabled={isLoading}
								class="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 outline-0 transition-colors focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]"
								placeholder="John"
							/>
						</div>
					</div>

					<div>
						<label for="lastName" class="mb-1 block text-sm font-medium text-gray-700">
							Last name
						</label>
						<input
							id="lastName"
							name="lastName"
							type="text"
							required
							bind:value={lastName}
							disabled={isLoading}
							class="w-full rounded-lg border border-gray-300 px-4 py-3 outline-0 transition-colors focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]"
							placeholder="Doe"
						/>
					</div>
				</div>

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
							disabled={isLoading}
							class="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 outline-0 transition-colors focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]"
							placeholder="john@example.com"
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
							disabled={isLoading}
							class="w-full rounded-lg border border-gray-300 py-3 pr-12 pl-10 outline-0 transition-colors focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]"
							placeholder="Create a strong password"
						/>
						<button
							type="button"
							onclick={() => togglePasswordVisibility('password')}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
						>
							{#if showPassword}
								<EyeOff class="h-5 w-5" />
							{:else}
								<Eye class="h-5 w-5" />
							{/if}
						</button>
					</div>

					<!-- Password requirements -->
					{#if password}
						<div class="mt-2 space-y-1">
							<div
								class="flex items-center text-xs {passwordValidation.length
									? 'text-green-600'
									: 'text-gray-500'}"
							>
								<CheckCircle
									class="mr-1 h-3 w-3 {passwordValidation.length
										? 'text-green-500'
										: 'text-gray-400'}"
								/>
								At least 8 characters
							</div>
							<div
								class="flex items-center text-xs {passwordValidation.uppercase
									? 'text-green-600'
									: 'text-gray-500'}"
							>
								<CheckCircle
									class="mr-1 h-3 w-3 {passwordValidation.uppercase
										? 'text-green-500'
										: 'text-gray-400'}"
								/>
								One uppercase letter
							</div>
							<div
								class="flex items-center text-xs {passwordValidation.lowercase
									? 'text-green-600'
									: 'text-gray-500'}"
							>
								<CheckCircle
									class="mr-1 h-3 w-3 {passwordValidation.lowercase
										? 'text-green-500'
										: 'text-gray-400'}"
								/>
								One lowercase letter
							</div>
							<div
								class="flex items-center text-xs {passwordValidation.number
									? 'text-green-600'
									: 'text-gray-500'}"
							>
								<CheckCircle
									class="mr-1 h-3 w-3 {passwordValidation.number
										? 'text-green-500'
										: 'text-gray-400'}"
								/>
								One number
							</div>
						</div>
					{/if}
				</div>

				<!-- Confirm Password -->
				<div>
					<label for="confirmPassword" class="mb-1 block text-sm font-medium text-gray-700">
						Confirm password
					</label>
					<div class="relative">
						<Lock
							class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
						/>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							required
							bind:value={confirmPassword}
							class="w-full rounded-lg border border-gray-300 py-3 pr-12 pl-10 outline-0 transition-colors focus:border-[#ff4d00] focus:ring-2 focus:ring-[#ff4d00]"
							placeholder="Confirm your password"
						/>
						<button
							type="button"
							onclick={() => togglePasswordVisibility('confirm')}
							disabled={isLoading}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
						>
							{#if showConfirmPassword && !passwordValidation.match}
								<EyeOff class="h-5 w-5" />
							{:else}
								<Eye class="h-5 w-5" />
							{/if}
						</button>
					</div>

					{#if confirmPassword && !passwordValidation.match}
						<p class="mt-1 text-xs text-red-600">Passwords don't match</p>
					{/if}
				</div>
			</div>

			<!-- Terms acceptance -->
			<div class="flex items-start">
				<input
					id="acceptTerms"
					name="acceptTerms"
					type="checkbox"
					bind:checked={acceptTerms}
					disabled={isLoading}
					class="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#ff4d00] focus:ring-[#ff4d00]"
				/>
				<label for="acceptTerms" class="ml-2 block text-sm text-gray-700">
					I agree to the
					<a href="/terms" class="font-medium text-[#ff4d00] hover:text-[#ff4d00]/80"
						>Terms of Service</a
					>
					and
					<a href="/privacy" class="font-medium text-[#ff4d00] hover:text-[#ff4d00]/80"
						>Privacy Policy</a
					>
				</label>
			</div>

			<!-- Submit button -->
			<button
				type="submit"
				disabled={!isFormValid || isLoading}
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
					Creating account...
				{:else}
					Create account
				{/if}
			</button>

			<!-- Google OAuth Button -->
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-300" />
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-gray-50 px-2 text-gray-500">Or continue with</span>
				</div>
			</div>

			<button
				type="button"
				onclick={handleGoogleRegister}
				disabled={isLoading}
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

			<!-- Login link -->
			<div class="text-center">
				<p class="text-sm text-gray-600">
					Already have an account?
					<a href="/login" class="font-medium text-[#ff4d00] hover:text-[#ff4d00]/80">
						Sign in instead
					</a>
				</p>
			</div>
		</form>
	</div>
</div>
