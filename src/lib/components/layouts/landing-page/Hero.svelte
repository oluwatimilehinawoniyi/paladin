<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import {
		ArrowRight,
		TrendingUp,
		Users,
		FileText,
		Calendar,
		CheckCircle2,
		ExternalLink,
		MoreHorizontal
	} from '@lucide/svelte';

	// Props for customization
	interface Props {
		className?: string;
	}

	let { className = '' }: Props = $props();

	// Animation state
	let isLoaded = $state(false);
	let dashboardVisible = $state(false);

	// Component classes
	let containerClasses = twMerge(
		'relative min-h-screen bg-gradient-to-br from-slate-100 via-white to-purple-50',
		className
	);

	// Mock data for dashboard
	const applicationData = [
		{
			company: 'Google',
			role: 'Software Engineer',
			status: 'Interview',
			date: '18 Dec, 2024',
			amount: '$180,000',
			color: 'text-blue-600'
		},
		{
			company: 'Meta',
			role: 'Product Manager',
			status: 'Applied',
			date: '17 Dec, 2024',
			amount: '$165,000',
			color: 'text-green-600'
		},
		{
			company: 'Netflix',
			role: 'Senior Developer',
			status: 'Offer',
			date: '16 Dec, 2024',
			amount: '$170,000',
			color: 'text-orange-600'
		},
		{
			company: 'Apple',
			role: 'iOS Engineer',
			status: 'Applied',
			date: '15 Dec, 2024',
			amount: '$185,000',
			color: 'text-purple-600'
		}
	];

	// Stats for current month
	let applicationsCount = $state(0);
	let interviewsCount = $state(0);
	let offersCount = $state(0);

	// Load animations on mount
	onMount(() => {
		setTimeout(() => (isLoaded = true), 100);
		setTimeout(() => {
			dashboardVisible = true;
			animateStats();
		}, 800);
	});

	// Animate stats counters
	function animateStats() {
		animateValue(applicationsCount, 24, 1000, (val) => (applicationsCount = val));
		animateValue(interviewsCount, 8, 1200, (val) => (interviewsCount = val));
		animateValue(offersCount, 3, 1500, (val) => (offersCount = val));
	}

	function animateValue(
		current: number,
		target: number,
		duration: number,
		callback: (val: number) => void
	) {
		const start = Date.now();
		const startValue = current;

		function update() {
			const now = Date.now();
			const progress = Math.min((now - start) / duration, 1);
			const easeProgress = 1 - Math.pow(1 - progress, 3);

			const currentValue = Math.floor(startValue + (target - startValue) * easeProgress);
			callback(currentValue);

			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}

		requestAnimationFrame(update);
	}
</script>

