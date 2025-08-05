<script lang="ts">
	import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from '@lucide/svelte';
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

	async function handleRegister() {
		if (!isFormValid) return;

		isLoading = true;

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));

		console.log('Register:', {
			firstName,
			lastName,
			email,
			password,
			acceptTerms
		});

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
			<h2 class="text-3xl font-bold text-gray-900">Create your account</h2>
			<p class="mt-2 text-gray-600">Start your journey to landing your dream job</p>
		</div>

		<!-- Form -->
		<form
			class="mt-8 space-y-6"
			onsubmit={(e) => {
				e.preventDefault();
				handleRegister();
			}}
		>
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
							class="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
						>
							{#if showConfirmPassword}
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
