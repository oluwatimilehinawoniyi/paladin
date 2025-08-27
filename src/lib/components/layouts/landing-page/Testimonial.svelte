<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { Star, ArrowRight, Quote } from '@lucide/svelte';

	interface Props {
		className?: string;
	}

	let { className = '' }: Props = $props();

	let isVisible = $state(false);
	let testimonialsVisible = $state(false);

	let containerClasses = twMerge('relative py-8 lg:py-14 max-w-5xl mx-auto', className);

	// Success metrics data
	const metrics = [
		{
			multiplier: '8X',
			improvement: 'Faster applications',
			description:
				'Paladin users create personalized applications 8x faster than traditional methods, spending minutes instead of hours per application.',
			color: true
		},
		{
			multiplier: '3X',
			improvement: 'Higher response rates',
			description:
				'AI-powered personalization leads to significantly higher callback rates compared to generic applications.',
			color: false
		}
	];

	const testimonials = [
		{
			name: 'Marcus Chen',
			title: 'Software Engineer',
			company: 'Google',
			avatar: '👨‍💻',
			quote:
				'Paladin helped me land my dream job at Google in just 3 weeks. The AI cover letters were so personalized that recruiters actually commented on them during interviews.',
			highlight: false,
			companyLogo: '🟢'
		},
		{
			name: 'Sarah Rodriguez',
			title: 'Product Manager',
			company: 'Meta',
			avatar: '👩‍🚀',
			quote:
				"From career transition to job offer in 2 months. Paladin's multiple profiles feature let me target both PM and UX roles simultaneously. Incredible results!",
			highlight: true,
			companyLogo: '🔵'
		},
		{
			name: 'David Kim',
			title: 'Data Scientist',
			company: 'Netflix',
			avatar: '👨‍🔬',
			quote:
				'The analytics dashboard showed me exactly which applications were working. I optimized my approach and got 5 interviews in one week.',
			highlight: true,
			companyLogo: '🔴'
		},
		{
			name: 'Emma Thompson',
			title: 'UX Designer',
			company: 'Airbnb',
			avatar: '👩‍🎨',
			quote:
				'The job matching intelligence was game-changing. It highlighted exactly which skills I needed to add to my profile for better matches.',
			highlight: false,
			companyLogo: '🟡'
		}
		// {
		// 	name: 'Alex Johnson',
		// 	title: 'Marketing Director',
		// 	company: 'Spotify',
		// 	avatar: '👨‍💼',
		// 	quote:
		// 		'Switched careers from finance to tech marketing using Paladin. The platform guided my entire transition with personalized strategies.',
		// 	highlight: true,
		// 	companyLogo: '🟢'
		// }
	];

	onMount(() => {
		setTimeout(() => (isVisible = true), 200);
		setTimeout(() => (testimonialsVisible = true), 600);
	});
</script>

<section class={containerClasses}>
	<div class="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Section Header -->
		<div class="mb-14 text-center">
			<div
				class={twMerge(
					'mb-6 inline-flex items-center gap-2 rounded-full bg-[#ff4d00]/10 px-4 py-2 text-sm font-medium text-[#ff4d00] transition-all duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				<Quote class="h-4 w-4" />
				TESTIMONIALS
			</div>

			<h2
				class={twMerge(
					'mb-4 text-3xl font-bold text-slate-900 transition-all delay-100 duration-700 lg:text-4xl xl:text-5xl',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				Results that speak volumes
			</h2>

			<p
				class={twMerge(
					'text-xl text-slate-500 transition-all delay-200 duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				Read success stories
			</p>

			<p
				class={twMerge(
					'mt-2 text-lg text-slate-600 transition-all delay-300 duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				Find out how our users are accelerating their career success.
			</p>
		</div>

		<!-- Metrics + Testimonials Grid -->
		<div class="grid gap-6 lg:grid-cols-12">
			<!-- Left: Success Metrics -->
			<div class="space-y-6 lg:col-span-5">
				{#each metrics as metric, i}
					<div
						class={twMerge(
							'rounded-2xl border border-slate-50 bg-white p-6 shadow-sm transition-all duration-700 hover:shadow-lg',
							testimonialsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
							metric.color ? 'bg-[#ff4d00]' : 'bg-[#121212]'
						)}
						style={`animation-delay: ${i * 200 + 400}ms`}
					>
						<!-- Large metric -->
						<div class="mb-6">
							<p
								class={twMerge(
									'bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent',
									metric.color ? 'text-white' : 'text-[#ff4d00]'
								)}
							>
								{metric.multiplier}
							</p>
							<p class="mt-2 text-xl font-semibold text-white/70">
								{metric.improvement}
							</p>
						</div>

						<!-- Quote and description -->
						<div class="relative">
							<Quote
								class={twMerge('mb-3 size-6', metric.color ? 'text-white' : 'text-[#ff4d00]')}
							/>
							<p class="leading-relaxed text-white italic">
								{metric.description}
							</p>
						</div>
					</div>
				{/each}
			</div>

			<!-- Right: Testimonials -->
			<div class="grid grid-cols-2 gap-6 lg:col-span-7">
				{#each testimonials as testimonial, i}
					<div
						class={twMerge(
							'rounded-2xl bg-white p-4 shadow-sm transition-all duration-700 hover:shadow-md',
							testimonialsVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0',
							testimonial.highlight ? 'bg-[#ff4d00]/5' : ''
						)}
						style={`animation-delay: ${i * 150 + 600}ms`}
					>
						<!-- Quote -->
						<div class="mb-4">
							<Quote class="mb-3 h-5 w-5 text-[#ff4d00]" />
							<p class="leading-relaxed text-[#121212]/50">
								"{testimonial.quote}"
							</p>
						</div>

						<!-- User info -->
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-2">
								<!-- Avatar -->
								<div
									class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-lg"
								>
									{testimonial.avatar}
								</div>

								<!-- Name and title -->
								<div>
									<div class="font-semibold text-slate-900">{testimonial.name}</div>
									<div class="text-sm text-slate-500">
										{testimonial.title}, {testimonial.company}
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
