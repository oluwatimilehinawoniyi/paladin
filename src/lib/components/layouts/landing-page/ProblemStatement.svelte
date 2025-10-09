<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { Clock, FileText, BarChart3, Target, Brain, Users, Pickaxe, Files } from '@lucide/svelte';

	// Props for customization
	interface Props {
		className?: string;
	}

	let { className = '' }: Props = $props();

	// Animation state
	let isVisible = $state(false);
	let problemsVisible = $state(false);

	// Component classes
	let containerClasses = twMerge('relative py-8 lg:py-14 bg-white overflow-hidden', className);

	// Problems data - realistic job search pain points
	const problems = [
		{
			icon: Users,
			title: 'Skill Set Juggling',
			description:
				'You have 3+ different skill sets but only one resume. Applying to diverse roles means rewriting everything, every single time.',
			stat: '3hrs+ fine-tuning a profile',
			color: 'text-red-600 bg-red-50'
		},
		{
			icon: FileText,
			title: 'Application Amnesia',
			description: 'Scattered applications across emails, spreadsheets, and multiple platforms',
			stat: '67% lost track',
			color: 'text-orange-600 bg-orange-50'
		},
		{
			icon: Pickaxe,
			title: ' Copy-Paste Exhaustion',
			description:
				'Tailoring cover letters for each role is necessary. Doing it 50 times manually is soul-crushing.',
			stat: '0% visibility',
			color: 'text-amber-600 bg-amber-50'
		},
		{
			icon: Files,
			title: 'No Proper System',
			description:
				'Spreadsheets, emails, browser tabs. Your job search is scattered across 10 places and none of them talk to each other.',
			stat: 'shooting blank shots',
			color: 'text-rose-600 bg-rose-50'
		}
	];
	onMount(() => {
		setTimeout(() => (isVisible = true), 200);
		setTimeout(() => (problemsVisible = true), 600);
	});
</script>

<section class={containerClasses}>
	<div class="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="mb-20 text-center">
			<div
				class={twMerge(
					'mb-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				<Brain class="h-4 w-4" />
				The Real Problem
			</div>

			<h2
				class={twMerge(
					'mb-6 text-3xl font-bold text-slate-900 transition-all delay-100 duration-700 lg:text-4xl xl:text-5xl',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				The job market wants you in a box.
				<br />
				<span class="text-slate-400">But you don't fit in one.</span>
			</h2>

			<p
				class={twMerge(
					'mx-auto max-w-3xl text-xl text-slate-600 transition-all delay-200 duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				You're a developer who also does design. A marketer with data skills. An engineer who can
				write. Managing separate CVs, different cover letters, and tracking where you applied for
				what? It's chaos.
			</p>
		</div>

		<!-- Problems Grid -->
		<div class="mb-24">
			<h3
				class={twMerge(
					'mb-12 text-center text-2xl font-bold text-slate-900 transition-all delay-300 duration-700',
					problemsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
				)}
			>
				The Current Reality
			</h3>

			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each problems as problem, i}
					{@const Icon = problem.icon}
					<div
						class={twMerge(
							'relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-700 hover:shadow-md',
							problemsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
						)}
						style={`animation-delay: ${i * 100 + 400}ms`}
					>
						<!-- Problem stat badge -->
						<div
							class="absolute -top-3 -right-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white"
						>
							{problem.stat}
						</div>

						<!-- Icon -->
						<div
							class={twMerge(
								'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
								problem.color
							)}
						>
							<Icon class="h-6 w-6" />
						</div>

						<!-- Content -->
						<h4 class="mb-3 text-lg font-semibold text-slate-900">
							{problem.title}
						</h4>
						<p class="text-sm leading-relaxed text-slate-600">
							{problem.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
