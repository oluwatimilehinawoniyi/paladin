<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import {
		Send,
		UserPlus,
		Mail,
		FileText,
		ArrowRight,
		PencilLine,
		Check,
		AlertCircle,
		Wand2
	} from '@lucide/svelte';
	import { apiService, type ProfileResponse } from '$lib/api/apiService';
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';

	// State
	let profiles: ProfileResponse[] = $state([]);
	let isLoadingProfiles = $state(true);
	let isSendingApplication = $state(false);
	let isGeneratingCoverLetter = $state(false);
	let error = $state('');
	let successMessage = $state('');

	// Form state
	let jobDescription = $state('');
	let jobEmail = $state('');
	let selectedProfileId = $state('');
	let applicationSubject = $state('');
	let canEditSubject = $state(true);
	let coverLetter = $state('');
	let companyName = $state('');
	let jobTitle = $state('');

	// Get user from auth store
	let user = $derived($authStore.user);

	// Load profiles on mount
	onMount(async () => {
		await loadProfiles();
	});

	async function loadProfiles() {
		try {
			isLoadingProfiles = true;
			error = '';
			const response = await apiService.getProfiles();
			console.log('Profiles response:', response);

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

	// Auto-generate application subject when profile or company changes
	$effect(() => {
		if (selectedProfileId && (companyName || jobEmail) && jobTitle) {
			const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
			const company = companyName || (jobEmail ? jobEmail.split('@')[1].split('.')[0] : '');
			if (selectedProfile && company) {
				applicationSubject = `Application for ${jobTitle} position at ${company}`;
			}
		}
	});

	// Extract company and job info from job description or email
	function extractJobInfo() {
		if (!jobDescription.trim()) return;

		// Simple extraction - you can make this more sophisticated
		const description = jobDescription.toLowerCase();

		// Try to extract job title (look for common patterns)
		const titlePatterns = [
			/job title:\s*([^\n]+)/,
			/position:\s*([^\n]+)/,
			/role:\s*([^\n]+)/,
			/we are looking for a\s*([^\n]+)/,
			/seeking a\s*([^\n]+)/
		];

		for (const pattern of titlePatterns) {
			const match = description.match(pattern);
			if (match && match[1]) {
				jobTitle = match[1].trim();
				break;
			}
		}

		// Try to extract company name from email if not already set
		if (!companyName && jobEmail) {
			const emailDomain = jobEmail.split('@')[1];
			if (emailDomain) {
				companyName = emailDomain.split('.')[0];
			}
		}
	}

	// Generate cover letter based on job description and selected profile
	function generateCoverLetter() {
		if (!selectedProfileId || !jobDescription.trim()) {
			error = 'Please select a profile and provide a job description first.';
			return;
		}

		extractJobInfo();

		const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
		if (!selectedProfile) return;

		isGeneratingCoverLetter = true;

		// Extract company name from email if not provided
		const company =
			companyName || (jobEmail ? jobEmail.split('@')[1].split('.')[0] : 'your company');
		const position = jobTitle || 'the position';

		// Generate a basic cover letter template
		setTimeout(() => {
			coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${position} position at ${company}. With my background as a ${selectedProfile.title}, I am confident that my skills and experience make me an ideal candidate for this role.

${selectedProfile.summary}

My technical expertise includes ${selectedProfile.skills.slice(0, 5).join(', ')}, which aligns perfectly with the requirements outlined in your job description. I am particularly drawn to this opportunity because it would allow me to leverage my experience while contributing to ${company}'s continued success.

Key highlights of my qualifications:
• Proven experience as a ${selectedProfile.title}
• Strong proficiency in ${selectedProfile.skills.slice(0, 3).join(', ')}
• Demonstrated ability to deliver high-quality results in fast-paced environments

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team. Thank you for your consideration, and I look forward to hearing from you.

Best regards,
${user?.firstName || '[Your Name]'} ${user?.lastName || ''}`;

			successMessage = 'Cover letter generated successfully! You can edit it before sending.';
			isGeneratingCoverLetter = false;
			setTimeout(() => (successMessage = ''), 3000);
		}, 1500); // Simulate AI generation time
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
				company: companyName.trim() || jobEmail.split('@')[1].split('.')[0],
				jobTitle: jobTitle.trim() || 'Position'
			};

			const response = await apiService.sendJobApplication(applicationData);
			console.log('Application sent successfully:', response);

			successMessage = 'Application sent successfully!';

			// Reset form
			resetForm();
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
		applicationSubject = '';
		coverLetter = '';
		companyName = '';
		jobTitle = '';
		error = '';
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

<section class="flex h-full w-full flex-col gap-8 overflow-hidden p-4">
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

	<!-- CHECK PROFILE HERE -->
	{#if isLoadingProfiles}
		<div class="flex h-full items-center justify-center">
			<div class="text-center">
				<div
					class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#ff4d00] border-t-transparent"
				></div>
				<p class="mt-2 text-gray-600">Loading profiles...</p>
			</div>
		</div>
	{:else if profiles.length > 0}
		<!-- Job Application Form -->
		<div class="grid h-full grid-cols-1 gap-8 lg:grid-cols-2">
			<!-- Left Side - Quick Apply -->
			<div class="space-y-6">
				<div class="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
					<div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
						<div
							class="flex min-h-10 min-w-10 items-center justify-center rounded-full bg-[#ff4d00]/10"
						>
							<Send class="h-5 w-5 text-[#ff4d00]" />
						</div>
						<div>
							<h2 class="text-xl font-semibold">Quick Apply</h2>
							<p class="text-gray-600">Send your application with just a few clicks</p>
						</div>
					</div>

					<div class="space-y-4">
						<!-- Job Description -->
						<div>
							<label for="job_description" class="mb-1 block text-sm font-medium text-gray-700">
								Job Description <span class="text-[#ff4d00]">*</span>
							</label>
							<div class="relative">
								<textarea
									name="job_description"
									rows="3"
									id="job_description"
									bind:value={jobDescription}
									onblur={extractJobInfo}
									disabled={isSendingApplication}
									placeholder="Paste the job description here..."
									class="w-full resize-none rounded-md border border-gray-300 p-3 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								></textarea>
							</div>
						</div>

						<div class="grid gap-4 sm:grid-cols-2">
							<!-- Job Email -->
							<div>
								<label for="email" class="mb-1 block text-sm font-medium text-gray-700">
									Job Contact Email <span class="text-[#ff4d00]">*</span>
								</label>
								<div class="relative">
									<Mail
										class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
									/>
									<input
										type="email"
										id="email"
										bind:value={jobEmail}
										disabled={isSendingApplication}
										placeholder="hr@company.com"
										class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									/>
								</div>
							</div>

							<!-- Profile Selection -->
							<div>
								<label for="profile" class="mb-1 block text-sm font-medium text-gray-700">
									Select Profile <span class="text-[#ff4d00]">*</span>
								</label>
								<div class="relative">
									<UserPlus
										class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
									/>
									<select
										id="profile"
										bind:value={selectedProfileId}
										disabled={isSendingApplication}
										class="w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
									>
										<option value="">Choose a profile</option>
										{#each profiles as profile}
											<option value={profile.id}>{profile.title}</option>
										{/each}
									</select>
								</div>
							</div>
						</div>

						<!-- Additional fields -->
						<div class="grid gap-4 sm:grid-cols-2">
							<!-- Company Name -->
							<div>
								<label for="company" class="mb-1 block text-sm font-medium text-gray-700">
									Company Name
								</label>
								<input
									type="text"
									id="company"
									bind:value={companyName}
									disabled={isSendingApplication}
									placeholder="Company Name"
									class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								/>
							</div>

							<!-- Job Title -->
							<div>
								<label for="job_title" class="mb-1 block text-sm font-medium text-gray-700">
									Job Title
								</label>
								<input
									type="text"
									id="job_title"
									bind:value={jobTitle}
									disabled={isSendingApplication}
									placeholder="Software Engineer"
									class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
								/>
							</div>
						</div>

						<!-- Application Subject -->
						<div>
							<label for="application_subject" class="mb-1 block text-sm font-medium text-gray-700">
								Application Subject <span class="text-[#ff4d00]">*</span>
							</label>
							<div class="relative">
								<Mail
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
								/>
								<input
									type="text"
									id="application_subject"
									bind:value={applicationSubject}
									disabled={!canEditSubject || isSendingApplication}
									placeholder="Application for [Job Title] position"
									class="w-full {canEditSubject && !isSendingApplication
										? 'cursor-text'
										: 'cursor-not-allowed'} rounded-md border border-gray-300 py-2 pr-10 pl-10 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:opacity-50"
								/>
								<button
									type="button"
									onclick={() => (canEditSubject = !canEditSubject)}
									disabled={isSendingApplication}
									class="absolute top-1/2 right-3 h-8 w-8 -translate-y-1/2 transform cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
								>
									{#if canEditSubject}
										<Check class="text-green-500" />
									{:else}
										<PencilLine class="text-[#ff4d00]" />
									{/if}
								</button>
							</div>
						</div>

						<!-- Generate Cover Letter Button -->
						<button
							onclick={generateCoverLetter}
							disabled={isGeneratingCoverLetter || isSendingApplication}
							class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 bg-gray-50 py-4 text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{#if isGeneratingCoverLetter}
								<div
									class="h-5 w-5 animate-spin rounded-full border-2 border-[#ff4d00] border-t-transparent"
								></div>
								Generating Cover Letter...
							{:else}
								<Wand2 class="h-5 w-5" />
								Generate Cover Letter
							{/if}
						</button>

						<Button
							name={isSendingApplication ? 'Sending...' : 'Send Application'}
							icon={Send}
							onClick={handleSendApplication}
							classes={`w-full justify-center hidden md:flex ${isSendingApplication ? 'opacity-50 cursor-not-allowed' : ''}`}
						/>
					</div>
				</div>
			</div>

			<!-- Right Side - Cover Letter Preview -->
			<div class="rounded-lg border border-gray-200 bg-white p-6">
				<div class="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10">
						<FileText class="h-5 w-5 text-[#ff4d00]" />
					</div>
					<div>
						<h2 class="text-xl font-semibold">Cover Letter Preview</h2>
						<p class="text-gray-600">Review and customize your cover letter before sending</p>
					</div>
				</div>

				{#if coverLetter}
					<div class="h-96 overflow-y-auto rounded-md border border-gray-200 p-4">
						<textarea
							bind:value={coverLetter}
							disabled={isSendingApplication}
							class="h-full w-full resize-none border-none p-0 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							placeholder="Your cover letter will appear here..."
						></textarea>
					</div>
				{:else}
					<div class="flex h-96 items-center justify-center rounded-md bg-gray-50 p-4">
						<div class="text-center">
							<FileText class="mx-auto h-12 w-12 text-gray-400" />
							<p class="mt-4 text-center text-gray-500">
								Your cover letter will appear here.
								<br />
								Click 'Generate Cover Letter' to create a template.
							</p>
						</div>
					</div>
				{/if}

				<Button
					name={isSendingApplication ? 'Sending...' : 'Send Application'}
					icon={Send}
					onClick={handleSendApplication}
					classes={`w-full justify-center md:hidden mt-6 ${isSendingApplication ? 'opacity-50 cursor-not-allowed' : ''}`}
				/>
			</div>
		</div>
	{:else}
		<!-- No Profile State -->
		<div class="flex h-full flex-col items-center justify-center">
			<div class="mx-auto flex max-w-lg flex-col items-center gap-8 text-center">
				<!-- Icon -->
				<div class="relative">
					<div
						class="flex size-16 items-center justify-center rounded-full bg-[#ff4d00]/10 md:size-20"
					>
						<Send class="size-5 text-[#ff4d00]/70 md:size-10" />
					</div>
					<div
						class="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100"
					>
						<UserPlus class="h-4 w-4 text-red-500" />
					</div>
				</div>

				<!-- Content -->
				<div class="space-y-2">
					<h2 class="text-xl font-bold text-gray-700 md:text-3xl">No Profiles Found</h2>
					<p class="leading-relaxed text-gray-500 md:text-lg">
						To start applying for jobs, you need to create at least one profile.
					</p>
				</div>

				<!-- Features -->
				<div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4d00]/10">
							<UserPlus class="h-4 w-4 text-[#ff4d00]" />
						</div>
						<div class="text-left">
							<p class="text-xs font-medium text-gray-800 sm:text-base">Create Profiles</p>
							<p class="text-xs text-gray-600 sm:text-sm">Multiple professional profiles</p>
						</div>
					</div>

					<div class="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff4d00]/10">
							<FileText class="h-4 w-4 text-[#ff4d00]" />
						</div>
						<div class="text-left">
							<p class="text-xs font-medium text-gray-800 sm:text-base">Auto Cover Letters</p>
							<p class="text-xs text-gray-600 sm:text-base">AI-generated cover letters</p>
						</div>
					</div>
				</div>

				<!-- CTA -->
				<div class="flex w-full flex-col gap-4 sm:flex-row">
					<a
						href="/app"
						class="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#ff4d00] px-6 py-1.5 font-medium text-white transition-colors hover:bg-[#ff4d00]/90 md:py-3"
					>
						<UserPlus class="size-4 md:size-5" />
						Create Your First Profile
					</a>

					<button
						class="flex items-center justify-center gap-2 rounded-md border border-gray-300 px-6 py-1.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 md:py-3"
					>
						Learn More
						<ArrowRight class="size-4" />
					</button>
				</div>

				<!-- Help Text -->
				<p class="text-sm text-gray-500">
					Need help? Check out our
					<a href="/app/" class="text-[#ff4d00] hover:underline">step-by-step guide</a>
					to creating your first profile.
				</p>
			</div>
		</div>
	{/if}
</section>