<section class={containerClasses}>
	<!-- Hero Content -->
	<div
		class="relative z-10 mx-auto grid min-h-[80vh] max-w-5xl items-center gap-6 overflow-y-hidden px-4 py-10 sm:px-6 lg:px-8"
	>
		<!-- Badge -->
		<div
			class={twMerge(
				'mx-auto inline-flex w-fit items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 transition-all duration-700',
				isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
			)}
		>
			<TrendingUp class="h-4 w-4" />
			Onboard & Succeed
		</div>

		<!-- Main Headline -->
		<div
			class={twMerge(
				'transition-all delay-100 duration-700',
				isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
			)}
		>
			<h1
				class="text-center text-4xl leading-tight font-bold text-slate-900 lg:text-5xl xl:text-6xl"
			>
				Transform your career with AI-powered job applications.
			</h1>
		</div>

		<!-- Description -->
		<p
			class={twMerge(
				'mx-auto max-w-xl text-center text-xl leading-relaxed text-slate-600 transition-all delay-200 duration-700',
				isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
			)}
		>
			Streamline your job search into a centralized command center. Track applications, generate
			personalized cover letters, and land offers faster.
		</p>

		<div
			class={twMerge(
				'mx-auto w-fit transition-all delay-300 duration-700',
				isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
			)}
		>
			<a
				href="/auth/login"
				class="inline-flex items-center gap-2 rounded-lg bg-[#ff4d00] px-6 py-3 font-semibold text-white shadow-lg transition-all"
			>
				Start Free Trial
				<ArrowRight class="h-4 w-4" />
			</a>
		</div>
	</div>

	<!-- DASHBOARD -->
	<div
		class={twMerge(
			'relative mx-auto px-6 max-w-6xl transition-all delay-400 duration-1000',
			dashboardVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
		)}
	>
		<!-- Dashboard Container -->
		<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
			<!-- Dashboard Header -->
			<div class="flex items-center justify-between border-b border-slate-200 p-4">
				<div class="flex items-center gap-3">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
						<FileText class="h-4 w-4 text-slate-600" />
					</div>
					<div>
						<div class="font-medium text-slate-900">Applications</div>
						<div class="text-xs text-slate-500">sarah.chen@gmail.com</div>
					</div>
				</div>
				<div class="flex items-center gap-2 text-sm text-slate-600">
					<Calendar class="h-4 w-4" />
					<span>This Month</span>
					<MoreHorizontal class="h-4 w-4" />
				</div>
			</div>

			<!-- Dashboard Content -->
			<div class="p-6">
				<!-- Main Metrics -->
				<div class="mb-6">
					<h2 class="mb-4 text-2xl font-bold text-slate-900">Job Search Progress</h2>

					<!-- Stats Grid -->
					<div class="mb-6 grid grid-cols-3 gap-6">
						<div>
							<div class="text-2xl font-bold text-slate-900">{applicationsCount}</div>
							<div class="text-sm text-slate-600">Applications</div>
						</div>
						<div>
							<div class="text-2xl font-bold text-green-600">{interviewsCount}</div>
							<div class="text-sm text-slate-600">Interviews</div>
						</div>
						<div>
							<div class="text-2xl font-bold text-purple-600">{offersCount}</div>
							<div class="text-sm text-slate-600">Offers</div>
						</div>
					</div>

					<!-- Progress Insight -->
					<div class="rounded-lg border border-green-200 bg-green-50 p-3 text-sm">
						<span class="text-green-700">
							You have <strong>increased</strong> your interview rate by <strong>45%</strong>
							this month and <strong>improved</strong> your response rate by
							<strong>23%</strong>
						</span>
					</div>
				</div>

				<!-- Applications Table Header -->
				<div
					class="mb-4 flex items-center justify-between border-b border-slate-200 pb-2 text-sm text-slate-500"
				>
					<div>Company / Role</div>
					<div>Status</div>
					<div>Salary</div>
					<div></div>
				</div>

				<!-- Applications List -->
				<div class="space-y-3">
					{#each applicationData as app, i}
						<div
							class="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-slate-50"
						>
							<div class="flex items-center gap-3">
								<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
									<div class="h-4 w-4 rounded-sm bg-slate-400"></div>
								</div>
								<div>
									<div class="font-medium text-slate-900">{app.company}</div>
									<div class="text-sm text-slate-500">{app.role}</div>
								</div>
							</div>

							<div class="text-center">
								<div
									class={twMerge(
										'rounded px-2 py-1 text-xs font-medium',
										app.status === 'Interview'
											? 'bg-blue-100 text-blue-700'
											: app.status === 'Offer'
												? 'bg-green-100 text-green-700'
												: 'bg-slate-100 text-slate-600'
									)}
								>
									{app.status}
								</div>
								<div class="mt-1 text-xs text-slate-400">{app.date}</div>
							</div>

							<div class="text-right">
								<div class="font-semibold text-slate-900">{app.amount}</div>
								<div class="text-xs text-green-600">Target</div>
							</div>

							<div class="flex items-center gap-1">
								<button class="rounded p-1 hover:bg-slate-100">
									<ExternalLink class="h-3 w-3 text-slate-400" />
								</button>
								<ArrowRight class="h-3 w-3 text-slate-400" />
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Floating Elements -->
		<div
			class="absolute -top-4 -right-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 shadow-lg"
		>
			<CheckCircle2 class="h-6 w-6 text-purple-600" />
		</div>
		<div
			class="absolute -bottom-4 -left-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 shadow-lg"
		>
			<TrendingUp class="h-5 w-5 text-green-600" />
		</div>
	</div>
</section>
