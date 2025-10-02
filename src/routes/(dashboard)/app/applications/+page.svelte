<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { modalStore } from '$lib/stores/modalStore';
	import { triggerSuccessConfetti } from '$lib/utils/confetti';
	import {
		Send,
		UserPlus,
		FileText,
		Check,
		AlertCircle,
		Wand2,
		Edit3,
		Zap,
		Brain,
		Loader2,
		Sparkles
	} from '@lucide/svelte';
	import { apiService, type ProfileResponse } from '$lib/api/apiService';
	import { jobAnalysisStore } from '$lib/stores/jobAnalysisStore';
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { formatCoverLetter } from '$lib/utils/textFormatting';

	// State
	let profiles: ProfileResponse[] = $state([]);
	let isLoadingProfiles = $state(true);
	let isSendingApplication = $state(false);
	let isAnalyzingJD = $state(false);
	let isGeneratingCoverLetter = $state(false);
	let error = $state('');
	let successMessage = $state('');

	// Mode state
	let isSmartMode = $state(true); // true = JD-powered, false = manual
	let jdAnalyzed = $state(false);

	// Form state
	let jobDescription = $state('');
	let jobEmail = $state('');
	let selectedProfileId = $state('');
	let selectedCategory = $state('');
	let applicationSubject = $state('');
	let coverLetter = $state<string>('');
	let companyName = $state('');
	let jobTitle = $state('');

	const coverLetterCategories = {
		professional: 'Professional/Formal',
		enthusiastic: 'Enthusiastic/Energetic',
		results: 'Results-focused/Quantitative',
		conversational: 'Conversational/Personal'
	};

	// AI extracted data
	let jobDetails = $derived($jobAnalysisStore.jobAnalysis);

	// Get user from auth store
	let user = $derived($authStore.user);

	// Computed values
	let canProceed = $derived(isSmartMode ? jobDescription.trim() && jdAnalyzed : true);
	let selectedProfile = $derived(profiles.find((p) => p.id === selectedProfileId));

	// Can generate cover letter conditions
	let canGenerateCoverLetter = $derived(
		selectedProfileId && (isSmartMode ? jdAnalyzed && jobDetails?.coverLetter : selectedCategory)
	);

	// Variable detection for cover letter validation
	function getUnfilledVariables(text: string): string[] {
		const matches = text.match(/\[([^\]]+)\]/g);
		return matches || [];
	}

	let unfilledVariables = $derived(getUnfilledVariables(coverLetter));
	let unfilledCount = $derived(unfilledVariables.length);
	let canSendApplication = $derived(unfilledCount === 0 && coverLetter.trim().length > 0);

	// Load profiles on mount
	onMount(async () => {
		await loadProfiles();
	});

	async function loadProfiles() {
		try {
			isLoadingProfiles = true;
			error = '';
			const response = await apiService.getProfiles();

			if (Array.isArray(response.data)) {
				profiles = response.data;
			} else {
				profiles = [];
			}
		} catch (err) {
			console.error('Failed to load profiles:', err);
			error = `Failed to load profiles: ${err instanceof Error ? err.message : String(err)}`;
		} finally {
			isLoadingProfiles = false;
		}
	}

	// Toggle between Smart Mode and Manual Mode
	function toggleMode() {
		isSmartMode = !isSmartMode;
		resetForm();
	}

	// AI-powered JD Analysis
	async function analyzeJobDescription() {
		if (!jobDescription.trim()) {
			error = 'Please provide a job description.';
			return;
		}

		if (!selectedProfileId) {
			error = 'Please select a profile first to analyze the job description.';
			return;
		}

		isAnalyzingJD = true;
		error = '';

		try {
			const result = await jobAnalysisStore.analyzeJobDescription(
				selectedProfileId,
				jobDescription
			);

			if (result) {
				jdAnalyzed = true;

				companyName = result.jobDetails.company;
				jobTitle = result.jobDetails.position;
				jobEmail = result.jobDetails.email;
				applicationSubject = `Application for ${result.jobDetails.position} position at ${result.jobDetails.company}`;
			}
		} catch (err) {
			console.error('Failed to analyze job description:', err);
			error = err instanceof Error ? err.message : 'Failed to analyze job description';
		} finally {
			isAnalyzingJD = false;
		}
	}

	// Unified Cover Letter Generation
	async function generateCoverLetter() {
		if (!selectedProfileId) {
			error = 'Please select a profile first.';
			return;
		}

		isGeneratingCoverLetter = true;
		error = '';

		try {
			if (isSmartMode) {
				// Smart Mode: Use AI-generated cover letter from job analysis
				if (jdAnalyzed && jobDetails?.coverLetter) {
					setTimeout(() => {
						coverLetter = formatCoverLetter(jobDetails.coverLetter);
						successMessage = 'AI-generated cover letter ready!';
						isGeneratingCoverLetter = false;
					}, 500);
				} else {
					throw new Error('Job description must be analyzed first in Smart Mode');
				}
			} else {
				// Manual Mode: Generate template-based cover letter
				if (!selectedCategory) {
					throw new Error('Please select a cover letter tone first');
				}

				// prepare population data
				const populationData = {
					companyName: companyName.trim(),
					candidateName: `${user?.firstName} ${user?.lastName}`,
					position: jobTitle.trim()
				};

				const response = await apiService.generateTemplateCoverLetter(
					selectedCategory,
					populationData
				);

				if (response.data) {
					coverLetter = formatCoverLetter(response.data);
					successMessage = 'Template-based cover letter generated successfully!';
				}
			}
		} catch (err) {
			console.error('Failed to generate cover letter:', err);
			error = err instanceof Error ? err.message : 'Failed to generate cover letter';
		} finally {
			if (!isSmartMode) {
				isGeneratingCoverLetter = false;
			}
		}
	}

	async function handleSendApplication() {
		if (!validateForm()) return;

		error = '';
		isSendingApplication = true;

		try {
			const applicationData = {
				profileId: selectedProfileId,
				jobEmail: jobEmail.trim(),
				subject: applicationSubject.trim(),
				bodyText: coverLetter.trim(),
				company: companyName.trim() || jobEmail.split('@')[1]?.split('.')[0] || 'Company',
				jobTitle: jobTitle.trim() || 'Position'
			};

			const response = await apiService.sendJobApplication(applicationData);

			triggerSuccessConfetti();

			setTimeout(() => {
				modalStore.open({
					component: () => import('$lib/components/modals/ApplicationSuccessModal.svelte') as any,
					props: {
						applicationData: {
							company: companyName || jobEmail.split('@')[1]?.split('.')[0] || 'Company',
							position: jobTitle || 'Position',
							recipientEmail: jobEmail,
							profileUsed: selectedProfile?.title || 'Unknown Profile',
							applicationId: response.data?.id || undefined,
							sentAt: new Date().toISOString()
						}
					},
					options: {
						size: 'lg',
						closeOnBackdrop: false, // Force user to interact with success
						closeOnEscape: false
					}
				});
			}, 500);

			setTimeout(() => {
				resetForm();
			}, 1000);

			successMessage = 'Application sent successfully!';
		} catch (err) {
			console.error('Failed to send application:', err);
			error = `Failed to send application: ${err instanceof Error ? err.message : String(err)}`;
		} finally {
			isSendingApplication = false;
		}
	}

	function validateForm(): boolean {
		if (!selectedProfileId) {
			error = 'Please select a profile.';
			return false;
		}

		if (!jobEmail.trim()) {
			error = 'Please provide a job contact email.';
			return false;
		}

		if (!applicationSubject.trim()) {
			error = 'Please provide an application subject.';
			return false;
		}

		if (!coverLetter.trim()) {
			error = 'Please generate or write a cover letter.';
			return false;
		}

		return true;
	}

	function resetForm() {
		jobDescription = '';
		jobEmail = '';
		selectedProfileId = '';
		selectedCategory = '';
		applicationSubject = '';
		coverLetter = '';
		companyName = '';
		jobTitle = '';
		error = '';
		successMessage = '';
		jdAnalyzed = false;

		// Reset the store data
		jobAnalysisStore.reset();
	}

	// Clear messages after 5 seconds
	$effect(() => {
		if (error || successMessage) {
			const timer = setTimeout(() => {
				error = '';
				successMessage = '';
			}, 5000);
			return () => clearTimeout(timer);
		}
	});
