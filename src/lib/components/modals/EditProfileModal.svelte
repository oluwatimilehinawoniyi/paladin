<script lang="ts">
	import Button from '../ui/Button.svelte';
	import { Save, User } from '@lucide/svelte';

	let { profileId, modalId, closeModal, openModal } = $props();

	let title = '';
	let summary = '';
	let skills = '';
	let cvFile: File | null = null;

	$effect(() => {
		if (profileId) {
			// Load existing profile data
			console.log('Loading profile:', profileId);
			// You would fetch the actual data here
			title = 'Frontend Developer';
			summary = 'Experienced developer...';
			skills = 'React, TypeScript, Next.js';
		}
	});

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		cvFile = target.files?.[0] || null;
	}

	function handleCancel() {
		closeModal();
	}

	function handleUpdateProfile() {
		console.log('Updating profile:', {
			profileId,
			title,
			summary,
			skills: skills.split(',').map((s) => s.trim()),
			cvFile
		});

		// Show success message or confirmation
		openModal({
			component: import('./SuccessModal.svelte'),
			props: {
				title: 'Profile Updated',
				message: 'Your profile has been successfully updated!'
			},
			options: { size: 'sm' }
		});
	}
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10">
			<User class="h-5 w-5 text-[#ff4d00]" />
		</div>
		<div>
			<h2 class="text-xl font-semibold capitalize">edit profile</h2>
			<p class="text-gray-600">Update your profile information</p>
		</div>
	</div>

	<!-- form -->
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
				rows="4"
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
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
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
				placeholder="React, TypeScript, Node.js"
			/>
		</div>

		<div>
			<label for="cv" class="mb-1 block text-sm font-medium text-gray-700 capitalize">
				update CV (.pdf, .doc) <span class="text-[#ff4d00]">*</span>
			</label>
			<input
				type="file"
				name="cv"
				id="cv"
				accept=".pdf,.doc,.docx"
				onchange={handleFileChange}
				class="w-full rounded-md border border-gray-300 px-3 py-2 file:mr-4 file:rounded-md file:border-0 file:bg-[#ff4d00]/10 file:px-3 file:py-1 file:text-sm file:text-[#ff4d00] hover:file:bg-[#ff4d00]/20 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
			/>
			{#if cvFile}
				<p class="mt-1 text-sm text-gray-500">Selected: {cvFile.name}</p>
			{/if}
		</div>
	</div>

	<div class="flex gap-3 pt-4">
		<Button name="update profile" icon={Save} onClick={handleUpdateProfile} />
		<button
			onclick={handleCancel}
			class="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
		>
			Cancel
		</button>
	</div>
</div>
