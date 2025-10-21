<script lang="ts">
	import { Plus, Lightbulb, Loader2 } from '@lucide/svelte';
	import { notificationStore } from '$lib/stores/notificationStore';
	import { modalStore } from '$lib/stores/modalStore';
	import { FeatureRequestStatus } from '$lib/types/notification.types';
	import FeatureRequestCard from './FeatureRequestCard.svelte';

	const { myRequests: myRequestsStore, isLoadingMyRequests: isLoadingStore } = notificationStore;
	let myRequests = $derived($myRequestsStore);
	let isLoading = $derived($isLoadingStore);

	function handleNewRequest() {
		modalStore.open({
			component: () => import('$lib/components/modals/RequestFeatureModal.svelte'),
			options: { size: 'md' },
			props: {
				onSuccess: () => {
					notificationStore.fetchMyFeatureRequests();
				}
			}
		});
	}

	async function handleDelete(requestId: string) {
		const request = myRequests.find((r: any) => r.id === requestId);
		if (!request) return;

		modalStore.open({
			component: () => import('$lib/components/modals/ConfirmationModal.svelte'),
			props: {
				title: 'Delete Request',
				message: `Are you sure you want to delete "${request.title}"? This action cannot be undone.`,
				onConfirm: async () => {
					await notificationStore.deleteFeatureRequest(requestId);
				}
			},
			options: { size: 'sm' }
		});
	}

	function handleEdit(requestId: string) {
		const request = myRequests.find((r: any) => r.id === requestId);
		if (!request) return;

		modalStore.open({
			component: () => import('$lib/components/modals/RequestFeatureModal.svelte'),
			options: { size: 'md' },
			props: {
				editMode: true,
				existingRequest: request,
				onSuccess: () => {
					notificationStore.fetchMyFeatureRequests();
				}
			}
		});
	}
</script>

<div class="flex h-full flex-col">
	<div class="border-b border-gray-200 bg-white px-6 py-4">
		<div class="flex items-center justify-between">
			<div>
				<h3 class="text-lg font-semibold text-gray-900">Your Feature Requests</h3>
				<p class="mt-1 text-sm text-gray-600">{myRequests.length} total requests</p>
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
		{:else if myRequests.length === 0}
			<div class="flex flex-col items-center justify-center py-16">
				<Lightbulb class="h-16 w-16 text-gray-300" />
				<h3 class="mt-4 text-lg font-semibold text-gray-900">No requests yet</h3>
				<p class="mt-2 text-center text-sm text-gray-600">
					Submit your first feature request to get started!
				</p>
				<button
					onclick={handleNewRequest}
					class="mt-4 rounded-lg bg-[#ff4d00] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#ff4d00]/90"
				>
					Create Request
				</button>
			</div>
		{:else}
			<div class="space-y-3">
				{#each myRequests as request (request.id)}
					<FeatureRequestCard
						{request}
						showUpvote={false}
						showActions={request.status === FeatureRequestStatus.PENDING}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
