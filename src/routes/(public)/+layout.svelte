<script lang="ts">
	let { children } = $props();
</script>

<main>
	<section class="container mx-auto">
		{@render children?.()}
	</section>
</main>
