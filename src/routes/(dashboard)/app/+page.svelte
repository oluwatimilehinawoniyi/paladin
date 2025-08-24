<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { modalStore } from '$lib/stores/modalStore';
	import { profilesStore } from '$lib/stores/profilesStore';
	import { formatDate } from "$lib/utils/formatDate";
	import { formatFileSize } from "$lib/utils/formatFileSize";
	import {
		Upload,
		Loader2,
		Download,
		SquarePen,
		Trash2,
		UserRoundPlus,
		FileText,
		Users,
		AlertCircle,
		RefreshCw,
		Check,
		X,
		Plus
	} from '@lucide/svelte';
	import { onMount } from 'svelte';

	// Subscribe to profiles store
	let profiles = $derived($profilesStore.profiles);
	let isLoading = $derived($profilesStore.isLoading);
	let error = $derived($profilesStore.error);

	// Edit state for each profile
	let editingProfiles = $state<
		Record<
			string,
			{
				title: string;
				summary: string;
				skillsInput: string;
				isSubmitting: boolean;
				error: string;
				replacingCV?: boolean;
			}
		>
	>({});

	// Load profiles on mount
	onMount(async () => {
		await profilesStore.loadProfiles();
	});

	function startEdit(profileId: string) {
		const profile = profiles.find((p) => p.id === profileId);

		if (!profile) {
			return;
		}

		editingProfiles[profileId] = {
			title: profile.title,
			summary: profile.summary,
			skillsInput: profile.skills.join(', '),
			isSubmitting: false,
			error: ''
		};

		editingProfiles = { ...editingProfiles };
	}

	function cancelEdit(profileId: string) {
		delete editingProfiles[profileId];
		editingProfiles = { ...editingProfiles };
	}

	async function saveEdit(profileId: string) {
		const editData = editingProfiles[profileId];
		if (!editData) return;

		const skills = editData.skillsInput
			.split(',')
			.map((skill) => skill.trim())
			.filter((skill) => skill.length > 0);

		if (!editData.title.trim() || !editData.summary.trim() || skills.length === 0) {
			editingProfiles[profileId].error = 'All fields are required';
			editingProfiles = { ...editingProfiles };
			return;
		}

		editingProfiles[profileId].isSubmitting = true;
		editingProfiles[profileId].error = '';
		editingProfiles = { ...editingProfiles };

		try {
			await profilesStore.updateProfile(profileId, {
				title: editData.title.trim(),
				summary: editData.summary.trim(),
				skills
			});

			// success - remove from editing state
			delete editingProfiles[profileId];
			editingProfiles = { ...editingProfiles };
		} catch (error) {
			console.error('Failed to update profile:', error);
			editingProfiles[profileId].error =
				error instanceof Error ? error.message : 'Failed to update profile';
			editingProfiles[profileId].isSubmitting = false;
			editingProfiles = { ...editingProfiles };
		}
	}

	async function handleDelete(profileId: string) {
		const profile = profiles.find((p) => p.id === profileId);
		if (!profile) return;

		modalStore.open({
			component: () => import('$lib/components/modals/ConfirmationModal.svelte') as any,
			props: {
				title: 'Delete Profile',
				message: `Are you sure you want to delete "${profile.title}"? This action cannot be undone.`,
				onConfirm: async () => {
					try {
						await profilesStore.deleteProfile(profileId);

						// Clean up editing state for deleted profile
						if (editingProfiles[profileId]) {
							delete editingProfiles[profileId];
							editingProfiles = { ...editingProfiles };
						}
					} catch (error) {
						console.error('Failed to delete profile:', error);
					}
				}
			},
			options: { size: 'sm' }
		});
	}

	async function handleDownload(cvId: string, fileName: string) {
		try {
			await profilesStore.downloadCV(cvId, fileName);
		} catch (error) {
			console.error('Download failed:', error);
		}
	}

	async function handleDeleteCV(cvId: string, profileId: string) {
		modalStore.open({
			component: () => import('$lib/components/modals/ConfirmationModal.svelte') as any,
			props: {
				title: 'Delete CV',
				message: 'Are you sure you want to delete this CV? This action cannot be undone.',
				onConfirm: async () => {
					try {
						await profilesStore.deleteCV(cvId, profileId);
					} catch (error) {
						console.error('Failed to delete CV:', error);
					}
				}
			}
		});
	}

	function handleCreateProfile() {
		modalStore.open({
			component: () => import('$lib/components/modals/CreateProfileModal.svelte') as any,
			options: { size: 'md' },
			props: {
				onSuccess: () => {
					profilesStore.loadProfiles();
				}
			}
		});
	}

	async function handleRetry() {
		await profilesStore.loadProfiles();
	}

	function handleClearError() {
		profilesStore.clearError();
	}

	function isEditing(profileId: string): boolean {
		const result = profileId in editingProfiles;
		return result;
	}

	function getSkillsArray(skillsInput: string): string[] {
		return skillsInput
			.split(',')
			.map((skill) => skill.trim())
			.filter((skill) => skill.length > 0);
	}

	function addSkill(profileId: string, event: KeyboardEvent) {
		if (event.key === 'Enter') {
			const input = event.target as HTMLInputElement;
			const newSkill = input.value.trim();
			if (newSkill && editingProfiles[profileId]) {
				const currentSkills = editingProfiles[profileId].skillsInput;
				editingProfiles[profileId].skillsInput = currentSkills
					? `${currentSkills}, ${newSkill}`
					: newSkill;
				input.value = '';
				editingProfiles = { ...editingProfiles };
			}
		}
	}

	function removeSkill(profileId: string, skillToRemove: string) {
		if (editingProfiles[profileId]) {
			const skills = getSkillsArray(editingProfiles[profileId].skillsInput);
			const filteredSkills = skills.filter((skill) => skill !== skillToRemove);
			editingProfiles[profileId].skillsInput = filteredSkills.join(', ');
			editingProfiles = { ...editingProfiles };
		}
	}

	// Add these new state variables
	let cvReplaceInputs = $state<Record<string, HTMLInputElement>>({});
	let cvAddInputs = $state<Record<string, HTMLInputElement>>({});

	// Add these new functions:
	function triggerCVReplace(profileId: string) {
		cvReplaceInputs[profileId]?.click();
	}

	function triggerCVAdd(profileId: string) {
		cvAddInputs[profileId]?.click();
	}

	async function handleCVReplace(event: Event, profileId: string) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		// Validate file
		const allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		];
		if (!allowedTypes.includes(file.type)) {
			editingProfiles[profileId].error = 'Please upload a PDF or Word document';
			editingProfiles = { ...editingProfiles };
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			editingProfiles[profileId].error = 'File size must be less than 5MB';
			editingProfiles = { ...editingProfiles };
			return;
		}

		try {
			editingProfiles[profileId].replacingCV = true;
			editingProfiles[profileId].error = '';
			editingProfiles = { ...editingProfiles };

			// Call the CV replacement API
			await profilesStore.replaceCVForProfile(profileId, file);

			// Refresh profiles to get updated CV info
			await profilesStore.loadProfiles();
		} catch (error) {
			console.error('Failed to replace CV:', error);
			editingProfiles[profileId].error =
				error instanceof Error ? error.message : 'Failed to replace CV';
		} finally {
			editingProfiles[profileId].replacingCV = false;
			editingProfiles = { ...editingProfiles };

			target.value = '';
		}
	}

	async function handleCVAdd(event: Event, profileId: string) {
		// Same logic as handleCVReplace but for adding new CV
		await handleCVReplace(event, profileId);
	}
