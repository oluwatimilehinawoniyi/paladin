<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { ArrowRight, Brain, FileText, BarChart3, Target, Zap, Users } from '@lucide/svelte';

	// Props for customization
	interface Props {
		className?: string;
	}

	let { className = '' }: Props = $props();

	// Animation state
	let isVisible = $state(false);
	let featuresVisible = $state(false);

	// Component classes
	let containerClasses = twMerge('relative py-8 lg:py-14 ', className);

	// Features data - Paladin's core capabilities
	const features = [
		{
			title: 'Multiple professional profiles',
			description:
				'Create separate profiles for different skill sets. Developer you. Designer you. Project manager you. All organized in one place.',
			icon: Users,
			bgColor: 'bg-purple-100',
			iconColor: 'text-purple-600',
			accentColor: 'from-purple-500 to-purple-600'
		},
		{
			title: 'Smart application tracking',
			description:
				'Track which profile you used for which job. Never lose track of where you applied or what version of yourself you presented.',
			icon: BarChart3,
			bgColor: 'bg-green-100',
			iconColor: 'text-green-600',
			accentColor: 'from-green-500 to-green-600'
		},
		{
			title: 'Cover Letter Assistance',
			description:
				'Generate personalized, compelling cover letters in seconds that match job requirements perfectly.',
			icon: Brain,
			bgColor: 'bg-blue-100',
			iconColor: 'text-blue-600',
			accentColor: 'from-blue-500 to-blue-600'
		},
		{
			title: 'Job match intelligence',
			description:
				'Get AI-powered compatibility scores and optimization suggestions for better results.',
			icon: Target,
			bgColor: 'bg-red-100',
			iconColor: 'text-red-600',
			accentColor: 'from-red-500 to-red-600'
		},
		{
			title: 'Success insights',
			description:
				"Understand which skill sets are getting responses. Adjust your strategy based on what's actually working.",
			icon: Zap,
			bgColor: 'bg-yellow-100',
			iconColor: 'text-yellow-600',
			accentColor: 'from-yellow-500 to-yellow-600'
		},
		{
			title: 'Application History',
			description:
				'See everything in one dashboard. Which jobs you applied to, when, with which profile, and what happened.',
			icon: FileText,
			bgColor: 'bg-cyan-100',
			iconColor: 'text-cyan-600',
			accentColor: 'from-cyan-500 to-cyan-600'
		}
	];

	onMount(() => {
		setTimeout(() => (isVisible = true), 200);
		setTimeout(() => (featuresVisible = true), 600);
	});
</script>

<section class={containerClasses}>
	<div
		class="relative mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8"
	>
		<!-- Left: Main Value Proposition -->
		<div class="sticky top-1/8 space-y-4">
			<!-- Badge -->
			<div
				class={twMerge(
					'inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600 transition-all duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				What Paladin actually does
			</div>

			<!-- Main Headlines -->
			<div
				class={twMerge(
					'space-y-4 transition-all delay-100 duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				<h2 class="text-2xl leading-tight font-bold text-slate-900 lg:text-4xl xl:text-5xl">
					Organize your skills. Track your applications. Let AI meet you halfway.
				</h2>
			</div>

			<!-- Description -->
			<p
				class={twMerge(
					'max-w-lg text-xl leading-relaxed text-slate-600 transition-all delay-200 duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				Paladin doesn't replace you — it handles the repetitive parts so you can focus on the human
				stuff. Your story. Your strategy. Your control.
			</p>

			<!-- CTA Button -->
			<div
				class={twMerge(
					'transition-all delay-300 duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				<a
					href="/auth/login"
					class="inline-flex items-center gap-3 rounded-2xl bg-[#ff4d00] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all"
				>
					START ACCELERATING
					<ArrowRight class="h-5 w-5" />
				</a>
			</div>
		</div>

		<!-- Right: Feature Grid (Desktop) -->
		<div class="hidden grid-cols-2 gap-4 lg:grid">
			{#each features as feature, i}
				{@const Icon = feature.icon}
				<div
					class={twMerge(
						'flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 transition-all duration-700 hover:bg-white hover:shadow-md',
						featuresVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
					)}
					style={`animation-delay: ${i * 150 + 400}ms`}
				>
					<!-- Icon -->
					<div
						class={twMerge(
							'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
							feature.bgColor
						)}
					>
						<Icon class={twMerge('h-6 w-6', feature.iconColor)} />
					</div>

					<h3 class="font-semibold text-slate-900 capitalize">
						{feature.title}
					</h3>
					<!-- Content -->
					<div class="min-w-0">
						<p class="text-sm leading-relaxed text-slate-600">
							{feature.description}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
