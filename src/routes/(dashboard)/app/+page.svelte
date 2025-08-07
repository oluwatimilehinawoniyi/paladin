<script lang="ts">
	import { apiService } from '$lib/api/apiService';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { modalStore } from '$lib/stores/modalStore';
	import { Calendar, Download, Plus, Save, SquarePen, Trash2, UserRoundPlus } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let profiles = $state<any[]>([]);
	let isLoadingProfile = $state(false);
	let errorMessage = $state('');

	// Load user data on mount
	onMount(async () => {
		await loadUserProfile();
	});

	async function loadUserProfile() {
		try {
			isLoadingProfile = true;
			const response = await apiService.getProfiles();
			console.log(response.data);
			profiles = response.data;
		} catch (error) {
			console.error('Failed to load user profile:', error);
			errorMessage = 'Failed to load user profile';
		} finally {
			isLoadingProfile = false;
		}
	}

	function handleEdit(id: number) {
		console.log('Edit profile:', id);
		modalStore.open({
			component: () => import('$lib/components/modals/EditProfileModal.svelte') as any,
			props: { profileId: id },
			options: { size: 'lg' }
		});
	}

	function handleDelete(id: number) {
		console.log('Delete profile:', id);
		modalStore.open({
			component: () => import('$lib/components/modals/ConfirmationModal.svelte') as any,
			props: {
				title: 'Delete Profile',
				message: 'Are you sure you want to delete this profile? This action cannot be undone.',
				onConfirm: () => {
					profiles = profiles?.filter((profile) => profile.id !== id);
				}
			},
			options: { size: 'sm' }
		});
	}

	function handleDownload(id: number) {
		console.log('Download CV for profile:', id);
		// Add your download logic here
	}

	function handleDeleteCV(id: number) {
		console.log('Delete CV for profile:', id);
		modalStore.open({
			component: () => import('$lib/components/modals/ConfirmationModal.svelte') as any,
			props: {
				title: 'Delete CV',
				message: 'Are you sure you want to delete this CV?',
				onConfirm: () => {
					console.log('Delete CV for profile:', id);
				}
			}
		});
	}

	function handleCreateProfile() {
		console.log('Create new profile');
		modalStore.open({
			component: () => import('$lib/components/modals/CreateProfileModal.svelte') as any,
			options: { size: 'lg' }
		});
	}
</script>

<section class="flex w-full flex-col gap-8 overflow-hidden p-4 md:h-screen md:pt-14">
	<!-- header -->
	<div class="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div class="">
			<h1 class="text-2xl font-bold text-gray-700 capitalize">profiles</h1>
			<p class="text-gray-500">Manage your professional profiles for different job applications</p>
		</div>
		<Button name="create profile" icon={UserRoundPlus} onClick={handleCreateProfile} />
	</div>

	<!-- profiles -->

	{#if profiles.length > 0}
		<div
			class="custom-scrollbar hfull grid gap-4 overflow-y-scroll rounded-md border border-gray-100 p-2 sm:grid-cols-2 lg:grid-cols-3"
		>
			{#each profiles as profile (profile.id)}
				<div class="flex w-fit flex-col justify-between gap-4 rounded-lg p-4 shadow md:p-6">
					<!-- header -->
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
								holderClasses="bg-red-100 hover:bg-red-200 cursor-pointer"
								iconClasses="text-red-400 hover:text-red-500"
								onClick={() => handleDelete(profile.id)}
							/>
						</div>
					</div>

					<!-- summary -->
					<div class="">
						<p
							class="overflow-hidden text-sm text-gray-500"
							style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
						>
							{profile.summary}
						</p>
					</div>

					<!-- skills -->
					<div class="flex flex-col gap-2">
						<h3 class="text-md font-semibold capitalize">skills</h3>
						<div class="flex flex-wrap items-center gap-2">
							{#each profile.skills as skill}
								<p class="rounded bg-[#160200]/10 px-2 py-0.5 text-sm text-[#160200] capitalize">
									{skill}
								</p>
							{/each}
						</div>
					</div>

					<!-- cv box -->
					<div class="mt-2 flex flex-col gap-2 rounded-md bg-gray-50 p-2">
						<!-- header -->
						<div class="flex items-center justify-between gap-8">
							<h4 class="text-sm font-semibold">{profile.cv.filename}</h4>
							<div class="flex items-center gap-4">
								<Icon
									icon={Download}
									holderClasses="bg-[#160200]/10 hover:bg-[#160200]/20 size-5 cursor-pointer"
									iconClasses="size-3"
									onClick={() => handleDownload(profile.id)}
								/>
								<Icon
									icon={Trash2}
									holderClasses="bg-red-100 hover:bg-red-200 size-5 cursor-pointer"
									iconClasses="text-red-400 hover:text-red-500 size-3"
									onClick={() => handleDeleteCV(profile.id)}
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
								<p class="text-xs">{profile.cv.date}</p>
							</div>
							<div class="flex items-center gap-2 text-gray-500">
								<Icon
									icon={Save}
									holderClasses="size-fit cursor-auto"
									iconClasses="text-gray-500 size-3"
								/>
								<p class="text-xs">{profile.cv.size}</p>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
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
