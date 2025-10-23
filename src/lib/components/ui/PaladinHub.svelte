<script lang="ts">
	import { Inbox, Flame, List } from '@lucide/svelte';
	import { notificationStore } from '$lib/stores/notificationStore';
	import { notificationPollingService } from '$lib/services/notificationPollingService';
	import { onMount, onDestroy } from 'svelte';
	import type { PaladinHubTab } from '$lib/types/notification.types';
	import InboxTab from './InboxTab.svelte';
	import RequestsTab from './RequestsTab.svelte';
	import MyRequestsTab from './MyRequestsTab.svelte';

	let { closeModal } = $props();

	let activeTab = $state<PaladinHubTab>('inbox');

	const tabs = [
		{ id: 'inbox' as PaladinHubTab, label: 'Inbox', icon: Inbox },
		{ id: 'requests' as PaladinHubTab, label: 'Requests', icon: Flame },
		{ id: 'my-requests' as PaladinHubTab, label: 'My Requests', icon: List }
	];

	onMount(() => {
		notificationPollingService.startListPolling();
		notificationStore.fetchNotifications(true);
	});

	onDestroy(() => {
		notificationPollingService.stopListPolling();
	});

	const { allRequests, myRequests } = notificationStore;

	function handleTabChange(tabId: PaladinHubTab) {
		activeTab = tabId;

		if (tabId === 'requests' && $allRequests.length === 0) {
			notificationStore.fetchFeatureRequests();
		}
	}
</script>

<div class="flex h-[80vh] max-h-[700px] w-full max-w-4xl flex-col">
	<div class="border-b border-gray-200 bg-white px-6 py-4">
		<h2 class="text-2xl font-bold text-gray-900">Paladin Hub</h2>
		<p class="mt-1 text-sm text-gray-600">Stay updated with notifications and feature requests</p>
	</div>

	<div class="border-b border-gray-200 bg-white">
		<nav class="flex gap-1 px-6" aria-label="Tabs">
			{#each tabs as tab}
				{@const Icon = tab.icon}
				<button
					onclick={() => handleTabChange(tab.id)}
					class="flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
					class:border-[#ff4d00]={activeTab === tab.id}
					class:text-[#ff4d00]={activeTab === tab.id}
					class:border-transparent={activeTab !== tab.id}
					class:text-gray-600={activeTab !== tab.id}
					class:hover:text-gray-900={activeTab !== tab.id}
				>
					<Icon class="h-4 w-4" />
					{tab.label}
				</button>
			{/each}
		</nav>
	</div>

	<div class="flex-1 overflow-hidden bg-gray-50">
		{#if activeTab === 'inbox'}
			<InboxTab />
		{:else if activeTab === 'requests'}
			<RequestsTab />
		{:else if activeTab === 'my-requests'}
			<MyRequestsTab />
		{/if}
	</div>
</div>
