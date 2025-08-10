<script lang="ts">
	import {
		ArrowRight,
		CheckCircle,
		Users,
		Target,
		BarChart3,
		FileText,
		Send,
		Star,
		Play,
		Zap,
		Shield,
		TrendingUp
	} from '@lucide/svelte';
	import Navbar from '$lib/components/layouts/navbar.svelte';

	// Stats data
	const stats = [
		{ number: '2.5x', label: 'Higher Response Rate' },
		{ number: '85%', label: 'Interview Success' },
		{ number: '10k+', label: 'Applications Sent' },
		{ number: '4.9/5', label: 'User Rating' }
	];

	// Features data
	const features = [
		{
			icon: Users,
			title: 'Multiple Professional Profiles',
			description:
				'Create tailored profiles for different roles and industries. Switch between them effortlessly for targeted applications.',
			color: 'bg-blue-100 text-blue-600'
		},
		{
			icon: FileText,
			title: 'AI-Generated Cover Letters',
			description:
				'Our smart assistant creates personalized cover letters that match job descriptions and highlight your strengths.',
			color: 'bg-green-100 text-green-600'
		},
		{
			icon: BarChart3,
			title: 'Application Analytics',
			description:
				'Track your success rate, monitor application status, and optimize your job search strategy with detailed insights.',
			color: 'bg-purple-100 text-purple-600'
		},
		{
			icon: Target,
			title: 'Smart Application Targeting',
			description:
				'Match your skills with job requirements automatically and apply to the most relevant opportunities.',
			color: 'bg-orange-100 text-orange-600'
		}
	];

	// How it works steps
	const steps = [
		{
			step: '01',
			title: 'Create Your Profiles',
			description:
				'Build multiple professional profiles with your skills, experience, and CV for different career paths.',
			icon: Users
		},
		{
			step: '02',
			title: 'Find Perfect Jobs',
			description:
				'Paste job descriptions and let Paladin analyze the requirements to match your best profile.',
			icon: Target
		},
		{
			step: '03',
			title: 'Generate Cover Letters',
			description:
				'Our AI creates personalized cover letters that speak directly to what employers are looking for.',
			icon: FileText
		},
		{
			step: '04',
			title: 'Send & Track',
			description:
				'Apply with one click and monitor your applications with detailed analytics and insights.',
			icon: Send
		}
	];

	// Testimonials data
	const testimonials = [
		{
			name: 'Sarah Chen',
			role: 'Frontend Developer',
			company: 'TechCorp',
			image:
				'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face',
			quote:
				'Paladin helped me land my dream job at TechCorp. The AI-generated cover letters were spot-on and saved me hours of writing.',
			rating: 5
		},
		{
			name: 'Marcus Johnson',
			role: 'Full Stack Engineer',
			company: 'StartupXYZ',
			image:
				'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face',
			quote:
				'The analytics feature is game-changing. I could see exactly which applications were working and optimize my approach.',
			rating: 5
		},
		{
			name: 'Emily Rodriguez',
			role: 'Product Manager',
			company: 'InnovateLabs',
			image:
				'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face',
			quote:
				'Having multiple profiles for different roles made my career transition seamless. Highly recommend Paladin to anyone job hunting.',
			rating: 5
		}
	];

	// Pricing plans
	const plans = [
		{
			name: 'Starter',
			price: 'Free',
			period: '',
			description: 'Perfect for getting started with job applications',
			features: [
				'2 Professional profiles',
				'10 AI cover letters/month',
				'Basic application tracking',
				'Email support'
			],
			cta: 'Get Started Free',
			popular: false
		},
		{
			name: 'Professional',
			price: '$19',
			period: '/month',
			description: 'For serious job seekers who want the best results',
			features: [
				'Unlimited profiles',
				'Unlimited AI cover letters',
				'Advanced analytics & insights',
				'Priority support',
				'Application templates',
				'Success rate optimization'
			],
			cta: 'Start Free Trial',
			popular: true
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			period: '',
			description: 'For teams and organizations',
			features: [
				'Everything in Professional',
				'Team collaboration',
				'Custom integrations',
				'Dedicated support',
				'Advanced reporting',
				'SSO & security features'
			],
			cta: 'Contact Sales',
			popular: false
		}
	];

	function scrollToSection(sectionId: string) {
		document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<div class="min-h-screen bg-white">
	<!-- Navbar -->
	<Navbar />

	<!-- Hero Section -->
	<section class="relative overflow-hidden py-10">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl text-center">
				<!-- Badge -->
				<div
					class="mb-8 inline-flex items-center rounded-full bg-[#ff4d00]/10 px-4 py-2 text-sm font-medium text-[#ff4d00]"
				>
					<Zap class="mr-2 h-4 w-4" />
					AI-Powered Job Application Assistant
				</div>

				<!-- Main Headline -->
				<h1 class="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
					Land Your Dream Job with
					<span class="text-[#ff4d00]">Smart Applications</span>
				</h1>

				<!-- Subheadline -->
				<p class="mb-8 text-xl text-gray-600 sm:text-2xl">
					Paladin helps you create multiple professional profiles, generate personalized cover
					letters, and track your applications with powerful analytics. Get hired faster with
					AI-powered job search.
				</p>

				<!-- CTA Buttons -->
				<div class="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
					<a
						href="/register"
						class="inline-flex items-center justify-center rounded-lg bg-[#ff4d00] px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-[#ff4d00]/90"
					>
						Get Started Free
						<ArrowRight class="ml-2 h-5 w-5" />
					</a>

					<button
						onclick={() => scrollToSection('demo')}
						class="inline-flex items-center justify-center rounded-lg border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-colors hover:bg-gray-50"
					>
						<Play class="mr-2 h-5 w-5" />
						Watch Demo
					</button>
				</div>

				<!-- Social Proof -->
				<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
					<div class="flex items-center">
						{#each Array(5) as _, i}
							<Star class="h-5 w-5 fill-yellow-400 text-yellow-400" />
						{/each}
					</div>
					<p class="text-gray-600">
						<span class="font-semibold">4.9/5</span> from 1,200+ job seekers
					</p>
				</div>
			</div>
		</div>

		<!-- Background decoration -->
		<div class="absolute inset-0 -z-10 overflow-hidden">
			<div
				class="absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#ff4d00]/20 to-orange-300/20 blur-3xl"
			></div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="border-y border-gray-200 bg-gray-50 py-16">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
				{#each stats as stat}
					<div class="text-center">
						<div class="text-4xl font-bold text-[#ff4d00] sm:text-5xl">{stat.number}</div>
						<div class="mt-2 text-sm font-medium text-gray-600 sm:text-base">{stat.label}</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="py-20 sm:py-32">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
					Everything You Need to Get Hired
				</h2>
				<p class="mb-16 text-xl text-gray-600">
					Paladin combines intelligent automation with powerful analytics to supercharge your job
					search
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
				{#each features as { icon: Icon, title, description, color }, index}
					<div
						class="group rounded-2xl border border-gray-200 p-8 transition-all hover:border-[#ff4d00]/30 hover:shadow-lg"
					>
						<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg {color}">
							<Icon class="h-6 w-6" />
						</div>
						<h3 class="mb-3 text-xl font-semibold text-gray-900">{title}</h3>
						<p class="text-gray-600">{description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section class="bg-gray-50 py-20 sm:py-32">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">How Paladin Works</h2>
				<p class="mb-16 text-xl text-gray-600">
					From profile creation to landing interviews, we've streamlined the entire job application
					process
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				{#each steps as { step, icon: Icon, title, description }, index}
					<div class="relative text-center">
						<!-- Step number -->
						<div class="mb-6 flex justify-center">
							<div
								class="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff4d00] text-2xl font-bold text-white"
							>
								{step}
							</div>
						</div>

						<!-- Icon -->
						<div class="mb-4 flex justify-center">
							<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
								<Icon class="h-6 w-6 text-[#ff4d00]" />
							</div>
						</div>

						<!-- Content -->
						<h3 class="mb-3 text-lg font-semibold text-gray-900">{title}</h3>
						<p class="text-gray-600">{description}</p>

						<!-- Connector line (except for last item) -->
						{#if index < steps.length - 1}
							<div
								class="absolute top-8 left-1/2 hidden h-0.5 w-full bg-gray-300 lg:block"
								style="transform: translateX(50%); width: calc(100% - 2rem);"
							></div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Testimonials Section -->
	<section class="py-20 sm:py-32">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">Success Stories</h2>
				<p class="mb-16 text-xl text-gray-600">
					See how Paladin has helped thousands of professionals land their dream jobs
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-3">
				{#each testimonials as testimonial}
					<div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
						<!-- Rating -->
						<div class="mb-4 flex items-center">
							{#each Array(testimonial.rating) as _}
								<Star class="h-5 w-5 fill-yellow-400 text-yellow-400" />
							{/each}
						</div>

						<!-- Quote -->
						<blockquote class="mb-6 text-gray-700">
							"{testimonial.quote}"
						</blockquote>

						<!-- Author -->
						<div class="flex items-center">
							<img
								src={testimonial.image}
								alt={testimonial.name}
								class="h-12 w-12 rounded-full object-cover"
							/>
							<div class="ml-4">
								<div class="font-semibold text-gray-900">{testimonial.name}</div>
								<div class="text-sm text-gray-600">{testimonial.role} at {testimonial.company}</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Pricing Section -->
	<section class="bg-gray-50 py-20 sm:py-32">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
					Simple, Transparent Pricing
				</h2>
				<p class="mb-16 text-xl text-gray-600">
					Choose the plan that fits your job search needs. Start free, upgrade when you're ready.
				</p>
			</div>

			<div class="grid gap-8 lg:grid-cols-3">
				{#each plans as plan}
					<div
						class="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm {plan.popular
							? 'border-[#ff4d00] ring-1 ring-[#ff4d00]'
							: ''}"
					>
						{#if plan.popular}
							<div
								class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[#ff4d00] px-4 py-1 text-sm font-medium text-white"
							>
								Most Popular
							</div>
						{/if}

						<!-- Plan header -->
						<div class="mb-8 text-center">
							<h3 class="text-2xl font-bold text-gray-900">{plan.name}</h3>
							<div class="mt-2 flex items-baseline justify-center">
								<span class="text-4xl font-bold text-gray-900">{plan.price}</span>
								{#if plan.period}
									<span class="ml-1 text-gray-600">{plan.period}</span>
								{/if}
							</div>
							<p class="mt-2 text-gray-600">{plan.description}</p>
						</div>

						<!-- Features -->
						<ul class="mb-8 space-y-3">
							{#each plan.features as feature}
								<li class="flex items-center">
									<CheckCircle class="mr-3 h-5 w-5 text-green-500" />
									<span class="text-gray-700">{feature}</span>
								</li>
							{/each}
						</ul>

						<!-- CTA -->
						<a
							href="/register"
							class="block w-full rounded-lg py-3 text-center font-semibold transition-colors {plan.popular
								? 'bg-[#ff4d00] text-white hover:bg-[#ff4d00]/90'
								: 'border border-gray-300 text-gray-700 hover:bg-gray-50'}"
						>
							{plan.cta}
						</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-20 sm:py-32">
		<div class="container mx-auto px-4">
			<div
				class="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-[#ff4d00] to-orange-500 px-8 py-16 text-center text-white"
			>
				<h2 class="mb-6 text-3xl font-bold sm:text-4xl">Ready to Transform Your Job Search?</h2>
				<p class="mb-8 text-xl opacity-90">
					Join thousands of professionals who've accelerated their careers with Paladin. Start your
					journey today – it's free to get started.
				</p>
				<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
					<a
						href="/auth/login"
						class="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
					>
						Sign In
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-gray-200 bg-gray-50 py-16">
		<div class="container mx-auto px-4">
			<div class="grid gap-8 md:grid-cols-4">
				<!-- Logo and description -->
				<div class="md:col-span-2">
					<div class="mb-4 flex items-center gap-2">
						<div class="flex h-8 w-8 items-center justify-center rounded bg-[#ff4d00]">
							<Shield class="h-5 w-5 text-white" />
						</div>
						<span class="text-2xl font-bold text-gray-900">Paladin</span>
					</div>
					<p class="mb-4 text-gray-600">
						The AI-powered job application assistant that helps you land your dream job faster.
						Create profiles, generate cover letters, and track your success.
					</p>
					<div class="flex items-center space-x-4">
						<div class="flex items-center text-sm text-gray-600">
							<TrendingUp class="mr-1 h-4 w-4" />
							Trusted by 10k+ job seekers
						</div>
					</div>
				</div>

				<!-- Quick links -->
				<div>
					<h3 class="mb-4 font-semibold text-gray-900">Product</h3>
					<ul class="space-y-2 text-gray-600">
						<li><a href="#features" class="hover:text-[#ff4d00]">Features</a></li>
						<li><a href="#pricing" class="hover:text-[#ff4d00]">Pricing</a></li>
						<li><a href="#testimonials" class="hover:text-[#ff4d00]">Success Stories</a></li>
						<li><a href="/demo" class="hover:text-[#ff4d00]">Demo</a></li>
					</ul>
				</div>

				<!-- Support -->
				<div>
					<h3 class="mb-4 font-semibold text-gray-900">Support</h3>
					<ul class="space-y-2 text-gray-600">
						<li><a href="/help" class="hover:text-[#ff4d00]">Help Center</a></li>
						<li><a href="/contact" class="hover:text-[#ff4d00]">Contact Us</a></li>
						<li><a href="/privacy" class="hover:text-[#ff4d00]">Privacy Policy</a></li>
						<li><a href="/terms" class="hover:text-[#ff4d00]">Terms of Service</a></li>
					</ul>
				</div>
			</div>

			<div class="mt-12 border-t border-gray-200 pt-8 text-center text-gray-600">
				<p>&copy; 2025 Paladin. All rights reserved. Made with ❤️ for job seekers worldwide.</p>
			</div>
		</div>
	</footer>
</div>
