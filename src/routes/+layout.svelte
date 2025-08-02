<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import ModalContainer from '$lib/components/ui/ModalContainer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<ModalContainer />