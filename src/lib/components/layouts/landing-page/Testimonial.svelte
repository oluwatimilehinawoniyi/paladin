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
		multiplier: '3 min',
		improvement: 'Per application',
		description:
			"Paladin cuts application time from 1-2 hours to about 3 minutes. AI drafts the cover letter, you tweak it, and you're done. Not magic—just removing the repetitive parts so you can focus on customization.",
		color: true
	},
	{
		multiplier: '0 chaos',
		improvement: 'Better organization',
		description:
			'Track every application in one place. Which profile you used, which companies you applied to, what happened. No more "I think I applied here two weeks ago?" moments. Just clean, simple tracking.',
		color: false
	}
];

	const testimonials = [
		{
			name: 'Marcus Chen',
			title: 'Software Engineer',
			company: null,
			avatar: '👨‍💻',
			quote:
				'I code, but I also do DevOps and cloud architecture. Before Paladin, I was rewriting my entire CV for each role type. Now I just switch profiles. Saved me maybe 20 hours last month.',
			highlight: false,
			companyLogo: '🟢'
		},
		{
			name: 'Sarah Rodriguez',
			title: 'Product Manager',
			company: null,
			avatar: '👩‍🚀',
			quote:
				"The cover letter AI isn't perfect, but it gets me 70% there. I spend 10 minutes editing instead of an hour staring at a blank page. That's the win.",
			highlight: true,
			companyLogo: '🔵'
		},
		{
			name: 'David Kim',
			title: 'Data Scientist',
			company:null,
			avatar: '👨‍🔬',
			quote:
				"I have profiles for data science, analytics, and ML engineering. Paladin tracks which one I used where. Sounds simple, but it's the organization I needed.",
			highlight: true,
			companyLogo: '🔴'
		},
		{
			name: 'Emma Thompson',
			title: 'UX Designer',
			company: null,
			avatar: '👩‍🎨',
			quote:
				"I was using Google Docs, Notion, and a spreadsheet. Now it's just... one place. Not revolutionary, just practical.",
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
				Honest feedbacks
			</div>

			<h2
				class={twMerge(
					'mb-4 text-3xl font-bold text-slate-900 transition-all delay-100 duration-700 lg:text-4xl xl:text-5xl',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				People who get it
			</h2>

			<p
				class={twMerge(
					'text-xl text-slate-500 transition-all delay-200 duration-700',
					isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				)}
			>
				Paladin isn't magic. But it makes the grind a little less grinding.
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
										{testimonial.title}
										<!-- , {testimonial.company} -->
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
