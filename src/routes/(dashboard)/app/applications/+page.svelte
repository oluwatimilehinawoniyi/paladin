<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { modalStore } from '$lib/stores/modalStore';
import { triggerSuccessConfetti } from '$lib/utils/confetti';
	import {
		Send,
		UserPlus,
		Mail,
		FileText,
		ArrowRight,
		PencilLine,
		Check,
		AlertCircle,
		Wand2,
		Bot,
		Edit3,
		Zap,
		Brain,
		ToggleLeft,
		ToggleRight,
		Loader2,
		Sparkles
	} from '@lucide/svelte';
	import { apiService, type ProfileResponse } from '$lib/api/apiService';
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';

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
	let applicationSubject = $state('');
	let coverLetter = $state('');
	let companyName = $state('');
	let jobTitle = $state('');

	// AI extracted data
	let extractedData = $state({
		company: '',
		position: '',
		email: '',
		requirements: [] as string[],
		keySkills: [] as string[],
		experienceLevel: '',
		location: '',
		generatedCoverLetter: ''
	});

	// Get user from auth store
	let user = $derived($authStore.user);

	// Computed values
	let canProceed = $derived(isSmartMode ? jobDescription.trim() && jdAnalyzed : true);
	let selectedProfile = $derived(profiles.find((p) => p.id === selectedProfileId));

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
			error = 'Please provide a job description first.';
			return;
		}

		if (!selectedProfileId) {
			error = 'Please select a profile first to analyze the job description.';
			return;
		}

		isAnalyzingJD = true;
		error = '';

		try {
			// TODO: Replace with actual API call
			// const response = await apiService.analyzeJD({
			//   jobDescription,
			//   profileId: selectedProfileId
			// });

			// Simulate AI analysis WITH cover letter generation
			await simulateAIAnalysisWithCoverLetter();

			jdAnalyzed = true;
			successMessage = 'Job description analyzed and cover letter prepared!';

			// Auto-populate fields with extracted data
			companyName = extractedData.company;
			jobTitle = extractedData.position;
			jobEmail = extractedData.email;

			// Generate subject line
			if (extractedData.company && extractedData.position) {
				applicationSubject = `Application for ${extractedData.position} position at ${extractedData.company}`;
			}
		} catch (err) {
			console.error('Failed to analyze job description:', err);
			error = err instanceof Error ? err.message : 'Failed to analyze job description';
		} finally {
			isAnalyzingJD = false;
		}
	}

	// Simulate AI analysis WITH cover letter generation (replace with real API call)
	async function simulateAIAnalysisWithCoverLetter() {
		return new Promise((resolve) => {
			setTimeout(() => {
				// Extract basic info from job description
				const jd = jobDescription.toLowerCase();

				// Simple extraction patterns (replace with actual AI)
				const companyMatches = jd.match(
					/(?:company|organization|at)\s+([a-z\s]+?)(?:\s|\.|\,|is|has)/
				);
				const positionMatches = jd.match(
					/(?:role|position|job title|seeking a|looking for a)\s*:?\s*([^\n\.]+)/
				);
				const emailMatches = jobDescription.match(/[\w\.-]+@[\w\.-]+\.\w+/);

				const company = companyMatches?.[1]?.trim() || 'TechCorp Inc';
				const position = positionMatches?.[1]?.trim() || 'Software Developer';
				const email = emailMatches?.[0] || 'careers@techcorp.com';

				extractedData = {
					company,
					position,
					email,
					requirements: [
						'React/Vue/Angular experience',
						'JavaScript proficiency',
						'RESTful API knowledge',
						'Team collaboration skills'
					],
					keySkills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
					experienceLevel: '3-5 years',
					location: 'Remote/Hybrid',
					// AI-generated cover letter (pre-made during analysis)
					generatedCoverLetter: generateSmartCoverLetter(company, position)
				};

				resolve(extractedData);
			}, 2500); // Slightly longer since we're doing more work
		});
	}

	// Generate smart cover letter based on JD analysis
	function generateSmartCoverLetter(company: string, position: string): string {
		const profile = selectedProfile;
		if (!profile) return '';

		return `Dear Hiring Manager,

I am excited to apply for the ${position} position at ${company}. After carefully reviewing your job description, I am confident that my background as a ${profile.title} and expertise in ${profile.skills.slice(0, 3).join(', ')} make me an ideal candidate for this role.

${profile.summary}

What particularly caught my attention about this opportunity is how well it aligns with my technical expertise. Your requirements for ${extractedData.keySkills.slice(0, 2).join(' and ')} match perfectly with my ${extractedData.experienceLevel} of hands-on experience in these technologies.

Key qualifications that make me stand out:
• Proven track record as a ${profile.title}
• Strong proficiency in ${profile.skills.slice(0, 4).join(', ')}
• Experience with ${extractedData.requirements.slice(0, 2).join(' and ')}
• Demonstrated ability to deliver high-quality results in collaborative environments

I am particularly drawn to ${company} because of your innovative approach and commitment to excellence. I would love to contribute to your team's continued success and help drive your mission forward.

I would welcome the opportunity to discuss how my background and enthusiasm can benefit your organization. Thank you for your consideration.

Best regards,
${user?.firstName || '[Your Name]'} ${user?.lastName || ''}`;
	}

	// Generate cover letter (instant for Smart Mode, template-based for Manual Mode)
	async function generateCoverLetter() {
		if (!selectedProfileId) {
			error = 'Please select a profile first.';
			return;
		}

		isGeneratingCoverLetter = true;
		error = '';

		try {
			if (isSmartMode && jdAnalyzed && extractedData.generatedCoverLetter) {
				// Smart Mode: Show pre-generated cover letter instantly!
				setTimeout(() => {
					coverLetter = extractedData.generatedCoverLetter;
					successMessage = 'AI-generated cover letter ready!';
					isGeneratingCoverLetter = false;
				}, 300); // Just a tiny delay for UX feedback
			} else {
				// Manual Mode: Generate template-based cover letter
				// TODO: Replace with actual API call to template service
				// const response = await apiService.generateTemplateCoverLetter({
				//   profileId: selectedProfileId,
				//   companyName,
				//   jobTitle,
				//   recipientEmail: jobEmail
				// });

				await generateTemplateCoverLetter();
				successMessage = 'Cover letter generated successfully!';
			}
		} catch (err) {
			console.error('Failed to generate cover letter:', err);
			error = err instanceof Error ? err.message : 'Failed to generate cover letter';
			isGeneratingCoverLetter = false;
		}
	}

	// Generate template-based cover letter for Manual Mode
	async function generateTemplateCoverLetter() {
		return new Promise((resolve) => {
			setTimeout(() => {
				const profile = selectedProfile;
				if (!profile) return;

				const company = companyName || 'the company';
				const position = jobTitle || 'this position';

				// Template-based cover letter (pulled from Redis templates)
				const templates = [
					// Template 1: Professional
					`Dear Hiring Manager,

I am writing to express my strong interest in the ${position} position at ${company}. With my background as a ${profile.title}, I am confident that my skills and experience align perfectly with your requirements.

${profile.summary}

My expertise includes ${profile.skills.slice(0, 5).join(', ')}, which I believe will be valuable assets to your team. I am excited about the opportunity to contribute to ${company}'s continued growth and success.

I would welcome the opportunity to discuss how my background can benefit your organization. Thank you for your consideration.

Best regards,
${user?.firstName || '[Your Name]'} ${user?.lastName || ''}`,

					// Template 2: Enthusiastic
					`Dear ${company} Team,

I am thrilled to apply for the ${position} role at ${company}. As an experienced ${profile.title}, I am excited about the possibility of bringing my passion and expertise to your organization.

${profile.summary}

What sets me apart is my proficiency in ${profile.skills.slice(0, 4).join(', ')} and my commitment to delivering exceptional results. I am particularly drawn to ${company} and would love to contribute to your innovative projects.

I look forward to the opportunity to discuss how I can add value to your team.

Sincerely,
${user?.firstName || '[Your Name]'} ${user?.lastName || ''}`,

					// Template 3: Results-focused
					`Dear Hiring Manager,

I am excited to submit my application for the ${position} position at ${company}. As a results-driven ${profile.title}, I am confident in my ability to make a meaningful impact on your team.

${profile.summary}

My technical skills in ${profile.skills.slice(0, 5).join(', ')} have enabled me to consistently deliver high-quality solutions. I am eager to bring this expertise to ${company} and help drive your objectives forward.

Thank you for considering my application. I look forward to hearing from you.

Best regards,
${user?.firstName || '[Your Name]'} ${user?.lastName || ''}`
				];

				// Randomly select a template (simulating Redis lookup)
				const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

				coverLetter = randomTemplate;
				isGeneratingCoverLetter = false;
				resolve(randomTemplate);
			}, 800); // Short delay for template lookup simulation
		});
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
			// console.log('Application sent successfully:', response);

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
		applicationSubject = '';
		coverLetter = '';
		companyName = '';
		jobTitle = '';
		error = '';
		successMessage = '';
		jdAnalyzed = false;
		extractedData = {
			company: '',
			position: '',
			email: '',
			requirements: [],
			keySkills: [],
			experienceLevel: '',
			location: '',
			generatedCoverLetter: ''
		};
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
	<div class="custom-scrollbar flex-1 space-y-8 overflow-y-auto pb-4">
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
			<div class="flex h-full flex-col items-center justify-center">
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
										placeholder="Paste the complete job description here..."
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
										disabled={!jobDescription.trim() || isAnalyzingJD}
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
												<span class="ml-1 text-gray-600">{extractedData.company}</span>
											</div>
											<div>
												<span class="font-medium text-gray-700">Position:</span>
												<span class="ml-1 text-gray-600">{extractedData.position}</span>
											</div>
											<div>
												<span class="font-medium text-gray-700">Email:</span>
												<span class="ml-1 text-gray-600">{extractedData.email}</span>
											</div>
											<div>
												<span class="font-medium text-gray-700">Experience:</span>
												<span class="ml-1 text-gray-600">{extractedData.experienceLevel}</span>
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
									<p class="text-sm text-gray-600">AI-generated personalized cover letter</p>
								</div>
							</div>

							<!-- Generate Button -->
							{#if selectedProfileId}
								<Button
									name={isGeneratingCoverLetter ? 'Generating...' : 'Generate'}
									icon={isGeneratingCoverLetter ? Loader2 : Wand2}
									onClick={generateCoverLetter}
									disabled={!selectedProfileId ||
										isGeneratingCoverLetter ||
										(isSmartMode && !jdAnalyzed)}
									classes="text-sm {isGeneratingCoverLetter ? 'animate-pulse' : ''}"
								/>
							{/if}
						</div>

						<!-- Cover Letter Textarea -->
						<div>
							<textarea
								bind:value={coverLetter}
								disabled={isSendingApplication}
								placeholder={selectedProfileId
									? "Click 'Generate' to create a personalized cover letter using AI"
									: 'Select a profile first to generate a cover letter'}
								rows="20"
								class="w-full resize-none rounded-md border border-gray-300 p-3 text-sm focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							></textarea>
						</div>

						<!-- Send Application Button -->
						<Button
							name={isSendingApplication ? 'Sending...' : 'Send Application'}
							icon={Send}
							onClick={handleSendApplication}
							disabled={!coverLetter.trim() || isSendingApplication}
							classes="w-full justify-center {isSendingApplication
								? 'opacity-50 cursor-not-allowed'
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
