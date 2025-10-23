<script lang="ts">
	import { CheckCheck, Loader2, InboxIcon } from '@lucide/svelte';
	import { notificationStore } from '$lib/stores/notificationStore';
	import { groupNotificationsByDate } from '$lib/types/notification.types';
	import NotificationItem from './NotificationItem.svelte';

	const {
		notifications: notificationsStore,
		isLoadingNotifications: isLoadingStore,
		notificationsHasMore: hasMoreStore
	} = notificationStore;
	let notifications = $derived($notificationsStore);
	let isLoading = $derived($isLoadingStore);
	let hasMore = $derived($hasMoreStore);
	let hasUnread = $derived(notifications.some((n: any) => !n.isRead));

	let grouped = $derived(groupNotificationsByDate(notifications));

	async function handleMarkAllRead() {
		await notificationStore.markAllAsRead();
	}

	async function handleLoadMore() {
		await notificationStore.loadMoreNotifications();
	}
</script>

<div class="flex h-full flex-col">
	{#if hasUnread}
		<div class="border-b border-gray-200 bg-white px-6 py-3">
			<button
				onclick={handleMarkAllRead}
				class="flex items-center gap-2 text-sm font-medium text-[#ff4d00] transition-colors hover:text-[#ff4d00]/80"
			>
				<CheckCheck class="h-4 w-4" />
				Mark all as read
			</button>
		</div>
	{/if}

	<div class="flex-1 overflow-y-auto">
		{#if notifications.length === 0 && !isLoading}
			<div class="flex flex-col items-center justify-center px-6 py-16">
				<InboxIcon class="h-16 w-16 text-gray-300" />
				<h3 class="mt-4 text-lg font-semibold text-gray-900">All caught up!</h3>
				<p class="mt-2 text-center text-sm text-gray-600">
					You have no notifications at the moment.
				</p>
			</div>
		{:else}
			{#each [
				{ key: 'today', title: 'Today', notifications: grouped.today },
				{ key: 'yesterday', title: 'Yesterday', notifications: grouped.yesterday },
				{ key: 'thisWeek', title: 'This Week', notifications: grouped.thisWeek },
				{ key: 'older', title: 'Older', notifications: grouped.older }
			] as section}
				{#if section.notifications.length > 0}
					<div class="px-6 py-4">
						<h3 class="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">
							{section.title}
						</h3>
						<div class="space-y-2">
							{#each section.notifications as notification (notification.id)}
								<NotificationItem {notification} />
							{/each}
						</div>
					</div>
				{/if}
			{/each}

			{#if hasMore}
				<div class="px-6 py-4">
					<button
						onclick={handleLoadMore}
						disabled={isLoading}
						class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isLoading}
							<Loader2 class="mx-auto h-4 w-4 animate-spin" />
						{:else}
							Load More
						{/if}
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>
