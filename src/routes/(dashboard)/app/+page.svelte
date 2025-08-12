<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { modalStore } from '$lib/stores/modalStore';
	import { Calendar, Download, Plus, Save, SquarePen, Trash2, UserRoundPlus } from '@lucide/svelte';
	import { format } from 'date-fns';

	// Get SSR data
	let { data } = $props();
	
	// SSR data is immediately available
	let profiles = $state(data.profiles);
	
	// Client-side state for enhanced interactions
	// let isCreatingProfile = $state(false);
	let isDeletingProfile = $state(false);
	let errorMessage = $state('');

	// Progressive enhancement: refresh data when needed
	async function refreshProfiles() {
		await invalidate('app:profiles');
	}

	function handleEdit(profileId: string) {
		// Use programmatic navigation for better UX
		window.location.href = `/app/profile/${profileId}/edit`;
	}

	function handleDelete(profileId: string) {
		modalStore.open({
			component: () => import('$lib/components/modals/ConfirmationModal.svelte'),
			props: {
				title: 'Delete Profile',
				message: 'Are you sure you want to delete this profile? This action cannot be undone.',
				onConfirm: async () => {
					try {
						isDeletingProfile = true;
						
						// Optimistic update
						profiles = profiles.filter(p => p.id !== profileId);
						
						// Sync with server
						const response = await fetch(`/api/v1/profiles/${profileId}`, {
							method: 'DELETE',
							credentials: 'include'
						});
						
						if (!response.ok) {
							// Revert optimistic update on error
							await refreshProfiles();
							throw new Error('Failed to delete profile');
						}
						
						// Success - no need to refresh since we already updated optimistically
					} catch (error) {
						console.error('Delete failed:', error);
						errorMessage = 'Failed to delete profile';
						// Revert will happen due to refreshProfiles() call above
					} finally {
						isDeletingProfile = false;
					}
				}
			},
			options: { size: 'sm' }
		});
	}

	function handleDownload(profileId: string) {
		// Direct download - no need for state management
		window.open(`/api/v1/cv/${profileId}/download`, '_blank');
	}

	function handleCreateProfile() {
		// Navigate to dedicated create page for better SEO/UX
		window.location.href = '/app/profile/create';
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	// Clear error messages
	$effect(() => {
		if (errorMessage) {
			const timer = setTimeout(() => errorMessage = '', 5000);
			return () => clearTimeout(timer);
		}
	});
</script>

<section class="flex w-full flex-col gap-8 overflow-hidden p-4 md:h-screen md:pt-14">
	<!-- Header -->
	<div class="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<h1 class="text-2xl font-bold text-gray-700 capitalize">profiles</h1>
			<p class="text-gray-500">Manage your professional profiles for different job applications</p>
		</div>
		<Button name="create profile" icon={UserRoundPlus} onClick={handleCreateProfile} />
	</div>

	<!-- Error Display -->
	{#if errorMessage}
		<div class="rounded-md border border-red-200 bg-red-50 p-3">
			<p class="text-sm text-red-800">{errorMessage}</p>
		</div>
	{/if}

	<!-- Profiles Grid -->
	{#if profiles.length > 0}
		<div class="custom-scrollbar grid gap-4 overflow-y-scroll rounded-md border border-gray-100 p-2 sm:grid-cols-2 lg:grid-cols-3">
			{#each profiles as profile (profile.id)}
				<div class="flex w-fit flex-col justify-between gap-4 rounded-lg p-4 shadow md:p-6">
					<!-- Header -->
					<div class="flex items-center justify-between gap-8">
						<h3 class="text-xl font-semibold capitalize">{profile.title}</h3>
						<div class="flex items-center gap-4">
							<Icon
								icon={SquarePen}
								holderClasses="bg-[#160200]/10 hover:bg-[#160200]/20 cursor-pointer"
								iconClasses=""
								onClick={() => handleEdit(profile.id)}
							/>
							<Icon
								icon={Trash2}
								holderClasses="bg-red-100 hover:bg-red-200 cursor-pointer {isDeletingProfile ? 'opacity-50 cursor-not-allowed' : ''}"
								iconClasses="text-red-400 hover:text-red-500"
								onClick={() => !isDeletingProfile && handleDelete(profile.id)}
							/>
						</div>
					</div>

					<!-- Summary -->
					<div>
						<p
							class="overflow-hidden text-sm text-gray-500"
							style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
						>
							{profile.summary}
						</p>
					</div>

					<!-- Skills -->
					<div class="flex flex-col gap-2">
						<h3 class="text-md font-semibold capitalize">skills</h3>
						<div class="flex flex-wrap items-center gap-2">
							{#each profile.skills as skill}
								<span class="rounded bg-[#160200]/10 px-2 py-0.5 text-sm text-[#160200] capitalize">
									{skill}
								</span>
							{/each}
						</div>
					</div>

					<!-- CV Box -->
					{#if profile.cv}
						<div class="mt-2 flex flex-col gap-2 rounded-md bg-gray-50 p-2">
							<div class="flex items-center justify-between gap-8">
								<h4 class="text-sm font-semibold">{profile.cv.fileName}</h4>
								<div class="flex items-center gap-4">
									<Icon
										icon={Download}
										holderClasses="bg-[#160200]/10 hover:bg-[#160200]/20 size-5 cursor-pointer"
										iconClasses="size-3"
										onClick={() => handleDownload(profile.cv.id)}
									/>
								</div>
							</div>
							<div class="flex items-center gap-4">
								<div class="flex items-center gap-2 text-gray-500">
									<Icon
										icon={Calendar}
										holderClasses="size-fit cursor-auto"
										iconClasses="text-gray-500 size-3"
									/>
									<p class="text-xs">{format(new Date(profile.cv.uploadedAt), 'dd-MM-yyyy')}</p>
								</div>
								<div class="flex items-center gap-2 text-gray-500">
									<Icon
										icon={Save}
										holderClasses="size-fit cursor-auto"
										iconClasses="text-gray-500 size-3"
									/>
									<p class="text-xs">{formatFileSize(profile.cv.size)}</p>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<!-- Empty State -->
		<div class="flex size-full flex-col items-center justify-center gap-6">
			<div class="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
				<div class="flex items-center justify-center rounded-full bg-gray-50 p-4 text-[#ff4d00]/70">
					<UserRoundPlus class="size-20 translate-x-1.5" />
				</div>
				<div class="space-y-2">
					<h2 class="text-2xl font-semibold text-gray-500">Get started with a Profile</h2>
					<p class="text-gray-500">
						The first step is having a profile you can use to get a chance at every company of your
						choice! Let us get you started on this adventure!
					</p>
				</div>
				<Button name="create profile" icon={UserRoundPlus} onClick={handleCreateProfile} />
			</div>
		</div>
	{/if}

	<!-- Streamed Content -->
	{#await data.streamed?.recentApplications}
		<!-- Loading state for secondary content -->
		<div class="rounded-lg bg-gray-50 p-4">
			<div class="animate-pulse">
				<div class="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
				<div class="h-3 bg-gray-200 rounded w-3/4"></div>
			</div>
		</div>
	{:then recentApplications}
		{#if recentApplications?.length > 0}
			<div class="rounded-lg border border-gray-200 bg-white p-4">
				<h3 class="text-lg font-semibold mb-3">Recent Applications</h3>
				<div class="space-y-2">
					{#each recentApplications.slice(0, 3) as app}
						<div class="flex justify-between items-center text-sm">
							<span>{app.company} - {app.position}</span>
							<span class="text-gray-500">{format(new Date(app.dateApplied), 'MMM dd')}</span>
						</div>
					{/each}
				</div>
				<a href="/app/applications" class="text-[#ff4d00] text-sm hover:underline">View all →</a>
			</div>
		{/if}
	{:catch}
		<!-- Silent fail for secondary content -->
	{/await}
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