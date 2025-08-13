<script lang="ts">
	import Sidebar from '$lib/components/layouts/Sidebar.svelte';
	import MobileNavbar from '$lib/components/layouts/MobileNavbar.svelte';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import { authStore } from '$lib/stores/authStore';

	export let data: LayoutData;

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
