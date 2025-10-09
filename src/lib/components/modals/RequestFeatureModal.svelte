<script lang="ts">
	import { Lightbulb, Loader2, Check } from '@lucide/svelte';
	import { apiService } from '$lib/api/apiService';
	import Button from '$lib/components/ui/Button.svelte';

	let { closeModal } = $props();

	// Form state
	let title = $state('');
	let description = $state('');
	let category = $state('AI_FEATURES');
	let isSubmitting = $state(false);
	let error = $state('');
	let success = $state(false);

	// Categories matching backend enum
	const categories = [
		{ value: 'AI_FEATURES', label: 'AI & Analysis' },
		{ value: 'EMAIL_AUTOMATION', label: 'Email & Communication' },
		{ value: 'UI_UX', label: 'User Interface' },
		{ value: 'JOB_TRACKING', label: 'Job Tracking' },
		{ value: 'CV_MANAGEMENT', label: 'CV Management' },
		{ value: 'INTEGRATIONS', label: 'Integrations' },
		{ value: 'ANALYTICS', label: 'Analytics & Reports' },
		{ value: 'PERFORMANCE', label: 'Performance' },
		{ value: 'MOBILE', label: 'Mobile App' },
		{ value: 'OTHER', label: 'Other' }
	];

	async function handleSubmit() {
		// Validation
		if (title.length < 5) {
			error = 'Title must be at least 5 characters';
			return;
		}
		if (description.length < 20) {
			error = 'Description must be at least 20 characters';
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			await apiService.createFeatureRequest({
				title,
				description,
				category
			});

			success = true;

			// Close modal after success animation
			setTimeout(() => {
				closeModal();
			}, 1500);
		} catch (err: any) {
			error = err.message || 'Failed to submit feature request';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="space-y-6 p-6">
	{#if success}
		<!-- Success State -->
		<div class="space-y-4 py-8 text-center">
			<div class="flex justify-center">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
					<Check class="h-8 w-8 text-green-600" />
				</div>
			</div>
			<div>
				<h2 class="text-xl font-semibold text-gray-900">Feature Request Submitted!</h2>
				<p class="mt-2 text-gray-600">Thanks for your suggestion. We'll review it soon.</p>
			</div>
		</div>
	{:else}
		<!-- Form -->
		<div class="space-y-6">
			<!-- Header -->
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10">
					<Lightbulb class="h-5 w-5 text-[#ff4d00]" />
				</div>
				<div>
					<h2 class="text-xl font-semibold text-gray-900">Request a Feature</h2>
					<p class="text-sm text-gray-600">Help us improve Paladin</p>
				</div>
			</div>

			{#if error}
				<div class="rounded-lg border border-red-200 bg-red-50 p-4">
					<p class="text-sm text-red-600">{error}</p>
				</div>
			{/if}

			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
				class="space-y-4"
			>
				<!-- Category -->
				<div>
					<label for="category" class="mb-2 block text-sm font-medium text-gray-700">
						Category
					</label>
					<select
						id="category"
						bind:value={category}
						class="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#ff4d00]"
						disabled={isSubmitting}
					>
						{#each categories as cat}
							<option value={cat.value}>{cat.label}</option>
						{/each}
					</select>
				</div>

				<!-- Title -->
				<div>
					<label for="title" class="mb-2 block text-sm font-medium text-gray-700">
						Title <span class="text-red-500">*</span>
					</label>
					<input
						id="title"
						type="text"
						bind:value={title}
						placeholder="e.g., Auto follow-up emails after 2 weeks"
						class="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#ff4d00]"
						disabled={isSubmitting}
						required
						minlength="5"
						maxlength="200"
					/>
					<p class="mt-1 text-xs text-gray-500">{title.length}/200 characters (min 5)</p>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="mb-2 block text-sm font-medium text-gray-700">
						Description <span class="text-red-500">*</span>
					</label>
					<textarea
						id="description"
						bind:value={description}
						placeholder="Describe your feature request in detail..."
						rows="3"
						class="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-[#ff4d00]"
						disabled={isSubmitting}
						required
						minlength="20"
					></textarea>
					<p class="mt-1 text-xs text-gray-500">
						{description.length} characters (min 20)
					</p>
				</div>

				<!-- Buttons -->
				<div class="flex gap-3 pt-4">
					<button
						type="button"
						onclick={closeModal}
						disabled={isSubmitting}
						class="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Cancel
					</button>
					<Button
						name={isSubmitting ? 'Submitting...' : 'Submit Request'}
						type="submit"
						disabled={isSubmitting}
						icon={isSubmitting ? Loader2 : undefined}
						classes="flex-1 justify-center {isSubmitting ? 'opacity-75' : ''}"
					/>
				</div>
			</form>
		</div>
	{/if}
</div>
