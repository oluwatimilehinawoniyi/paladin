<script lang="ts">
	import Sidebar from '$lib/components/layouts/Sidebar.svelte';
	import MobileNavbar from '$lib/components/layouts/MobileNavbar.svelte';
	import { onDestroy, onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { authStore } from '$lib/stores/authStore';
	import { useTokenRefresh } from "$lib/hooks/useRefreshToken.svelte";
	import { notificationStore } from '$lib/stores/notificationStore';
	
	const { data } = $props<{ data: LayoutData }>();

	useTokenRefresh();

	
	let isAuthenticated = $derived($authStore.user !== null);

	onMount(() => {
		if (isAuthenticated) {
			notificationStore.init();
		}
	});

	onDestroy(() => {
		notificationStore.destroy();
	});

	$effect(() => {
		if (isAuthenticated) {
			notificationStore.init();
		} else {
			notificationStore.destroy();
		}
	});

	onMount(async () => {
		if (data.user) {
			authStore.setUser(data.user);
		} else {
			await authStore.init();
		}
	});

</script>

<main class="flex h-full min-h-screen">
	<Sidebar />

	<div class="flex flex-1 flex-col">
		<!-- Mobile Navbar -->
		<MobileNavbar />

		<!-- Main Content -->
		<div class="flex-1">
			<slot />
		</div>
	</div>
</main>