</script>

<section class="flex h-full w-full flex-col gap-6 overflow-hidden p-4 lg:h-screen">
	<!-- Header with Mode Toggle -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-700">Job Applications</h1>
			<p class="text-gray-500">Apply for jobs with AI-powered assistance</p>
		</div>

		<!-- Mode Toggle -->
		<div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-2">
			<span class="text-sm font-medium text-gray-700">Mode:</span>
			<button
				onclick={toggleMode}
				class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {isSmartMode
					? 'bg-[#ff4d00] text-white'
					: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
			>
				{#if isSmartMode}
					<Brain class="h-4 w-4" />
					Smart Mode
				{:else}
					<Edit3 class="h-4 w-4" />
					Manual Mode
				{/if}
			</button>
		</div>
	</div>

	<!-- Success/Error Messages -->
	{#if successMessage}
		<div class="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
			<Check class="h-5 w-5 text-green-600" />
			<p class="text-sm text-green-800">{successMessage}</p>
		</div>
	{/if}

	{#if error}
		<div class="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3">
			<AlertCircle class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
			<p class="text-sm text-red-800">{error}</p>
		</div>
	{/if}

	<div class="custom-scrollbar flex-1 space-y-8 overflow-y-auto pb-">
		<!-- Loading Profiles -->
		{#if isLoadingProfiles}
			<div class="flex h-full items-center justify-center">
				<div class="text-center">
					<Loader2 class="mx-auto h-8 w-8 animate-spin text-[#ff4d00]" />
					<p class="mt-2 text-gray-600">Loading profiles...</p>
				</div>
			</div>

			<!-- No Profiles State -->
		{:else if profiles.length === 0}
			<div class="flex h-screen flex-col items-center justify-center">
				<div class="mx-auto flex max-w-lg flex-col items-center gap-8 text-center">
					<div class="relative">
						<div
							class="flex size-16 items-center justify-center rounded-full bg-[#ff4d00]/10 md:size-20"
						>
							<Send class="size-8 text-[#ff4d00]/70 md:size-10" />
						</div>
						<div
							class="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100"
						>
							<UserPlus class="h-4 w-4 text-red-500" />
						</div>
					</div>

					<div class="space-y-2">
						<h2 class="text-xl font-bold text-gray-700 md:text-3xl">No Profile Found</h2>
						<p class="leading-relaxed text-gray-500 md:text-lg">
							To start applying for jobs, you need to create at least one profile.
						</p>
					</div>

					<a
						href="/app"
						class="flex items-center justify-center gap-2 rounded-md bg-[#ff4d00] px-6 py-3 font-medium text-white transition-colors hover:bg-[#ff4d00]/90"
					>
						<UserPlus class="size-5" />
						Create Your First Profile
					</a>
				</div>
			</div>

			<!-- Main Application Form -->
		{:else}
			<div class="grid h-full grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[1fr_1.5fr]">
				<!-- Left Side - Application Form -->
				<div class="space-y-6 overflow-y-auto">
					<div class="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
						<!-- Profile Selection -->
						<div>
							<label for="profile" class="mb-1 block text-sm font-medium text-gray-700">
								Select Profile <span class="text-[#ff4d00]">*</span>
							</label>
							<select
								id="profile"
								bind:value={selectedProfileId}
								disabled={isSendingApplication || (isSmartMode && jdAnalyzed)}
								class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							>
								<option value="">Choose a profile</option>
								{#each profiles as profile}
									<option value={profile.id}>{profile.title}</option>
								{/each}
							</select>
							{#if isSmartMode && !jdAnalyzed}
								<p class="mt-1 text-xs text-gray-500">
									Select profile before analyzing job description
								</p>
							{/if}
						</div>

						<!-- Smart Mode: Job Description Analysis -->
						{#if isSmartMode}
							<div class="space-y-4">
								<div class="flex items-center gap-3">
									<div
										class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10"
									>
										<Brain class="h-5 w-5 text-[#ff4d00]" />
									</div>
									<div>
										<h3 class="text-lg font-semibold">Smart Job Analysis</h3>
										<p class="text-sm text-gray-600">
											Paste the job description and let AI do the work
										</p>
									</div>
								</div>

								<!-- Job Description Input -->
								<div>
									<label for="job_description" class="mb-2 block text-sm font-medium text-gray-700">
										Job Description <span class="text-[#ff4d00]">*</span>
									</label>
									<textarea
										id="job_description"
										bind:value={jobDescription}
										disabled={isAnalyzingJD || jdAnalyzed}
										placeholder="Paste the job description here..."
										rows="6"
										class="w-full resize-none rounded-md border border-gray-300 p-3 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									></textarea>
								</div>

								<!-- Analyze Button -->
								{#if !jdAnalyzed}
									<Button
										name={isAnalyzingJD ? 'Analyzing...' : 'Analyze Job Description'}
										icon={isAnalyzingJD ? Loader2 : Zap}
										onClick={analyzeJobDescription}
										disabled={!jobDescription.trim() || !selectedProfileId || isAnalyzingJD}
										classes="w-full justify-center {isAnalyzingJD ? 'animate-pulse' : ''}"
									/>
								{:else}
									<!-- Analysis Results -->
									<div class="rounded-lg border border-green-200 bg-green-50 p-4">
										<div class="mb-3 flex items-center gap-2">
											<Check class="h-5 w-5 text-green-600" />
											<h4 class="font-semibold text-green-800">Analysis Complete</h4>
										</div>

										<div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
											<div>
												<span class="font-medium text-gray-700">Company:</span>
												<span class="ml-1 text-gray-600">{jobDetails?.jobDetails.company}</span>
											</div>
											<div>
												<span class="font-medium text-gray-700">Position:</span>
												<span class="ml-1 text-gray-600">{jobDetails?.jobDetails.position}</span>
											</div>
											<div>
												<span class="font-medium text-gray-700">Email:</span>
												<span class="ml-1 text-gray-600">{jobDetails?.jobDetails.email}</span>
											</div>
											<div>
												<span class="font-medium text-gray-700">Experience:</span>
												<span class="ml-1 text-gray-600"
													>{jobDetails?.jobDetails.experienceLevel}</span
												>
											</div>
										</div>

										<button
											onclick={() => {
												jdAnalyzed = false;
												resetForm();
											}}
											class="mt-3 text-xs text-green-700 underline hover:text-green-800"
										>
											Re-analyze different job
										</button>
									</div>
								{/if}
							</div>
						{/if}

						<!-- Application Details -->
						{#if canProceed}
							<div class="space-y-4">
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
										<FileText class="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<h3 class="text-lg font-semibold">Application Details</h3>
										<p class="text-sm text-gray-600">Complete your application information</p>
									</div>
								</div>

								<!-- Company and Job Details -->
								<div class="grid gap-4 sm:grid-cols-2">
									<div>
										<label for="company" class="mb-1 block text-sm font-medium text-gray-700">
											Company Name <span class="text-[#ff4d00]">*</span>
										</label>
										<input
											type="text"
											id="company"
											bind:value={companyName}
											disabled={isSendingApplication || (isSmartMode && jdAnalyzed)}
											placeholder="Company Name"
											class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										/>
									</div>

									<div>
										<label for="job_title" class="mb-1 block text-sm font-medium text-gray-700">
											Job Title <span class="text-[#ff4d00]">*</span>
										</label>
										<input
											type="text"
											id="job_title"
											bind:value={jobTitle}
											disabled={isSendingApplication || (isSmartMode && jdAnalyzed)}
											placeholder="Software Engineer"
											class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
										/>
									</div>
								</div>

								<!-- Contact Email -->
								<div>
									<label for="email" class="mb-1 block text-sm font-medium text-gray-700">
										Job Contact Email <span class="text-[#ff4d00]">*</span>
									</label>
									<input
										type="email"
										id="email"
										bind:value={jobEmail}
										disabled={isSendingApplication || (isSmartMode && jdAnalyzed)}
										placeholder="hr@company.com"
										class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</div>

								<!-- Application Subject -->
								<div>
									<label for="subject" class="mb-1 block text-sm font-medium text-gray-700">
										Application Subject <span class="text-[#ff4d00]">*</span>
									</label>
									<input
										type="text"
										id="subject"
										bind:value={applicationSubject}
										disabled={isSendingApplication}
										placeholder="Application for [Job Title] position"
										class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Right Side - Cover Letter -->
				<div class="space-y-6 overflow-y-auto">
					<div class="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
									<Sparkles class="h-5 w-5 text-purple-600" />
								</div>
								<div>
									<h3 class="text-lg font-semibold">Cover Letter</h3>
									<p class="text-sm text-gray-600">
										{isSmartMode
											? 'AI-generated personalized cover letter'
											: 'Template-based cover letter'}
									</p>
								</div>
							</div>

							<!-- Single Generate Button -->
							{#if canGenerateCoverLetter}
								<Button
									name={isGeneratingCoverLetter ? 'Generating...' : 'Generate'}
									icon={isGeneratingCoverLetter ? Loader2 : Wand2}
									onClick={generateCoverLetter}
									disabled={isGeneratingCoverLetter}
									classes="text-sm {isGeneratingCoverLetter ? 'animate-pulse' : ''}"
								/>
							{/if}
						</div>

						<!-- Manual Mode: Cover Letter Category Selection -->
						{#if !isSmartMode}
							<div>
								<label for="tone" class="mb-1 block text-sm font-medium text-gray-700">
									Cover Letter Tone <span class="text-[#ff4d00]">*</span>
								</label>
								<select
									id="tone"
									bind:value={selectedCategory}
									disabled={isSendingApplication}
									class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								>
									<option value="">Choose a tone</option>
									{#each Object.entries(coverLetterCategories) as [key, label]}
										<option value={key}>{label}</option>
									{/each}
								</select>
								<p class="mt-1 text-xs text-gray-500">
									Select a tone before generating a cover letter
								</p>
							</div>
						{/if}

						<!-- Cover Letter Textarea -->
						<div>
							<!-- Variable Warning UI -->
							{#if unfilledCount > 0 && coverLetter.length > 0}
								<div
									class="mb-3 flex flex-col items-center gap-2 rounded-md border border-orange-200 bg-orange-50 p-3"
								>
									<div class="flex items-center gap-4">
										<AlertCircle class="h-5 w-5 text-orange-600" />
										<p class="text-sm font-medium text-orange-800">
											{unfilledCount} variable{unfilledCount > 1 ? 's' : ''} remaining
										</p>
									</div>
									<p class="text-xs text-orange-700">
										Please replace the bracketed placeholders: {unfilledVariables.join(', ')}
									</p>
								</div>
							{/if}

							<div class="relative">
								<textarea
									bind:value={coverLetter}
									disabled={isSendingApplication}
									placeholder={selectedProfileId
										? canGenerateCoverLetter
											? "Click 'Generate' to create a personalized cover letter"
											: isSmartMode
												? 'Analyze job description first to generate cover letter'
												: 'Select a tone first to generate cover letter'
										: 'Select a profile first to generate a cover letter'}
									rows="10"
									class="w-full resize-none rounded-md border border-gray-300 p-3 text-sm focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								></textarea>
								<!-- Variable highlighting overlay (optional enhancement) -->
								<!-- {#if unfilledCount > 0}
									<div
										class="pointer-events-none absolute inset-0 rounded-md p-3 text-sm text-transparent"
										style="white-space: pre-wrap; word-wrap: break-word; font-family: inherit;"
									>
										{@html coverLetter.replace(
											/\[([^\]]+)\]/g,
											'<span class="bg-[#ff4d00]/20 text-[#ff4d00] font-semibold">[$1]</span>'
										)}
									</div>
								{/if} -->
							</div>
						</div>

						<!-- Send Application Button -->
						<Button
							name={isSendingApplication ? 'Sending...' : 'Send Application'}
							icon={Send}
							onClick={canSendApplication
								? handleSendApplication
								: () => {
										if (unfilledCount > 0) {
											error = `Please fill in the remaining ${unfilledCount} variable${unfilledCount > 1 ? 's' : ''} in your cover letter before sending.`;
										} else {
											error = 'Please generate a cover letter first.';
										}
									}}
							disabled={isSendingApplication}
							classes="w-full justify-center {isSendingApplication
								? 'opacity-50 cursor-not-allowed bg-gray-400'
								: ''}"
						/>
					</div>
				</div>
			</div>
		{/if}
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
