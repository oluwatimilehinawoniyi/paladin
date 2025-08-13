<script lang="ts">
	import { modalStore } from '$lib/stores/modalStore';
	import { profilesStore } from '$lib/stores/profilesStore';
	import { Upload, X, AlertCircle, Check } from '@lucide/svelte';

	const { onSuccess, modalId } = $props<{
		onSuccess?: () => void;
		modalId: string;
	}>();

	let title = $state('');
	let summary = $state('');
	let skillsInput = $state('');
	let cvFile: File | null = $state(null);
	let fileInput = $state<HTMLInputElement | null>(null);

	let isSubmitting = $state(false);
	let error = $state('');
	let successMessage = $state('');

	let skills = $derived(
		skillsInput
			.split(',')
			.map((skill) => skill.trim())
			.filter((skill) => skill.length > 0)
	);

	let isFormValid = $derived(title.trim() && summary.trim() && skills.length > 0);

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			// Validate file type
			const allowedTypes = [
				'application/pdf',
				'application/msword',
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
			];
			if (!allowedTypes.includes(file.type)) {
				error = 'Please upload a PDF or Word document';
				return;
			}

			// Validate file size (5MB limit)
			if (file.size > 5 * 1024 * 1024) {
				error = 'File size must be less than 5MB';
				return;
			}

			cvFile = file;
			error = '';
		}
	}

	function removeFile() {
		cvFile = null;
		if (fileInput) {
			fileInput.value = '';
		}
	}

	async function handleSubmit() {
		if (!isFormValid) return;

		isSubmitting = true;
		error = '';
		successMessage = '';

		try {
			await profilesStore.createProfile({
				title: title.trim(),
				summary: summary.trim(),
				skills,
				cvFile: cvFile || undefined
			});

			successMessage = 'Profile created successfully!';

			// Call success callback
			if (onSuccess) {
				onSuccess();
			}

			// Close modal after a short delay
			setTimeout(() => {
				modalStore.close(modalId);
			}, 1500);
		} catch (err) {
			console.error('Failed to create profile:', err);
			error = err instanceof Error ? err.message : 'Failed to create profile';
		} finally {
			isSubmitting = false;
		}
	}

	function handleClose() {
		modalStore.close(modalId);
	}

	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
</script>

<div class="max-h-[90vh] wfull overflow-y-auto rounded-lg bg-white">
	<!-- Header -->
	<div class="flex flex-col border-b border-gray-200 p-4">
		<h2 class="text-xl font-semibold capitalize">create profile</h2>
		<p class="text-gray-600 text-sm">Add a profile that reflects your proficiency</p>
	</div>

	<!-- Content -->
	<div class="space-y-6 p-4">
		<!-- Success Message -->
		{#if successMessage}
			<div class="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
				<Check class="h-5 w-5 text-green-600" />
				<p class="text-sm text-green-800">{successMessage}</p>
			</div>
		{/if}

		<!-- Error Message -->
		{#if error}
			<div class="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
				<AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
				<p class="text-sm text-red-800">{error}</p>
			</div>
		{/if}

		<!-- Form -->
		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
			class="space-y-6"
		>
			<!-- Profile Title -->
			<div>
				<label for="title" class="mb-1 block text-sm font-medium text-gray-700">
					Profile Title <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="title"
					bind:value={title}
					disabled={isSubmitting}
					placeholder="e.g., Frontend Developer, Data Scientist"
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					required
				/>
			</div>

			<!-- Summary -->
			<div>
				<label for="summary" class="mb-1 block text-sm font-medium text-gray-700">
					Professional Summary <span class="text-red-500">*</span>
				</label>
				<textarea
					id="summary"
					bind:value={summary}
					disabled={isSubmitting}
					placeholder="Brief description of your experience and expertise..."
					rows="2"
					class="w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					required
				></textarea>
			</div>

			<!-- Skills -->
			<div>
				<label for="skills" class="mb-1 block text-sm font-medium text-gray-700">
					Skills <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="skills"
					bind:value={skillsInput}
					disabled={isSubmitting}
					placeholder="React, TypeScript, Node.js, Python (comma separated)"
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					required
				/>
				{#if skills.length > 0}
					<div class="mt-2 flex flex-wrap gap-2">
						{#each skills as skill}
							<span class="rounded bg-[#ff4d00]/10 px-2 py-1 text-xs text-[#ff4d00]">
								{skill}
							</span>
						{/each}
					</div>
				{/if}
			</div>

			<!-- CV Upload -->
			<div>
				<label class="mb-1 block text-sm font-medium text-gray-700"> Upload CV (Optional) </label>

				{#if cvFile}
					<!-- File Preview -->
					<div class="rounded-md border border-gray-200 bg-gray-50 p-3">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<Upload class="h-4 w-4 text-gray-500" />
								<div>
									<p class="text-sm font-medium text-gray-800">{cvFile.name}</p>
									<p class="text-xs text-gray-500">{formatFileSize(cvFile.size)}</p>
								</div>
							</div>
							<button
								type="button"
								onclick={removeFile}
								disabled={isSubmitting}
								class="text-red-500 hover:text-red-700"
							>
								<X class="h-4 w-4" />
							</button>
						</div>
					</div>
				{:else}
					<!-- File Upload Button -->
					<div class="space-y-1">
						<button
							type="button"
							onclick={() => fileInput?.click()}
							disabled={isSubmitting}
							class="w-full rounded-md border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-3 text-center transition-colors hover:border-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<Upload class="mx-auto mb-2 size-6 text-gray-400" />
							<p class="mb-1 text-sm text-gray-600">Click to upload or drag and drop</p>
							<p class="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
						</button>

						<!-- Hidden file input -->
						<input
							type="file"
							bind:this={fileInput}
							onchange={handleFileSelect}
							accept=".pdf,.doc,.docx"
							disabled={isSubmitting}
							class="hidden"
						/>
					</div>
				{/if}
			</div>
		</form>
	</div>

	<!-- Footer -->
	<div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
		<div class="flex justify-end gap-3">
			<button
				type="button"
				onclick={handleClose}
				disabled={isSubmitting}
				class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-[#ff4d00] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				Cancel
			</button>
			<button
				type="button"
				onclick={handleSubmit}
				disabled={!isFormValid || isSubmitting}
				class="rounded-md border border-transparent bg-[#ff4d00] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff4d00]/90 focus:ring-2 focus:ring-[#ff4d00] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isSubmitting ? 'Creating...' : 'Create Profile'}
			</button>
		</div>
	</div>
</div>
