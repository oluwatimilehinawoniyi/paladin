<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import {
		ChevronDown,
		ChevronUp,
		MessageCircle,
		HelpCircle,
		Mail,
		Sparkles,
		Zap
	} from '@lucide/svelte';

	interface Props {
		className?: string;
	}

	let { className = '' }: Props = $props();

	let isVisible = $state(false);
	let activeCategory = $state('general');
	let openQuestions = $state<Set<string>>(new Set(['what-is-paladin']));

	let containerClasses = twMerge('relative py-20 lg:py-32 bg-white max-w-5xl mx-auto', className);

	// FAQ Categories
	const categories = [
		{ id: 'general', name: 'General Information', icon: HelpCircle },
		{ id: 'features', name: 'Features and AI', icon: Zap },
		{ id: 'pricing', name: 'Pricing and Plans', icon: '💳' },
		{ id: 'getting-started', name: 'Getting Started', icon: '🚀' },
		{ id: 'data-privacy', name: 'Data Privacy & Security', icon: '🔒' },
		{ id: 'support', name: 'Support and Resources', icon: '🎯' }
	];

	// FAQ Data organized by category
	type FAQCategoryKey =
		| 'general'
		| 'features'
		| 'pricing'
		| 'getting-started'
		| 'data-privacy'
		| 'support';

	const faqData: Record<FAQCategoryKey, { id: string; question: string; answer: string }[]> = {
		general: [
			{
				id: 'what-is-paladin',
				question: 'What is Paladin?',
				answer:
					"Paladin helps you manage multiple professional identities and organize your job search. If you have different skill sets (developer + designer, marketer + analyst, etc.), you can create separate profiles for each. AI helps draft cover letters so you're not starting from scratch every time. Think of it as a command center for your applications—not magic, just better organization."
			},
			{
				id: 'how-paladin-works',
				question: 'How does Paladin work?',
				answer:
					"Three steps: 1) Create profiles for your different skill sets (or just one if that's all you need). 2) Paste a job description, select which profile to use, and AI drafts a cover letter starting point. You edit and make it yours. 3) Track everything in one dashboard—which jobs you applied to, with which profile, and what happened. No more scattered spreadsheets."
			},
			{
				id: 'who-is-paladin-for',
				question: 'Who is Paladin for?',
				answer:
					"Anyone juggling multiple skill sets or applying to lots of jobs. If you're a designer who also codes, an engineer who writes, or a marketer with data skills—Paladin helps you stay organized. It's also useful if you're just tired of rewriting cover letters and want a system that keeps track of where you applied."
			},
			{
				id: 'is-ai-writing-everything',
				question: 'Is the AI writing my cover letters for me?',
				answer:
					"No. AI creates a draft based on the job description and your profile. You review it, rewrite parts, add your voice, and make it sound like you. It's a starting point, not a finished product. You're still the human in the loop—AI just saves you from staring at a blank page."
			},
			{
				id: 'do-i-need-multiple-profiles',
				question: 'Do I really need multiple profiles?',
				answer:
					"Only if you have multiple skill sets. If you're only applying to one type of role, one profile is fine. But if you apply to both frontend and backend jobs, or marketing and analytics roles, separate profiles keep your story clear. Each profile highlights different skills without forcing you to maintain separate resumes manually."
			}
		],
		features: [
			{
				id: 'ai-cover-letters',
				question: 'How good are the AI-generated cover letters?',
				answer:
					"They're a solid starting point—usually about 90% there. AI reads the job description, pulls from your profile, and drafts something coherent. But you'll need to edit it. Add your personality. Fix anything that sounds generic. Think of it as a first draft buddy, not a ghost writer. The quality depends on how detailed your profile is."
			},
			{
				id: 'multiple-profiles',
				question: 'Can I create profiles for different industries?',
				answer:
					'Yes. Create as many profiles as you need. Software engineer profile. Product manager profile. Freelance consultant profile. Each one can emphasize different skills, experience, and tone. When you apply for a job, just pick which version of yourself fits best. No more maintaining separate Word docs that get out of sync.'
			},
			{
				id: 'job-matching',
				question: 'Does Paladin tell me which jobs to apply for?',
				answer:
					"Not exactly. Paladin shows you how well your profile matches a job description—which requirements you meet, which you don't, and what might be missing. It's not prescriptive. You still decide where to apply. This just helps you see gaps and adjust your profile if needed."
			},
			{
				id: 'application-tracking',
				question: 'How does application tracking work?',
				answer:
					"Every time you generate a cover letter, Paladin logs it: company name, role, which profile you used, date applied, and status (applied, interviewing, rejected, offer, etc.). You can update statuses manually. It's basically a smart spreadsheet that doesn't require you to remember to update a Google Sheet at 11pm after applying to jobs."
			},
			{
				id: 'data-export',
				question: 'Can I export my data?',
				answer:
					'Yes. Your profiles, cover letters, and application history belong to you. Export everything anytime. If Paladin stops working for you or you want to move to another system, your data comes with you. No lock-in.'
			}
		],
		pricing: [
			{
				id: 'pricing-plans',
				question: 'How much does Paladin cost?',
				answer:
					"Right now, it's free. I built this because I needed it, and I want to see if it helps other people. Eventually, depending on running costs and usage, I might introduce a paid tier or ask for support. Or maybe it stays free forever if people chip in. Honestly, I'm figuring it out as I go. No tricks, no bait-and-switch."
			},
			{
				id: 'free-limits',
				question: 'Are there limits on the free version?',
				answer:
					"Not right now. You can create multiple profiles, generate cover letters, and track applications without hitting a paywall. If costs get out of hand, I might introduce reasonable limits (like X cover letters per month), but I'll be transparent about it. This isn't a 'free trial that surprises you' situation."
			},
			{
				id: 'future-pricing',
				question: 'What if you decide to charge later?',
				answer:
					"If I do introduce pricing, I'll give everyone plenty of notice. Early users might get grandfathered in or discounted rates—I haven't decided yet. The goal isn't to maximize revenue; it's to keep the tool running and useful. If the community supports it, maybe it stays free. If not, we'll figure out a fair model together."
			},
			{
				id: 'support-paladin',
				question: 'Can I support Paladin financially?',
				answer:
					"Not yet, but I'm considering options like optional donations, a 'buy me a coffee' setup, or a supporter tier for people who want to chip in. If you're finding Paladin useful and want to help keep it running, I'll add a way to do that. For now, just use it and let me know what's broken or what's missing."
			}
		],
		'getting-started': [
			{
				id: 'setup-time',
				question: 'How long does it take to set up?',
				answer:
					"Creating your first profile takes 1-3 minutes. Add your basic info and upload your resume. If you need multiple profiles, each additional one is faster since you're just adjusting focus—like copy-pasting and tweaking rather than starting from scratch."
			},
			{
				id: 'resume-upload',
				question: 'Do I need to upload my resume?',
				answer:
					"It helps. If you upload a resume, Paladin can pull out key details (job history, skills, education) for accurate job-matching analysis. It's just about making setup faster."
			},
			{
				id: 'first-application',
				question: 'How do I create my first application?',
				answer:
					"Once your profile is set up: 1) Paste the job description 2) Select which profile to use. 3) AI drafts a cover letter. 4) Edit it until it sounds like you and Apply on paladin. That's it."
			},
			{
				id: 'learning-curve',
				question: 'Is Paladin hard to learn?',
				answer:
					"No. If you've used Google Docs or a spreadsheet, you'll figure it out. The interface is pretty straightforward: profiles on one page, applications on another, analytics to see what's happening. There's no complex workflow or 10-step tutorial. Just log in and start organizing."
			}
		],
		'data-privacy': [
			{
				id: 'data-security',
				question: 'How secure is my personal information?',
				answer:
					"Your data is encrypted in transit and at rest. I don't sell your info to anyone—ever. No shady data broker deals, no 'partnerships' that compromise your privacy. Your resume, profiles, and application history stay yours. Standard security practices apply (HTTPS, secure databases, etc.)."
			},
			{
				id: 'data-usage',
				question: 'Do you use my data to train AI?',
				answer:
					"Not in a way that identifies you. I might use anonymized, aggregated data to improve the cover letter AI (like 'this phrasing works better than that phrasing'), but your personal details, name, resume content, etc. are never shared or used to train models that others access."
			},
			{
				id: 'data-deletion',
				question: 'Can I delete my account and data?',
				answer:
					"Yes. If you want to delete your account, all your profiles, cover letters, and application history get wiped. No 'soft delete' where we keep it forever. It's gone. You can also export everything first if you want a backup before deleting."
			},
			{
				id: 'third-party-sharing',
				question: 'Do you share my data with third parties?',
				answer:
					"No. I don't sell, rent, or share your data with recruiters, companies, or data brokers. The only exception would be if legally required (like a court order), which is standard for any service. Otherwise, your stuff stays private."
			}
		],
		support: [
			{
				id: 'customer-support',
				question: 'What if something breaks?',
				answer:
					"Email me. I'm one person building this, so response time might vary (usually within 24-48 hours). I'll fix bugs as fast as I can. If there's a critical issue affecting everyone, I'll prioritize it. For feature requests, I keep a list and build what makes sense based on feedback."
			},
			{
				id: 'feature-requests',
				question: 'Can I suggest new features?',
				answer:
					"Absolutely. I'm building this based on real problems people have. If something's missing or annoying, tell me. I can't promise I'll build everything, but I listen to what users actually need vs. what sounds cool in theory."
			},
			{
				id: 'job-search-coaching',
				question: 'Do you provide job search coaching?',
				answer:
					"No. Paladin is a tool, not a coaching service. It helps you organize and speed up applications, but it won't teach you how to interview, negotiate salary, or fix your LinkedIn. There are better resources for that. I might share some tips in a blog or FAQ, but I'm not a career coach."
			},
			{
				id: 'integrations',
				question: 'Does Paladin integrate with job boards?',
				answer:
					"Not yet. Right now, you copy the job description into Paladin, generate your cover letter, and apply manually on the company's site. I'm exploring auto-import from LinkedIn or Indeed, but those integrations are tricky and might not happen. For now, it's manual but organized."
			},
			{
				id: 'roadmap',
				question: "What's on the roadmap?",
				answer:
					"Honestly, I'm figuring it out based on usage. Some ideas: better analytics, Chrome extension to auto-fill job descriptions, mobile app, team/agency features. But I'm building incrementally—shipping small improvements rather than overpromising. Check the changelog or email me for updates."
			}
		]
	};

	onMount(() => {
		setTimeout(() => (isVisible = true), 200);
	});

	// Toggle question open/closed
	function toggleQuestion(questionId: string) {
		const newOpenQuestions = new Set(openQuestions);
		if (newOpenQuestions.has(questionId)) {
			newOpenQuestions.delete(questionId);
		} else {
			newOpenQuestions.add(questionId);
		}
		openQuestions = newOpenQuestions;
	}

	let currentQuestions = $derived(faqData[activeCategory as FAQCategoryKey] || faqData['general']);

	function switchCategory(categoryId: string) {
		activeCategory = categoryId;
		// Close all questions when switching categories
		openQuestions = new Set();
	}
