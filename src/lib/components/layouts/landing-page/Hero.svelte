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
				Start For Free
				<ArrowRight class="h-4 w-4" />
			</a>
		</div>
	</div>
</section>
