<script lang="ts">
	import { ArrowLeft, FileText } from '@lucide/svelte';
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
						<FileText class="h-6 w-6 text-[#ff4d00]" />
					</div>
					<div>
						<h1 class="text-4xl font-bold text-gray-900">Terms of Service</h1>
						<p class="mt-2 text-gray-600">The rules and guidelines for using Paladin</p>
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
			<div class="prose prose-lg prose-gray mx-auto max-w-4xl max-w-none">
				<h2>Agreement to Terms</h2>
				<p>
					By accessing or using Paladin ("the Platform," "Service," "we," "us," or "our"), you
					("User," "you," or "your") agree to be bound by these Terms of Service ("Terms"). If you
					do not agree to these Terms, you may not use our Service.
				</p>

				<h2>Description of Service</h2>
				<p>Paladin is an AI-powered job application assistant platform that helps users:</p>
				<ul>
					<li>Create and manage multiple professional profiles</li>
					<li>Generate personalized cover letters using artificial intelligence</li>
					<li>Track job applications and analyze success rates</li>
					<li>Optimize job search strategies through analytics and insights</li>
				</ul>

				<h2>Eligibility</h2>
				<p>To use Paladin, you must:</p>
				<ul>
					<li>Be at least 16 years old</li>
					<li>Have the legal capacity to enter into this agreement</li>
					<li>Provide accurate and complete information during registration</li>
					<li>Maintain the security of your account credentials</li>
				</ul>

				<h2>Account Registration and Security</h2>

				<h3>Account Creation</h3>
				<ul>
					<li>You must provide accurate, current, and complete information</li>
					<li>You are responsible for maintaining the confidentiality of your login credentials</li>
					<li>You must notify us immediately of any unauthorized use of your account</li>
					<li>One person may not maintain multiple accounts</li>
				</ul>

				<h3>Account Security</h3>
				<ul>
					<li>You are solely responsible for all activities that occur under your account</li>
					<li>
						We are not liable for any loss or damage arising from your failure to secure your
						account
					</li>
					<li>
						We reserve the right to suspend or terminate accounts that violate our security policies
					</li>
				</ul>

				<h2>Acceptable Use Policy</h2>

				<h3>You May</h3>
				<ul>
					<li>Use Paladin for legitimate job search purposes</li>
					<li>Create accurate professional profiles representing your skills and experience</li>
					<li>Apply to job opportunities through our platform</li>
					<li>Share feedback and suggestions for platform improvement</li>
				</ul>

				<h3>You May Not</h3>
				<ul>
					<li>Provide false, misleading, or inaccurate information</li>
					<li>Use the platform for illegal activities or purposes</li>
					<li>Attempt to reverse engineer or access our proprietary algorithms</li>
					<li>Create fake profiles or impersonate others</li>
					<li>Spam employers or abuse the application system</li>
					<li>Use automated tools or bots to interact with our platform</li>
					<li>Violate any applicable laws or regulations</li>
				</ul>

				<h2>AI-Generated Content</h2>

				<h3>Cover Letters and Applications</h3>
				<ul>
					<li>
						AI-generated cover letters are suggestions based on your profile and job descriptions
					</li>
					<li>
						You are responsible for reviewing and editing all AI-generated content before submission
					</li>
					<li>We do not guarantee the accuracy or effectiveness of AI-generated content</li>
					<li>Final responsibility for application content lies with you</li>
				</ul>

				<div class="my-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
					<p class="text-yellow-800">
						<strong>Important:</strong> AI-generated content becomes your property once created for your
						use. You may modify, edit, and use it as you see fit, but you're responsible for reviewing
						it before submission.
					</p>
				</div>

				<h2>Subscription and Payment Terms</h2>

				<h3>Free Plan</h3>
				<ul>
					<li>Limited features as described on our pricing page</li>
					<li>Subject to usage limitations and restrictions</li>
					<li>May include promotional materials or advertisements</li>
				</ul>

				<h3>Paid Subscriptions</h3>
				<ul>
					<li>Subscription fees are charged in advance on a recurring basis</li>
					<li>All fees are non-refundable unless otherwise stated</li>
					<li>We may change subscription prices with 30 days' notice</li>
					<li>You may cancel your subscription at any time</li>
				</ul>

				<h2>Limitation of Liability</h2>

				<h3>No Employment Guarantees</h3>
				<div class="my-6 border-l-4 border-red-400 bg-red-50 p-4">
					<ul class="mb-0 text-red-800">
						<li>We do not guarantee job offers, interviews, or employment outcomes</li>
						<li>Success depends on many factors beyond our control</li>
						<li>We provide tools and assistance but cannot guarantee results</li>
					</ul>
				</div>

				<h3>Liability Limitations</h3>
				<ul>
					<li>Our liability is limited to the maximum extent permitted by law</li>
					<li>We are not liable for indirect, incidental, or consequential damages</li>
					<li>
						Our total liability will not exceed the amount you paid for our services in the past 12
						months
					</li>
				</ul>

				<h2>Service Availability and Modifications</h2>

				<h3>Platform Availability</h3>
				<ul>
					<li>We strive to maintain high uptime but do not guarantee uninterrupted service</li>
					<li>We may perform maintenance that temporarily affects service availability</li>
					<li>We are not liable for damages caused by service interruptions</li>
				</ul>

				<h3>Service Modifications</h3>
				<ul>
					<li>We may modify, update, or discontinue features at any time</li>
					<li>We will provide reasonable notice of significant changes</li>
					<li>Continued use of the platform constitutes acceptance of modifications</li>
				</ul>

				<h2>Termination</h2>

				<h3>Your Rights</h3>
				<ul>
					<li>You may terminate your account at any time</li>
					<li>You may export your data before termination</li>
					<li>Paid subscriptions will continue until the end of the billing period</li>
				</ul>

				<h3>Our Rights</h3>
				<ul>
					<li>We may terminate or suspend accounts that violate these Terms</li>
					<li>We may discontinue the service with reasonable notice</li>
					<li>We reserve the right to refuse service to anyone</li>
				</ul>

				<h2>Changes to Terms</h2>
				<p>We may update these Terms periodically. We will:</p>
				<ul>
					<li>Notify you of significant changes via email or platform notification</li>
					<li>Post the effective date of any changes</li>
					<li>Give you the opportunity to review changes before they take effect</li>
				</ul>

				<p>Continued use of Paladin after changes constitute acceptance of the updated Terms.</p>

				<h2>Contact Information</h2>
				<p>If you have questions about these Terms of Service:</p>
				<ul>
					<li><strong>Email:</strong> legal@paladin.com</li>
					<li><strong>Address:</strong> Paladin Legal Team, [Your Address]</li>
					<li><strong>Customer Support:</strong> support@paladin.com</li>
				</ul>

				<h2>Acknowledgment</h2>
				<p>
					By using Paladin, you acknowledge that you have read, understood, and agree to be bound by
					these Terms of Service.
				</p>

				<div class="my-8 border-l-4 border-blue-400 bg-blue-50 p-4">
					<p class="text-blue-800 italic">
						These Terms of Service are designed to be fair and transparent while protecting both
						users and the platform. We encourage you to read them carefully and contact us if you
						have any questions.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer CTA -->
	<section class="bg-gray-50 py-16">
		<div class="container mx-auto px-4 text-center">
			<h3 class="mb-4 text-2xl font-bold text-gray-900">Questions About Our Terms?</h3>
			<p class="mb-6 text-gray-600">
				Need clarification on any of our terms and conditions? We're here to help.
			</p>
			<a
				href="/contact"
				class="inline-flex items-center justify-center rounded-lg bg-[#ff4d00] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#ff4d00]/90"
			>
				Get Support
			</a>
		</div>
	</section>
</div>