</script>

<section id="faq" class={containerClasses}>
	<div class="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="mb-16 text-center">
			<div
				class={twMerge(
					'mb-6 inline-flex items-center gap-2 rounded-full bg-[#ff4d00]/10 px-4 py-2 text-sm font-medium text-[#ff4d00] transition-all duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				<MessageCircle class="h-4 w-4" />
				Get Every Answer with Paladin
			</div>

			<h2
				class={twMerge(
					'mb-6 text-3xl font-bold text-slate-900 transition-all delay-100 duration-700 lg:text-4xl xl:text-5xl',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				Frequently Asked Questions
			</h2>

			<p
				class={twMerge(
					'mx-auto max-w-3xl text-xl text-[#121212]/50 transition-all delay-200 duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				Find answers to common questions about Paladin and how it can accelerate your job search
				success.
			</p>
		</div>

		<!-- FAQ Content -->
		<div class="grid gap-8 lg:grid-cols-[1.5fr_2.5fr]">
			<!-- Sidebar Categories -->
			<div class="">
				<div
					class={twMerge(
						'rounded-2xl bg-slate-50 p-6 transition-all delay-300 duration-700',
						isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
					)}
				>
					<div class="mb-6 flex items-center gap-2">
						<MessageCircle class="h-5 w-5 text-[#121212]/50" />
						<h3 class="font-semibold text-slate-900">Categories</h3>
					</div>

					<nav class="space-y-2">
						{#each categories as category}
							{@const Icon = typeof category.icon === 'string' ? null : category.icon}
							<button
								onclick={() => switchCategory(category.id)}
								class={twMerge(
									'w-full rounded-xl px-4 py-3 text-left font-medium transition-all hover:bg-white hover:shadow-sm',
									activeCategory === category.id
										? 'border-l-4 border-[#ff4d00] bg-white text-[#ff4d00] shadow-sm'
										: 'text-[#121212]/50 hover:text-slate-900'
								)}
							>
								<div class="flex items-center gap-3">
									{#if Icon}
										<Icon class="h-4 w-4" />
									{:else}
										<span class="text-sm">{category.icon}</span>
									{/if}
									<span class="text-sm">{category.name}</span>
								</div>
							</button>
						{/each}
					</nav>
				</div>
			</div>

			<div class="">
				<!-- FAQ Questions -->
				<div class="">
					<div
						class={twMerge(
							'space-y-4 transition-all delay-400 duration-700',
							isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
						)}
					>
						{#each currentQuestions as faq, i}
							{@const isOpen = openQuestions.has(faq.id)}
							<div
								class={twMerge(
									'overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-sm',
									isOpen ? 'border-[#ff4d00]/20 bg-[#ff4d00]/5 shadow-md' : ''
								)}
								style={`animation-delay: ${i * 100 + 500}ms`}
							>
								<!-- Question Button -->
								<button
									onclick={() => toggleQuestion(faq.id)}
									class="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-slate-50/50"
								>
									<h4
										class={twMerge(
											'text-lg font-semibold transition-colors',
											isOpen ? 'text-[#ff4d00]' : 'text-slate-900'
										)}
									>
										{faq.question}
									</h4>
									<div
										class={twMerge(
											'flex h-8 w-8 items-center justify-center rounded-full transition-all',
											isOpen ? 'bg-[#ff4d00] text-white' : 'bg-slate-100 text-[#121212]/50'
										)}
									>
										{#if isOpen}
											<ChevronUp class="h-4 w-4" />
										{:else}
											<ChevronDown class="h-4 w-4" />
										{/if}
									</div>
								</button>

								<!-- Answer -->
								{#if isOpen}
									<div class="border-t border-slate-100/50 px-6 pb-6">
										<div class="pt-4">
											<p class="leading-relaxed text-slate-700">
												{faq.answer}
											</p>
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>

				<!-- Still Have Questions CTA -->
				<div
					class={twMerge(
						'mt-4 flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 text-center transition-all delay-600 duration-700',
						isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
					)}
				>
					<div class="">
						<div class="flex items-center gap-2">
							<HelpCircle class="h-6 w-6 text-[#ff4d00]" />
							<h3 class="text-lg font-semibold text-slate-900">Still have a question?</h3>
						</div>

						<p class="max-w-xs text-left text-[#121212]/50">
							If you didn't find your answer, feel free to reach out.
						</p>
					</div>

					<div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<a
							href="mailto:info.paladinhq@gmail.com"
							class="inline-flex items-center gap-2 rounded-xl bg-[#ff4d00] px-6 py-3 font-semibold text-white transition-all hover:bg-[#ff4d00]/90"
						>
							<Mail class="h-4 w-4" />
							Support
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
