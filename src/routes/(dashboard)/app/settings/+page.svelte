<script lang="ts">
	import {
		User,
		Bell,
		Settings as SettingsIcon,
		Shield,
		Download,
		Trash2,
		Sun,
		Moon,
		Save,
		Cookie,
		KeyRound,
		Eye,
		EyeOff
	} from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { modalStore } from '$lib/stores/modalStore';

	// Profile form state
	let firstName = $state('John');
	let lastName = $state('Doe');
	let email = $state('john@example.com');
	let bio = $state('Passionate software developer with expertise in modern web technologies.');

	// Notification preferences state
	let emailNotifications = $state(true);
	let applicationUpdates = $state(true);
	let weeklyReports = $state(false);
	let marketingEmails = $state(false);

	// Application preferences state
	let autoSaveApplications = $state(true);
	let defaultCoverLetter = $state(true);
	let profileReminders = $state(true);

	// Change password state
	let oldPassword = $state('');
	let newPassword = $state('');
	let confirmNewPassword = $state('');
	let isOldPasswordOpen = $state(false);
	let isNewPasswordOpen = $state(false);
	let isConfirmNewPasswordOpen = $state(false);

	// Theme state
	let isDarkMode = $state(false);

	function handleSaveProfile() {
		console.log('Saving profile:', { firstName, lastName, email, bio });
		// Add your profile save logic here
	}

	function handleSaveNotifications() {
		console.log('Saving notifications:', {
			emailNotifications,
			applicationUpdates,
			weeklyReports,
			marketingEmails
		});
		// Add your notification save logic here
	}

	function handleExportData() {
		console.log('Exporting user data...');
		// Add your data export logic here
	}

	function handleDeleteAccount() {
		modalStore.open({
			component: () => import('$lib/components/modals/ConfirmationModal.svelte'),
			props: {
				title: 'Delete Account',
				message:
					'Are you sure you want to permanently delete your account and all data? This action cannot be undone.',
				type: 'danger',
				onConfirm: () => {
					console.log('Account deletion confirmed');
					// Add your account deletion logic here
				}
			},
			options: { size: 'md' }
		});
	}

	function toggleTheme() {
		isDarkMode = !isDarkMode;
		console.log('Theme changed to:', isDarkMode ? 'dark' : 'light');
		// Add your theme toggle logic here
	}
</script>

