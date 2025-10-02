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
	let activeCategory = $state('General Information');
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
					"Paladin is an AI-powered job application assistant that helps you create multiple professional profiles, generate personalized cover letters, and track your job applications with advanced analytics. It's designed to accelerate your job search success and help you land your dream job faster."
			},
			{
				id: 'how-paladin-works',
				question: 'How does Paladin work?',
				answer:
					'Paladin works in three simple steps: 1) Create your professional profiles with your skills and experience, 2) Input job descriptions and our AI generates personalized cover letters and application materials, 3) Track all your applications in one dashboard with analytics to optimize your success rate.'
			},
			{
				id: 'who-is-paladin-for',
				question: 'Who is Paladin for?',
				answer:
					"Paladin is perfect for job seekers at any career level - from recent graduates to senior professionals. It's especially valuable for people applying to multiple roles, career changers, and anyone who wants to optimize their job search with data-driven insights."
			}
		],
		features: [
			{
				id: 'ai-cover-letters',
				question: 'How accurate are the AI-generated cover letters?',
				answer:
					'Our AI is trained on thousands of successful job applications and cover letters. It analyzes job descriptions, matches them with your profile, and generates personalized content that typically achieves 3x higher response rates than generic applications. Each letter is unique and tailored to the specific role and company.'
			},
			{
				id: 'multiple-profiles',
				question: 'Can I create profiles for different industries?',
				answer:
					'Absolutely! You can create unlimited professional profiles tailored for different roles, industries, or career levels. For example, you might have separate profiles for software engineering, product management, and consulting roles, each highlighting relevant skills and experience.'
			},
			{
				id: 'job-matching',
				question: 'How does the job matching feature work?',
				answer:
					'Our job matching AI analyzes job descriptions against your profile and provides a compatibility score. It identifies which requirements you meet, which skills might be missing, and suggests optimizations to improve your match score for better application success.'
			}
		],
		pricing: [
			{
				id: 'pricing-plans',
				question: 'What are the pricing plans?',
				answer:
					'We offer three plans: Free (2 profiles, 10 AI cover letters/month), Professional ($19/month with unlimited profiles and cover letters), and Enterprise (custom pricing for teams). All paid plans include advanced analytics, priority support, and optimization recommendations.'
			},
			{
				id: 'free-trial',
				question: 'Is there a free trial?',
				answer:
					'Yes! You can start with our free plan that includes 2 professional profiles and 10 AI-generated cover letters per month. You can upgrade to Professional anytime for unlimited access to all features with a 14-day money-back guarantee.'
			},
			{
				id: 'cancel-subscription',
				question: 'Can I cancel my subscription anytime?',
				answer:
					'Absolutely. You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you can always reactivate later with all your data intact.'
			}
		],
		'getting-started': [
			{
				id: 'setup-time',
				question: 'How long does it take to set up my first profile?',
				answer:
					"Creating your first profile takes about 10-15 minutes. You'll add your basic information, upload your resume, and our AI will help extract and organize your experience, skills, and achievements into a professional profile ready for job applications."
			},
			{
				id: 'resume-upload',
				question: 'Do I need to upload my resume?',
				answer:
					'While not required, uploading your resume makes setup much faster. Our AI can automatically extract your experience, education, and skills. You can also build your profile from scratch or import information from LinkedIn.'
			},
			{
				id: 'first-application',
				question: 'How do I create my first job application?',
				answer:
					"After setting up your profile, simply paste a job description URL or copy the job posting text. Select which profile to use, and our AI will generate a personalized cover letter in seconds. Review, make any edits, and you're ready to apply!"
			}
		],
		'data-privacy': [
			{
				id: 'data-security',
				question: 'How secure is my personal information?',
				answer:
					"We take security extremely seriously. All data is encrypted in transit and at rest using industry-standard encryption. We're SOC 2 compliant and never sell your personal information. Your resume and profile data are stored securely and only used to improve your job search experience."
			},
			{
				id: 'data-usage',
				question: 'How do you use my data to train your AI?',
				answer:
					'We use anonymized, aggregated data to improve our AI models and success rates. Your personal information, resume details, and application content are never shared with third parties or used in ways that could identify you personally.'
			},
			{
				id: 'data-export',
				question: 'Can I export my data?',
				answer:
					'Yes! You can export all your profiles, cover letters, and application history at any time in standard formats (PDF, DOCX, CSV). This ensures you always have access to your data and can use it outside of Paladin if needed.'
			}
		],
		support: [
			{
				id: 'customer-support',
				question: 'What support options are available?',
				answer:
					'We offer email support for all users, with priority support for Professional subscribers. Our help center includes detailed guides, video tutorials, and best practices. Enterprise customers get dedicated account management and phone support.'
			},
			{
				id: 'success-coaching',
				question: 'Do you provide job search coaching?',
				answer:
					'While Paladin automates much of the application process, we provide extensive resources including job search strategies, interview preparation guides, and salary negotiation tips. Professional subscribers get access to exclusive webinars and career resources.'
			},
			{
				id: 'api-integrations',
				question: 'Does Paladin integrate with other tools?',
				answer:
					"Yes! Paladin integrates with popular job boards, ATS systems, and productivity tools. You can connect with LinkedIn, import from job boards automatically, and export to various formats. We're constantly adding new integrations based on user feedback."
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

	let currentQuestions = $derived(
		faqData[activeCategory.toLowerCase().replace(' ', '-') as FAQCategoryKey] || faqData['general']
	);

	// Switch category
	function switchCategory(categoryName: string) {
		activeCategory = categoryName;
		// Close all questions when switching categories
		openQuestions = new Set();
	}
</script>

<section class={containerClasses}>
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
								onclick={() => switchCategory(category.name)}
								class={twMerge(
									'w-full rounded-xl px-4 py-3 text-left font-medium transition-all hover:bg-white hover:shadow-sm',
									activeCategory === category.name
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
						<button
							class="inline-flex items-center gap-2 rounded-xl bg-[#ff4d00] px-6 py-3 font-semibold text-white transition-all hover:bg-[#ff4d00]/90"
						>
							<Mail class="h-4 w-4" />
							Support
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
