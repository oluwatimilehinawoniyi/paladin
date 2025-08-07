<script lang="ts">
	import { apiService } from '$lib/api/apiService';
	import Button from '../ui/Button.svelte';
	import { AlertCircle, FileText, Save, Upload, User } from '@lucide/svelte';

	// Required modal props
	let { modalId, closeModal, openModal } = $props();

	let title = $state('');
	let summary = $state('');
	let skills = $state('');
	let cvFile: File | null = $state(null);

	// Loading states
	let isCreatingProfile = $state(false);
	let isUploadingCV = $state(false);
	let error = $state('');

	// Form validation
	let isFormValid = $derived(title.trim() && summary.trim() && skills.trim() && cvFile !== null);

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			const allowedTypes = [
				'application/pdf',
				'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			];

			if (!allowedTypes.includes(file.type)) {
				error = 'Invalid file type. Please upload a PDF, DOC, or DOCX file';
				cvFile = null;
				return;
			}

			const maxSize = 5 * 1024 * 1024;
			if (file.size > maxSize) {
				error = 'File size exceeds 5MB limit';
				cvFile = null;
				return;
			}

			cvFile = file;
			error = '';
		} else {
			cvFile = null;
		}
	}

	function handleCancel() {
		closeModal();
	}

	async function handleCreateProfile() {
		if (!isFormValid) return;

		error = '';
		isCreatingProfile = true;

		try {
			// Step 1: Create the profile first (without CV)
			console.log('Step 1: Creating profile...');
			const profileResponse = await apiService.createProfile({
				title: title.trim(),
				summary: summary.trim(),
				skills: skills
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean)
				// Don't include cvId yet
			});

			const newProfile = profileResponse.data;
			console.log('Profile created successfully:', newProfile);

			// Step 2: Upload CV and link it to the profile
			if (cvFile && newProfile.id) {
				isUploadingCV = true;
				console.log('Step 2: Uploading CV...');

				try {
					const cvResponse = await apiService.uploadCV(cvFile, newProfile.id);
					console.log('CV uploaded successfully:', cvResponse);
				} catch (cvError) {
					console.error('CV upload failed:', cvError);
					// Profile is created but CV upload failed
					error =
						'Profile created, but CV upload failed. You can upload it later from the profile page.';
				}
			}

			closeModal();
			openModal({
				component: () => import('./SuccessModal.svelte'),
				props: {
					title: 'Profile Created',
					message: cvFile
						? 'Your profile and CV have been created successfully.'
						: 'Your profile has been created. You can upload your CV later.'
				},
				options: { size: 'sm' }
			});
		} catch (error) {
			console.error('Profile creation failed:', error);
			error = `Failed to create profile: ${error instanceof Error ? error.message : 'Unknown error'}`;
		} finally {
			isCreatingProfile = false;
			isUploadingCV = false;
		}
	}
	// Computed loading message
	let loadingMessage = $derived(() => {
		if (isUploadingCV) return 'Uploading CV...';
		if (isCreatingProfile) return 'Creating profile...';
		return '';
	});
</script>

<div class="space-y-4">
	<div class="flex items-center gap-3">
		<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10">
			<User class="h-5 w-5 text-[#ff4d00]" />
		</div>
		<div>
			<h2 class="text-xl font-semibold capitalize">create profile</h2>
			<p class="text-gray-600">Add a profile that reflects your proficiency</p>
		</div>
	</div>

	<!-- Error Alert -->
	{#if error}
		<div class="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
			<AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
			<p class="text-sm text-red-800">{error}</p>
		</div>
	{/if}

	<div class="space-y-4">
		<div>
			<label for="title" class="mb-1 block text-sm font-medium text-gray-700 capitalize">
				profile title <span class="text-[#ff4d00]">*</span>
			</label>
			<input
				type="text"
				name="title"
				id="title"
				bind:value={title}
				disabled={isCreatingProfile}
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
				placeholder="e.g., Frontend Developer"
			/>
		</div>

		<div>
			<label for="summary" class="mb-1 block text-sm font-medium text-gray-700 capitalize">
				professional summary <span class="text-[#ff4d00]">*</span>
			</label>
			<textarea
				name="summary"
				id="summary"
				bind:value={summary}
				rows="3"
				disabled={isCreatingProfile}
				class="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
				placeholder="Brief description of your experience..."
			></textarea>
		</div>

		<div>
			<label for="skills" class="mb-1 block text-sm font-medium text-gray-700 capitalize">
				skills (comma-separated) <span class="text-[#ff4d00]">*</span>
			</label>
			<input
				type="text"
				name="skills"
				id="skills"
				bind:value={skills}
				disabled={isCreatingProfile}
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
				placeholder="React, TypeScript, Node.js"
			/>
		</div>

		<div>
			<label for="cv" class="mb-1 block text-sm font-medium text-gray-700 capitalize">
				upload CV (.pdf, .doc, .docx) <span class="text-[#ff4d00]">*</span>
			</label>
			<input
				type="file"
				name="cv"
				id="cv"
				accept=".pdf,.doc,.docx"
				disabled={isCreatingProfile}
				onchange={handleFileChange}
				class="w-full rounded-md border border-gray-300 px-3 py-2 file:mr-4 file:rounded-md file:border-0 file:bg-[#ff4d00]/10 file:px-3 file:py-1 file:text-sm file:text-[#ff4d00] hover:file:bg-[#ff4d00]/20 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
			/>
			<!-- {#if cvFile}
				<p class="mt-1 text-sm text-gray-500">Selected: {cvFile.name}</p>
			{/if} -->
			{#if cvFile}
				<div class="mt-2 flex items-center gap-2 text-sm text-gray-600">
					<FileText class="h-4 w-4" />
					<span>{cvFile.name}</span>
					<span class="text-gray-400">({(cvFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex gap-3 pt-2">
		<Button
			name={loadingMessage() || 'create profile'}
			icon={isCreatingProfile || isUploadingCV ? Upload : Save}
			onClick={handleCreateProfile}
			classes={`${!isFormValid || isCreatingProfile ? 'opacity-50 cursor-not-allowed' : ''}`}
		/>
		<button
			onclick={handleCancel}
			disabled={isCreatingProfile}
			class="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
		>
			Cancel
		</button>
	</div>
</div>
