<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import ModalContainer from '$lib/components/ui/ModalContainer.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';

	let { children } = $props();

	onMount(async () => {
		if (browser) {
			await authStore.init();
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<ModalContainer />
