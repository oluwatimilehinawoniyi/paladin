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
		EyeOff,
		AlertCircle
	} from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { modalStore } from '$lib/stores/modalStore';
	import { apiService } from '$lib/api/apiService';
	import { onMount } from 'svelte';

	// Profile form state
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let bio = $state('');

	// Loading states
	let isLoadingProfile = $state(false);
	let isSavingProfile = $state(false);
	let isDeletingAccount = $state(false);

	// Messages
	let successMessage = $state('');
	let errorMessage = $state('');

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

	// Load user data on mount
	onMount(async () => {
		await loadUserProfile();
	});

	async function loadUserProfile() {
		try {
			isLoadingProfile = true;
			const response = await apiService.getCurrentUser();
			const user = response.data.user || response.data;

			firstName = user.firstName || '';
			lastName = user.lastName || '';
			email = user.email || '';
			bio = user.bio || '';
		} catch (error) {
			console.error('Failed to load user profile:', error);
			errorMessage = 'Failed to load user profile';
		} finally {
			isLoadingProfile = false;
		}
	}

	async function handleSaveProfile() {
		try {
			isSavingProfile = true;
			errorMessage = '';
			successMessage = '';

			await apiService.updateUserProfile({
				firstName: firstName.trim(),
				lastName: lastName.trim()
			});

			successMessage = 'Profile updated successfully!';
			setTimeout(() => (successMessage = ''), 3000);
		} catch (error) {
			console.error('Failed to save profile:', error);
			errorMessage = error instanceof Error ? error.message : 'Failed to save profile';
		} finally {
			isSavingProfile = false;
		}
	}

	function handleSaveNotifications() {
		console.log('Saving notifications:', {
			emailNotifications,
			applicationUpdates,
			weeklyReports,
			marketingEmails
		});
		// Add your notification save logic here
		successMessage = 'Notification preferences saved!';
		setTimeout(() => (successMessage = ''), 3000);
	}

	function handleExportData() {
		console.log('Exporting user data...');
		// Add your data export logic here
		successMessage = 'Data export initiated. You will receive an email with your data.';
		setTimeout(() => (successMessage = ''), 3000);
	}

	async function handleDeleteAccount() {
		modalStore.open({
			component: () => import('$lib/components/modals/ConfirmationModal.svelte'),
			props: {
				title: 'Delete Account',
				message:
					'Are you sure you want to permanently delete your account and all data? This action cannot be undone.',
				type: 'danger',
				onConfirm: async () => {
					try {
						isDeletingAccount = true;
						await apiService.deleteAccount();

						// Redirect to home page after successful deletion
						window.location.href = '/';
					} catch (error) {
						console.error('Account deletion failed:', error);
						errorMessage = error instanceof Error ? error.message : 'Failed to delete account';
						isDeletingAccount = false;
					}
				}
			},
			options: { size: 'md' }
		});
	}

	function toggleTheme() {
		isDarkMode = !isDarkMode;
		console.log('Theme changed to:', isDarkMode ? 'dark' : 'light');
		// Add your theme toggle logic here
		successMessage = `Switched to ${isDarkMode ? 'dark' : 'light'} mode!`;
		setTimeout(() => (successMessage = ''), 3000);
	}

	// Clear messages after 5 seconds
	$effect(() => {
		if (errorMessage) {
			setTimeout(() => (errorMessage = ''), 5000);
		}
	});
</script>

<section class="flex h-full w-full flex-col gap-8 overflow-hidden p-4 md:h-screen md:pt-14">
	<!-- header -->
	<div class="">
		<h1 class="text-2xl font-bold text-gray-700 capitalize">settings</h1>
		<p class="text-gray-500">Manage your account settings and preferences</p>
	</div>

	<!-- Success/Error Messages -->
	{#if successMessage}
		<div class="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
			<Save class="h-5 w-5 text-green-600" />
			<p class="text-sm text-green-800">{successMessage}</p>
		</div>
	{/if}

	{#if errorMessage}
		<div class="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
			<AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
			<p class="text-sm text-red-800">{errorMessage}</p>
		</div>
	{/if}

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

			{#if isLoadingProfile}
				<div class="flex items-center justify-center py-8">
					<div class="text-center">
						<div
							class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ff4d00] border-t-transparent"
						></div>
						<p class="mt-2 text-gray-600">Loading profile...</p>
					</div>
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<label for="firstName" class="mb-1 block text-sm font-medium text-gray-700">
							First Name
						</label>
						<input
							type="text"
							id="firstName"
							bind:value={firstName}
							disabled={isSavingProfile}
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
							disabled={isSavingProfile}
							class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>

					<div class="md:col-span-2">
						<label for="email" class="mb-1 block text-sm font-medium text-gray-700">
							Email Address
						</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							disabled
							class="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-50 px-3 py-2 opacity-50"
						/>
						<p class="mt-1 text-xs text-gray-500">Email cannot be changed for security reasons</p>
					</div>
				</div>

				<div class="mt-6">
					<Button
						name={isSavingProfile ? 'Saving...' : 'Save Profile'}
						icon={Save}
						onClick={handleSaveProfile}
						classes={isSavingProfile ? 'opacity-50 cursor-not-allowed' : ''}
					/>
				</div>
			{/if}
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
						disabled={isDeletingAccount}
						class="flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<Trash2 class="h-4 w-4" />
						{isDeletingAccount ? 'Deleting...' : 'Delete Account'}
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
