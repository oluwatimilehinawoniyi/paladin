<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { Send, UserPlus, Mail, FileText, ArrowRight, PencilLine, Check } from '@lucide/svelte';
	import { profilesData } from '$lib/data/profiles';

	let profiles = profilesData;
	let canEditSubject: boolean = $state(true);
</script>

<section class="flex h-full w-full flex-col gap-8 overflow-hidden p-4">
	<!-- CHECK PROFILE HERE -->
	{#if profiles.length > 0}
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
						<div>
							<label for="job_description" class="mb-1 block text-sm font-medium text-gray-700">
								Job Description <span class="text-[#ff4d00]">*</span>
							</label>
							<div class="relative">
								<textarea
									name="job_description"
									rows="3"
									id="job_description"
									placeholder="Provide an overview of the position, including the role's responsibility, required skills and qualifications"
									class="w-full resize-none rounded-md border border-gray-300 py-2 pr-3 pl-5 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
								></textarea>
							</div>
						</div>
						<div class="grid gap-4 sm:grid-cols-2">
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
										placeholder="hr@company.com"
										class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
									/>
								</div>
							</div>

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
										class="w-full appearance-none rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
									>
										<option value="">Choose a profile</option>
										{#each profiles as profile}
											<option value={profile.id}>{profile.title}</option>
										{/each}
									</select>
								</div>
							</div>
						</div>

						<div>
							<label for="application_subject" class="mb-1 block text-sm font-medium text-gray-700">
								Application Subject <span class="text-[#ff4d00]">*</span>
							</label>
							<div class="relative">
								<Mail
									class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400"
								/>
								<input
									type="application_subject"
									id="application_subject"
									placeholder="Application for [ Job Title ] position"
									class="w-full {canEditSubject
										? 'cursor-text'
										: 'cursor-not-allowed'} rounded-md border border-gray-300 py-2 pr-3 pl-10 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
									disabled={!canEditSubject}
								/>
								<button
									type="button"
									onclick={() => (canEditSubject = !canEditSubject)}
									class="absolute top-1/2 right-3 h-8 w-8 -translate-y-1/2 transform cursor-pointer"
								>
									{#if canEditSubject}
										<Check class="text-green-500" />
									{:else}
										<PencilLine class="text-[#ff4d00]" />
									{/if}
								</button>
							</div>
						</div>

						<button
							class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-300 bg-gray-100 py-4 text-gray-600 transition-colors hover:bg-gray-50"
						>
							<FileText class="h-5 w-5" />
							Generate Cover Letter
						</button>

						<Button
							name="send application"
							icon={Send}
							classes="w-full justify-center hidden md:flex"
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

				<div class="flex h-96 items-center justify-center rounded-md bg-gray-50 p-4">
					<p class="text-center text-gray-500">
						Your cover letter will appear here.
						<br />
						Click 'Generate Cover Letter' to create a template.
					</p>
				</div>

				<Button
					name="send application"
					icon={Send}
					classes="w-full justify-center md:hidden mt-6"
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
