<script lang="ts">
	import { Plus, Lightbulb, Loader2 } from '@lucide/svelte';
	import { notificationStore } from '$lib/stores/notificationStore';
	import { modalStore } from '$lib/stores/modalStore';
	import {
		filterFeatureRequests,
		FeatureRequestStatus,
		FeatureRequestCategory,
		CATEGORY_LABELS
	} from '$lib/types/notification.types';
	import type { RequestSortOption } from '$lib/types/notification.types';
	import FeatureRequestCard from './FeatureRequestCard.svelte';

	const {
		allRequests: allRequestsStore,
		requestFilters: filtersStore,
		isLoadingRequests: isLoadingStore
	} = notificationStore;
	let allRequests = $derived($allRequestsStore);
	let filters = $derived($filtersStore);
	let isLoading = $derived($isLoadingStore);

	let filteredRequests = $derived(filterFeatureRequests(allRequests, filters));

	function handleNewRequest() {
		modalStore.open({
			component: () => import('$lib/components/modals/RequestFeatureModal.svelte'),
			options: { size: 'md' },
			props: {
				onSuccess: () => {
					notificationStore.fetchFeatureRequests();
				}
			}
		});
	}

	function handleSortChange(e: Event) {
		const sortBy = (e.target as HTMLSelectElement).value as RequestSortOption;
		notificationStore.setRequestFilters({ sortBy });
	}

	function handleStatusFilter(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		const status = value === 'ALL' ? 'ALL' : (value as FeatureRequestStatus);
		notificationStore.setRequestFilters({ status });
	}

	function handleCategoryFilter(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		const category = value === 'ALL' ? 'ALL' : (value as FeatureRequestCategory);
		notificationStore.setRequestFilters({ category });
	}

	async function handleUpvote(requestId: string, hasVoted: boolean) {
		if (hasVoted) {
			await notificationStore.removeUpvote(requestId);
		} else {
			await notificationStore.upvoteRequest(requestId);
		}
	}
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-gray-200 bg-white px-6 py-4">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div class="flex flex-wrap items-center gap-3">
				<select
					onchange={handleSortChange}
					value={filters.sortBy}
					class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
				>
					<option value="most-voted">Most Voted</option>
					<option value="newest">Newest</option>
					<option value="oldest">Oldest</option>
				</select>

				<select
					onchange={handleStatusFilter}
					value={filters.status}
					class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
				>
					<option value="ALL">All Status</option>
					{#each Object.values(FeatureRequestStatus) as status}
						<option value={status}>{status.replace(/_/g, ' ')}</option>
					{/each}
				</select>

				<select
					onchange={handleCategoryFilter}
					value={filters.category}
					class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
				>
					<option value="ALL">All Categories</option>
					{#each Object.entries(CATEGORY_LABELS) as [key, label]}
						<option value={key}>{label}</option>
					{/each}
				</select>
			</div>

			<button
				onclick={handleNewRequest}
				class="flex items-center gap-2 rounded-lg bg-[#ff4d00] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ff4d00]/90"
			>
				<Plus class="h-4 w-4" />
				New Request
			</button>
		</div>
	</div>

	<div class="flex-1 overflow-y-auto px-6 py-4">
		{#if isLoading}
			<div class="flex items-center justify-center py-16">
				<Loader2 class="h-8 w-8 animate-spin text-gray-400" />
			</div>
		{:else if filteredRequests.length === 0}
			<div class="flex flex-col items-center justify-center py-16">
				<Lightbulb class="h-16 w-16 text-gray-300" />
				<h3 class="mt-4 text-lg font-semibold text-gray-900">No requests found</h3>
				<p class="mt-2 text-center text-sm text-gray-600">
					{#if allRequests.length === 0}
						Be the first to suggest a feature!
					{:else}
						Try adjusting your filters
					{/if}
				</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each filteredRequests as request (request.id)}
					<FeatureRequestCard {request} onUpvote={handleUpvote} showUpvote={true} />
				{/each}
			</div>
		{/if}
	</div>
</div>
