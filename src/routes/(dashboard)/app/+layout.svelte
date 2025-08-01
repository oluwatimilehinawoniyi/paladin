<script lang="ts">
	import Sidebar from '$lib/components/layouts/Sidebar.svelte';
</script>

<main class="flex min-h-screen">
	<Sidebar />
	<section class="">
		<slot />
	</section>
</main>