</script>

<section class="flex w-full flex-col gap-8 overflow-hidden p-4 md:h-screen md:pt-14">
	<!-- Header -->
	<div class="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<h1 class="text-2xl font-bold text-gray-700 capitalize">Profiles</h1>
			<p class="text-gray-500">Manage your professional profiles for different job applications</p>
		</div>
		<Button
			name="Create Profile"
			icon={UserRoundPlus}
			onClick={handleCreateProfile}
			disabled={isLoading}
		/>
	</div>

	<!-- Error Message -->
	{#if error}
		<div class="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-4">
			<AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
			<div class="flex-1">
				<p class="text-sm text-red-800">{error}</p>
			</div>
			<div class="flex gap-2">
				<button onclick={handleRetry} class="text-xs text-red-600 underline hover:text-red-800">
					Retry
				</button>
				<button
					onclick={handleClearError}
					class="text-xs text-red-600 underline hover:text-red-800"
				>
					Dismiss
				</button>
			</div>
		</div>
	{/if}

	<!-- Loading State -->
	{#if isLoading}
		<div class="flex h-full items-center justify-center">
			<div class="text-center">
				<div
					class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ff4d00] border-t-transparent"
				></div>
				<p class="mt-2 text-gray-600">Loading profiles...</p>
			</div>
		</div>
		<!-- Empty State -->
	{:else if profiles.length === 0}
		<div class="flex h-full flex-col items-center justify-center">
			<div class="mx-auto flex max-w-lg flex-col items-center gap-8 text-center">
				<!-- Icon -->
				<div class="relative">
					<div
						class="flex size-16 items-center justify-center rounded-full bg-[#ff4d00]/10 md:size-20"
					>
						<Users class="size-8 text-[#ff4d00]/70 md:size-10" />
					</div>
					<div
						class="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100"
					>
						<UserRoundPlus class="h-4 w-4 text-blue-500" />
					</div>
				</div>

				<!-- Content -->
				<div class="space-y-2">
					<h2 class="text-xl font-bold text-gray-700 md:text-3xl">No Profiles Yet</h2>
					<p class="leading-relaxed text-gray-500 md:text-lg">
						Create your first professional profile to start applying for jobs with personalized
						cover letters.
					</p>
				</div>

				<!-- Features -->
				<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4d00]/10">
							<FileText class="h-4 w-4 text-[#ff4d00]" />
						</div>
						<div class="text-left">
							<p class="text-xs font-medium text-gray-800 sm:text-base">Upload CV</p>
							<p class="text-xs text-gray-600 sm:text-sm">Attach your resume</p>
						</div>
					</div>

					<div class="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4d00]/10">
							<Users class="h-4 w-4 text-[#ff4d00]" />
						</div>
						<div class="text-left">
							<p class="text-xs font-medium text-gray-800 sm:text-base">Multiple Profiles</p>
							<p class="text-xs text-gray-600 sm:text-sm">Different job types</p>
						</div>
					</div>
				</div>

				<!-- CTA -->
				<Button
					name="Create Your First Profile"
					icon={UserRoundPlus}
					onClick={handleCreateProfile}
					classes="w-full justify-center"
				/>
			</div>
		</div>
		<!-- Profiles Grid -->
	{:else}
		<div
			class="custom-scrollbar grid h-full gap-4 overflow-y-scroll rounded-md border border-gray-100 p-2 sm:grid-cols-2 lg:grid-cols-3"
		>
			{#each profiles as profile (profile.id)}
				{@const editing = editingProfiles[profile.id]}
				{@const inEditMode = isEditing(profile.id)}

				<div
					class="flex w-full flex-col justify-between gap-4 rounded-lg p-4 shadow md:p-6 {isEditing(
						profile.id
					)
						? 'bg-[#ff4d00]/5 ring-2 ring-[#ff4d00]/20'
						: ''}"
				>
					<!-- Header -->
					<div class="flex items-start justify-between gap-4">
						{#if inEditMode}
							<!-- Edit Mode: Title Input -->
							<div class="flex-1">
								<input
									type="text"
									bind:value={editing.title}
									disabled={editing.isSubmitting}
									placeholder="Profile title"
									class="w-full border-b border-gray-300 bg-transparent pb-1 text-xl font-semibold focus:border-[#ff4d00] focus:outline-none disabled:opacity-50"
								/>
							</div>
						{:else}
							<!-- View Mode: Title Display -->
							<h3 class="flex-1 text-xl font-semibold capitalize">{profile.title}</h3>
						{/if}

						<!-- Action Buttons -->
						<div class="flex items-center gap-2">
							{#if inEditMode}
								<!-- Edit Mode Actions -->
								<button
									onclick={() => saveEdit(profile.id)}
									disabled={editing.isSubmitting}
									class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors hover:bg-green-200 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
									title="Save changes"
								>
									<Check class="h-4 w-4" />
								</button>
								<button
									onclick={() => cancelEdit(profile.id)}
									disabled={editing.isSubmitting}
									class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
									title="Cancel edit"
								>
									<X class="h-4 w-4" />
								</button>
							{:else}
								<!-- View Mode Actions -->
								<Icon
									icon={SquarePen}
									holderClasses="bg-[#160200]/10 hover:bg-[#160200]/20 cursor-pointer"
									iconClasses=""
									onClick={() => {
										startEdit(profile.id);
									}}
								/>
								<Icon
									icon={Trash2}
									holderClasses="bg-red-100 hover:bg-red-200 cursor-pointer"
									iconClasses="text-red-400 hover:text-red-500"
									onClick={() => handleDelete(profile.id)}
								/>
							{/if}
						</div>
					</div>

					<!-- Edit Error Message -->
					{#if inEditMode && editing.error}
						<div class="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-2">
							<AlertCircle class="h-4 w-4 flex-shrink-0 text-red-600" />
							<p class="text-xs text-red-800">{editing.error}</p>
						</div>
					{/if}

					<!-- Summary -->
					<div>
						{#if inEditMode}
							<!-- Edit Mode: Summary Textarea -->
							<textarea
								bind:value={editing.summary}
								disabled={editing.isSubmitting}
								placeholder="Professional summary"
								rows="3"
								class="w-full resize-none rounded-md border border-gray-300 bg-transparent p-2 text-sm text-gray-500 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:opacity-50"
							></textarea>
						{:else}
							<!-- View Mode: Summary Display -->
							<p
								class="overflow-hidden text-sm text-gray-500"
								style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;"
							>
								{profile.summary}
							</p>
						{/if}
					</div>

					<!-- Skills -->
					<div class="flex flex-col gap-2">
						<h3 class="text-md font-semibold capitalize">Skills</h3>

						{#if inEditMode}
							<!-- Edit Mode: Skills Management -->
							<div class="space-y-2">
								<!-- Current Skills -->
								<div class="flex flex-wrap items-center gap-2">
									{#each getSkillsArray(editing.skillsInput) as skill}
										<span
											class="inline-flex items-center gap-1 rounded bg-[#160200]/10 px-2 py-0.5 text-sm text-[#160200]"
										>
											{skill}
											<button
												onclick={() => removeSkill(profile.id, skill)}
												class="ml-1 text-red-500 hover:text-red-700"
											>
												<X class="h-3 w-3" />
											</button>
										</span>
									{/each}
								</div>

								<!-- Skills Input -->
								<input
									type="text"
									bind:value={editing.skillsInput}
									disabled={editing.isSubmitting}
									placeholder="Comma separated skills: React, TypeScript, Node.js"
									class="w-full rounded-md border border-gray-300 bg-transparent px-2 py-1 text-sm focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:opacity-50"
								/>
							</div>
						{:else}
							<!-- View Mode: Skills Display -->
							<div class="flex flex-wrap items-center gap-2">
								{#each profile.skills as skill}
									<p class="rounded bg-[#160200]/10 px-2 py-0.5 text-sm text-[#160200] capitalize">
										{skill}
									</p>
								{/each}
							</div>
						{/if}
					</div>

					<!-- CV Box -->
					{#if profile.cv}
						<div class="mt-2 flex flex-col gap-2 rounded-md bg-gray-50 p-2">
							<!-- Header -->
							<div class="flex items-center justify-between gap-8">
								<h4 class="truncate text-sm font-semibold">{profile.cv.fileName}</h4>
								<div class="flex items-center gap-2">
									{#if isEditing(profile.id)}
										<!-- Edit Mode: Replace CV option -->
										<button
											onclick={() => triggerCVReplace(profile.id)}
											class="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-blue-100 transition-colors hover:bg-blue-200"
											title="Replace CV"
											disabled={editing?.isSubmitting}
										>
											<Upload class="h-3 w-3 text-blue-600" />
										</button>
										<!-- Hidden file input for CV replacement -->
										<input
											type="file"
											bind:this={cvReplaceInputs[profile.id]}
											onchange={(e) => handleCVReplace(e, profile.id)}
											accept=".pdf,.doc,.docx"
											class="hidden"
											disabled={editing?.isSubmitting}
										/>
									{:else}
										<!-- View Mode: Download and Delete -->
										<button
											onclick={() => handleDownload(profile.cv!.id, profile.cv!.fileName)}
											class="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-[#160200]/10 transition-colors hover:bg-[#160200]/20"
											title="Download CV"
										>
											<Download class="h-3 w-3" />
										</button>
										<button
											onclick={() => handleDeleteCV(profile.cv!.id, profile.id)}
											class="flex h-6 w-6 cursor-pointer items-center justify-center rounded bg-red-100 transition-colors hover:bg-red-200"
											title="Delete CV"
										>
											<Trash2 class="h-3 w-3 text-red-400 hover:text-red-500" />
										</button>
									{/if}
								</div>
							</div>

							<!-- CV Details -->
							<div class="flex items-center justify-between text-xs text-gray-500">
								<span>{formatDate(profile.cv.uploadedAt)}</span>
								<span>{formatFileSize(profile.cv.size)}</span>
							</div>

							<!-- CV Replacement Status (Edit Mode Only) -->
							{#if isEditing(profile.id) && editing?.replacingCV}
								<div class="flex items-center gap-2 text-xs text-blue-600">
									<Loader2 class="h-3 w-3 animate-spin" />
									<span>Replacing CV...</span>
								</div>
							{/if}
						</div>
					{:else}
						<div class="mt-2 flex flex-col gap-2 rounded-md bg-gray-50 p-2">
							{#if isEditing(profile.id)}
								<!-- Edit Mode: Add CV option -->
								<button
									onclick={() => triggerCVAdd(profile.id)}
									class="flex cursor-pointer items-center justify-center gap-2 py-4 text-sm text-gray-600 transition-colors hover:text-gray-800"
									disabled={editing?.isSubmitting}
								>
									<Upload class="h-4 w-4" />
									<span>Add CV</span>
								</button>
								<!-- Hidden file input for CV addition -->
								<input
									type="file"
									bind:this={cvAddInputs[profile.id]}
									onchange={(e) => handleCVAdd(e, profile.id)}
									accept=".pdf,.doc,.docx"
									class="hidden"
									disabled={editing?.isSubmitting}
								/>
							{:else}
								<!-- View Mode: No CV message -->
								<div class="flex items-center justify-center py-4">
									<p class="text-sm text-gray-500">No CV uploaded</p>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Profile Meta -->
					<div class="border-t border-gray-100 pt-2">
						<div class="flex items-center justify-between text-xs text-gray-500">
							<span>Created: {formatDate(profile.createdAt)}</span>
							{#if profile.updatedAt && profile.updatedAt !== profile.createdAt}
								<span>Updated: {formatDate(profile.updatedAt)}</span>
							{/if}
						</div>
					</div>

					<!-- Loading Overlay for Individual Profile -->
					{#if inEditMode && editing.isSubmitting}
						<div class="absolute inset-0 flex items-center justify-center rounded-lg bg-white/80">
							<div class="text-center">
								<div
									class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#ff4d00] border-t-transparent"
								></div>
								<p class="mt-1 text-xs text-gray-600">Saving...</p>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
