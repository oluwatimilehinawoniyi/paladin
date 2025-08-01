<script lang="ts">
	import Navbar from '$lib/components/layouts/navbar.svelte';
</script>

<main>
	<div class="sticky top-4 z-30 mt-4">
		<Navbar />
	</div>
	<section class="container mx-auto">
		<slot />
	</section>
</main>
