<script lang="ts">
	import ProblemStatement from '$lib/components/layouts/landing-page/ProblemStatement.svelte';
	import Features from '$lib/components/layouts/landing-page/Features.svelte';
	import Testimonial from '$lib/components/layouts/landing-page/Testimonial.svelte';
	import Faq from '$lib/components/layouts/landing-page/FAQ.svelte';
	import Footer from '$lib/components/layouts/landing-page/Footer.svelte';
	import Nav from '$lib/components/layouts/landing-page/Nav.svelte';
	import Hero from '$lib/components/layouts/landing-page/Hero.svelte';
</script>

<div class="min-h-screen bg-white">
	<Nav />

	<Hero />

	<ProblemStatement />

	<Features />

	<Testimonial />

	<Faq />

	<Footer />
</div>
