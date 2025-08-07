<script lang="ts">
	import { ArrowLeft, Shield } from '@lucide/svelte';
	import Navbar from '$lib/components/layouts/navbar.svelte';
</script>

<div class="mx-auto min-h-screen max-w-5xl bg-white">
	<!-- Navbar -->
	<Navbar />

	<!-- Header -->
	<section class="bg-gray-50 py-16">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl">
				<!-- Back button -->
				<div class="mb-6">
					<a
						href="/"
						class="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-[#ff4d00]"
					>
						<ArrowLeft class="h-4 w-4" />
						Back to Home
					</a>
				</div>

				<!-- Title -->
				<div class="mb-6 flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff4d00]/10">
						<Shield class="h-6 w-6 text-[#ff4d00]" />
					</div>
					<div>
						<h1 class="text-4xl font-bold text-gray-900">Privacy Policy</h1>
						<p class="mt-2 text-gray-600">How we protect and handle your personal information</p>
					</div>
				</div>

				<div class="text-sm text-gray-500">
					<p>Effective Date: January 1, 2025</p>
					<p>Last Updated: January 1, 2025</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Content -->
	<section class="py-16">
		<div class="container mx-auto px-4">
			<div class="prose prose-lg prose-gray mx-auto max-w-4xl">
				<!-- Manually formatted content from markdown -->
				<h2>Introduction</h2>
				<p>
					Welcome to Paladin ("we," "our," or "us"). We are committed to protecting your privacy and
					ensuring the security of your personal information. This Privacy Policy explains how we
					collect, use, disclose, and safeguard your information when you use our job application
					assistant platform.
				</p>

				<h2>Information We Collect</h2>

				<h3>Personal Information You Provide</h3>
				<ul>
					<li><strong>Account Information:</strong> Name, email address, password</li>
					<li>
						<strong>Profile Data:</strong> Professional summaries, skills, work experience, education
					</li>
					<li>
						<strong>Resume/CV Files:</strong> Documents you upload to create job application profiles
					</li>
					<li>
						<strong>Job Application Data:</strong> Company names, positions applied for, application
						dates, cover letters
					</li>
					<li>
						<strong>Communication Data:</strong> Messages sent through our platform, support inquiries
					</li>
				</ul>

				<h3>Information Collected Automatically</h3>
				<ul>
					<li>
						<strong>Usage Data:</strong> How you interact with our platform, features used, time spent
					</li>
					<li>
						<strong>Device Information:</strong> IP address, browser type, operating system, device identifiers
					</li>
					<li>
						<strong>Cookies and Tracking:</strong> We use cookies to enhance your experience and analyze
						platform usage
					</li>
					<li>
						<strong>Analytics Data:</strong> Application success rates, response times, user engagement
						metrics
					</li>
				</ul>

				<h3>Third-Party Information</h3>
				<ul>
					<li>
						<strong>Job Posting Data:</strong> Information from job boards and company websites (publicly
						available)
					</li>
					<li>
						<strong>Professional Networks:</strong> Data from LinkedIn or similar platforms (with your
						consent)
					</li>
				</ul>

				<h2>How We Use Your Information</h2>

				<h3>Core Platform Functions</h3>
				<ul>
					<li>
						<strong>Profile Creation:</strong> Building and maintaining your professional profiles
					</li>
					<li>
						<strong>Application Generation:</strong> Creating personalized cover letters and applications
					</li>
					<li>
						<strong>Analytics and Tracking:</strong> Monitoring your job search progress and success
						rates
					</li>
					<li>
						<strong>Platform Optimization:</strong> Improving our AI algorithms and user experience
					</li>
				</ul>

				<h3>Communication</h3>
				<ul>
					<li>
						<strong>Service Updates:</strong> Notifications about new features, maintenance, or important
						changes
					</li>
					<li>
						<strong>Application Status:</strong> Updates on your job applications and responses
					</li>
					<li>
						<strong>Customer Support:</strong> Responding to your inquiries and providing assistance
					</li>
					<li><strong>Marketing Communications:</strong> Promotional emails (with your consent)</li>
				</ul>

				<h3>Legal and Security</h3>
				<ul>
					<li>
						<strong>Compliance:</strong> Meeting legal obligations and regulatory requirements
					</li>
					<li>
						<strong>Security:</strong> Protecting against fraud, abuse, and unauthorized access
					</li>
					<li>
						<strong>Dispute Resolution:</strong> Handling any legal issues or disputes that may arise
					</li>
				</ul>

				<h2>Information Sharing and Disclosure</h2>

				<div class="my-6 border-l-4 border-green-400 bg-green-50 p-4">
					<p class="font-semibold text-green-800">
						We DO NOT sell your personal information to third parties.
					</p>
				</div>

				<h3>When We May Share Information</h3>
				<ul>
					<li>
						<strong>Job Applications:</strong> When you apply to jobs through our platform, we share
						relevant profile information with prospective employers
					</li>
					<li>
						<strong>Service Providers:</strong> We work with trusted third-party vendors who help us
						operate our platform:
						<ul>
							<li>Cloud storage providers (AWS, Google Cloud)</li>
							<li>Email service providers</li>
							<li>Analytics services</li>
							<li>Payment processors</li>
						</ul>
					</li>
					<li>
						<strong>Legal Requirements:</strong> We may disclose information when required by law, court
						order, or to protect our rights and safety
					</li>
					<li>
						<strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale, your
						information may be transferred to the new entity
					</li>
				</ul>

				<h3>Data Security</h3>
				<p>We implement industry-standard security measures to protect your information:</p>
				<ul>
					<li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
					<li>
						<strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis
					</li>
					<li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
					<li><strong>Secure Infrastructure:</strong> SOC 2 compliant hosting and data centers</li>
				</ul>

				<h2>Your Rights and Choices</h2>

				<h3>Account Management</h3>
				<ul>
					<li><strong>Access:</strong> View and download your personal data</li>
					<li><strong>Correction:</strong> Update or correct inaccurate information</li>
					<li><strong>Deletion:</strong> Delete your account and associated data</li>
					<li><strong>Portability:</strong> Export your data in a readable format</li>
				</ul>

				<h3>Privacy Controls</h3>
				<ul>
					<li><strong>Email Preferences:</strong> Opt-out of marketing communications</li>
					<li><strong>Cookie Settings:</strong> Manage cookie preferences in your browser</li>
					<li>
						<strong>Data Sharing:</strong> Control how your information is shared with employers
					</li>
				</ul>

				<h3>Geographic Rights</h3>
				<ul>
					<li>
						<strong>EU/UK Residents (GDPR):</strong> You have additional rights including data portability,
						right to be forgotten, and the right to object to processing
					</li>
					<li>
						<strong>California Residents (CCPA):</strong> You have the right to know what personal information
						we collect and how it's used
					</li>
				</ul>

				<h2>Contact Us</h2>
				<p>If you have questions about this Privacy Policy or our data practices:</p>
				<ul>
					<li><strong>Email:</strong> privacy@paladin.com</li>
					<li><strong>Address:</strong> Paladin Privacy Team, [Your Address]</li>
					<li><strong>Data Protection Officer:</strong> dpo@paladin.com</li>
				</ul>

				<div class="my-8 border-l-4 border-blue-400 bg-blue-50 p-4">
					<p class="text-blue-800 italic">
						This Privacy Policy is designed to be comprehensive and transparent about our data
						practices. We are committed to protecting your privacy while providing you with the best
						job search experience possible.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer CTA -->
	<section class="bg-gray-50 py-16">
		<div class="container mx-auto px-4 text-center">
			<h3 class="mb-4 text-2xl font-bold text-gray-900">Questions About Our Privacy Practices?</h3>
			<p class="mb-6 text-gray-600">
				Our team is here to help you understand how we protect your information.
			</p>
			<a
				href="/contact"
				class="inline-flex items-center justify-center rounded-lg bg-[#ff4d00] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#ff4d00]/90"
			>
				Contact Support
			</a>
		</div>
	</section>
</div>
