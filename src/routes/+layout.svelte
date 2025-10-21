<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import ModalContainer from '$lib/components/ui/ModalContainer.svelte';
	import { dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	let { children } = $props();

	injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<ModalContainer />