<section class="flex h-full w-full flex-col gap-8 overflow-hidden p-4 md:h-screen md:pt-14">
	<!-- header -->
	<div class="">
		<h1 class="text-2xl font-bold text-gray-700 capitalize">settings</h1>
		<p class="text-gray-500">Manage your account settings and preferences</p>
	</div>

	<!-- settings content -->
	<div class="custom-scrollbar flex-1 space-y-8 overflow-y-auto pb-4">
		<!-- Profile Information Section -->
		<div class="rounded-lg border border-gray-200 bg-white p-6">
			<div class="mb-6 flex flex-col items-start gap-3 sm:flex-row">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10">
					<User class="h-5 w-5 text-[#ff4d00]" />
				</div>
				<div>
					<h2 class="text-xl font-semibold text-gray-800">Profile Information</h2>
					<p class="text-gray-600">Update your personal information and profile details</p>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label for="firstName" class="mb-1 block text-sm font-medium text-gray-700">
						First Name
					</label>
					<input
						type="text"
						id="firstName"
						bind:value={firstName}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
					/>
				</div>

				<div>
					<label for="lastName" class="mb-1 block text-sm font-medium text-gray-700">
						Last Name
					</label>
					<input
						type="text"
						id="lastName"
						bind:value={lastName}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
					/>
				</div>

				<div class="md:col-span2">
					<label for="email" class="mb-1 block text-sm font-medium text-gray-700">
						Email Address
					</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
					/>
				</div>

				<div class="md:col-span-2">
					<label for="bio" class="mb-1 block text-sm font-medium text-gray-700"> Bio </label>
					<textarea
						id="bio"
						bind:value={bio}
						rows="3"
						class="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
					></textarea>
				</div>
			</div>

			<div class="mt-6">
				<Button name="save profile" icon={Save} onClick={handleSaveProfile} />
			</div>
		</div>

		<!-- Notification Preferences Section -->
		<div class="rounded-lg border border-gray-200 bg-white p-6">
			<div class="mb-6 flex flex-col items-start gap-3 sm:flex-row">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10">
					<Bell class="h-5 w-5 text-[#ff4d00]" />
				</div>
				<div>
					<h2 class="text-xl font-semibold text-gray-800">Notification Preferences</h2>
					<p class="text-gray-600">Choose what notifications you'd like to receive</p>
				</div>
			</div>

			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="font-medium text-gray-800">Email Notifications</h3>
						<p class="text-sm text-gray-600">Receive notifications via email</p>
					</div>
					<label class="relative inline-flex cursor-pointer items-center">
						<input type="checkbox" bind:checked={emailNotifications} class="peer sr-only" />
						<div
							class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#ff4d00] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
						></div>
					</label>
				</div>

				<div class="flex items-center justify-between">
					<div>
						<h3 class="font-medium text-gray-800">Application Updates</h3>
						<p class="text-sm text-gray-600">Get notified when application status changes</p>
					</div>
					<label class="relative inline-flex cursor-pointer items-center">
						<input type="checkbox" bind:checked={applicationUpdates} class="peer sr-only" />
						<div
							class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#ff4d00] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
						></div>
					</label>
				</div>

				<div class="flex items-center justify-between">
					<div>
						<h3 class="font-medium text-gray-800">Weekly Reports</h3>
						<p class="text-sm text-gray-600">Receive weekly application summary reports</p>
					</div>
					<label class="relative inline-flex cursor-pointer items-center">
						<input type="checkbox" bind:checked={weeklyReports} class="peer sr-only" />
						<div
							class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#ff4d00] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
						></div>
					</label>
				</div>

				<div class="flex items-center justify-between">
					<div>
						<h3 class="font-medium text-gray-800">Marketing Emails</h3>
						<p class="text-sm text-gray-600">Receive updates about new features and tips</p>
					</div>
					<label class="relative inline-flex cursor-pointer items-center">
						<input type="checkbox" bind:checked={marketingEmails} class="peer sr-only" />
						<div
							class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#ff4d00] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
						></div>
					</label>
				</div>
			</div>

			<div class="mt-6">
				<Button icon={Save} name="save notifications" onClick={handleSaveNotifications} />
			</div>
		</div>

		<!-- Application Preferences Section -->
		<div class="rounded-lg border border-gray-200 bg-white p-6">
			<div class="mb-6 flex flex-col items-start gap-3 sm:flex-row">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10">
					<SettingsIcon class="h-5 w-5 text-[#ff4d00]" />
				</div>
				<div>
					<h2 class="text-xl font-semibold text-gray-800">Application Preferences</h2>
					<p class="text-gray-600">Customize how your applications are handled</p>
				</div>
			</div>

			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div>
						<h3 class="font-medium text-gray-800">Auto-save Applications</h3>
						<p class="text-sm text-gray-600">Automatically save application drafts</p>
					</div>
					<label class="relative inline-flex cursor-pointer items-center">
						<input type="checkbox" bind:checked={autoSaveApplications} class="peer sr-only" />
						<div
							class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#ff4d00] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
						></div>
					</label>
				</div>

				<div class="flex items-center justify-between">
					<div>
						<h3 class="font-medium text-gray-800">Default Cover Letter</h3>
						<p class="text-sm text-gray-600">
							Use default cover letter template for quick applications
						</p>
					</div>
					<label class="relative inline-flex cursor-pointer items-center">
						<input type="checkbox" bind:checked={defaultCoverLetter} class="peer sr-only" />
						<div
							class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#ff4d00] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
						></div>
					</label>
				</div>

				<div class="flex items-center justify-between">
					<div>
						<h3 class="font-medium text-gray-800">Profile Reminders</h3>
						<p class="text-sm text-gray-600">Get reminders to update your profiles regularly</p>
					</div>
					<label class="relative inline-flex cursor-pointer items-center">
						<input type="checkbox" bind:checked={profileReminders} class="peer sr-only" />
						<div
							class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#ff4d00] peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
						></div>
					</label>
				</div>
			</div>
		</div>

		<!-- Appearance Section -->
		<div class="rounded-lg border border-gray-200 bg-white p-6">
			<div class="mb-6 flex flex-col items-start gap-3 sm:flex-row">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10">
					<Cookie class="h-5 w-5 text-[#ff4d00]" />
				</div>
				<div>
					<h2 class="text-xl font-semibold text-gray-800">Appearance</h2>
					<p class="text-gray-600">Customize the look and feel of your dashboard</p>
				</div>
			</div>

			<div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
				<div>
					<h3 class="font-medium text-gray-800">Theme</h3>
					<p class="text-sm text-gray-600">Choose between light and dark mode</p>
				</div>
				<button
					onclick={toggleTheme}
					class="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
				>
					{#if isDarkMode}
						<Sun class="h-4 w-4" />
						Light Mode
					{:else}
						<Moon class="h-4 w-4" />
						Dark Mode
					{/if}
				</button>
			</div>
		</div>

		<!-- Change password -->
		<div class="rounded-lg border border-gray-200 bg-white p-6">
			<div class="mb-6 flex flex-col items-start gap-3 sm:flex-row">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10">
					<KeyRound class="h-5 w-5 text-[#ff4d00]" />
				</div>
				<div>
					<h2 class="text-xl font-semibold text-gray-800">Change Password</h2>
				</div>
			</div>
			<div class="space-y-4">
				<!-- Old password -->
				<div class="w-full max-w-2xl">
					<label for="oldPassword" class="mb-1 block text-sm font-medium text-gray-700">
						Old Password
					</label>
					<div class="relative">
						<input
							type={isOldPasswordOpen ? 'text' : 'password'}
							id="oldPassword"
							bind:value={oldPassword}
							placeholder="**********"
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
						/>

						<div
							onclick={() => (isOldPasswordOpen = !isOldPasswordOpen)}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform"
						>
							{#if isOldPasswordOpen}
								<Eye class="h-5 w-5 text-gray-400" />
							{:else}
								<EyeOff class="h-5 w-5 text-gray-400" />
							{/if}
						</div>
					</div>
				</div>

				<!-- New password -->
				<div class="w-full max-w-2xl">
					<label for="newPassword" class="mb-1 block text-sm font-medium text-gray-700">
						New Password
					</label>
					<div class="relative">
						<input
							type={isNewPasswordOpen ? 'text' : 'password'}
							id="newPassword"
							bind:value={newPassword}
							placeholder="**********"
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
						/>

						<div
							onclick={() => (isNewPasswordOpen = !isNewPasswordOpen)}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform"
						>
							{#if isNewPasswordOpen}
								<Eye class="h-5 w-5 text-gray-400" />
							{:else}
								<EyeOff class="h-5 w-5 text-gray-400" />
							{/if}
						</div>
					</div>
				</div>

				<!-- Confirm New password -->
				<div class="w-full max-w-2xl">
					<label for="confirmNewPassword" class="mb-1 block text-sm font-medium text-gray-700">
						Confirm New Password
					</label>
					<div class="relative">
						<input
							type={isConfirmNewPasswordOpen ? 'text' : 'password'}
							id="confirmNewPassword"
							bind:value={confirmNewPassword}
							placeholder="**********"
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
						/>

						<div
							onclick={() => (isConfirmNewPasswordOpen = !isConfirmNewPasswordOpen)}
							class="absolute top-1/2 right-3 -translate-y-1/2 transform"
						>
							{#if isConfirmNewPasswordOpen}
								<Eye class="h-5 w-5 text-gray-400" />
							{:else}
								<EyeOff class="h-5 w-5 text-gray-400" />
							{/if}
						</div>
					</div>
				</div>

				<div class="px-4 py-2">
					<ul class="list-disc text-gray-600">
						<li>Minimum characters 12</li>
						<li>One uppercase character</li>
						<li>One lowercase character</li>
						<li>One special character</li>
						<li>One number</li>
					</ul>
				</div>

				<div class="mt-6">
					<Button name="save password" icon={Save} onClick="" />
				</div>
			</div>
		</div>

		<!-- Data & Privacy Section -->
		<div class="rounded-lg border border-gray-200 bg-white p-6">
			<div class="mb-6 flex flex-col items-start gap-3 sm:flex-row">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10">
					<Shield class="h-5 w-5 text-[#ff4d00]" />
				</div>
				<div>
					<h2 class="text-xl font-semibold text-gray-800">Data & Privacy</h2>
					<p class="text-gray-600">Manage your data and privacy settings</p>
				</div>
			</div>

			<div class="space-y-4">
				<div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
					<div>
						<h3 class="font-medium text-gray-800">Export Your Data</h3>
						<p class="text-sm text-gray-600">Download a copy of all your data</p>
					</div>
					<button
						onclick={handleExportData}
						class="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
					>
						<Download class="h-4 w-4" />
						Export Data
					</button>
				</div>

				<div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
					<div>
						<h3 class="font-medium text-red-600">Delete Account</h3>
						<p class="text-sm text-gray-600">Permanently delete your account and all data</p>
					</div>
					<button
						onclick={handleDeleteAccount}
						class="flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
					>
						<Trash2 class="h-4 w-4" />
						Delete Account
					</button>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.custom-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: #ff4d00 transparent;
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 8px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
		border-radius: 4px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e5e7eb;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #d1d5db;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:active {
		background: #9ca3af;
	}
</style>
