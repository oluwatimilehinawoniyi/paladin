<script lang="ts">
	import { Sparkles, MessageSquare, TrendingUp, Megaphone, Info, Check } from '@lucide/svelte';
	import { notificationStore } from '$lib/stores/notificationStore';
	import { formatRelativeTime, NotificationType } from '$lib/types/notification.types';
	import type { NotificationDTO } from '$lib/types/notification.types';

	let { notification } = $props<{ notification: NotificationDTO }>();

	const iconMap: Record<NotificationType, typeof Sparkles> = {
		[NotificationType.STATUS_UPDATE]: Sparkles,
		[NotificationType.ADMIN_RESPONSE]: MessageSquare,
		[NotificationType.SUBSCRIBED_UPDATE]: TrendingUp,
		[NotificationType.FEATURE_ANNOUNCEMENT]: Megaphone,
		[NotificationType.SYSTEM_ANNOUNCEMENT]: Info
	};

	const Icon = iconMap[notification.type as NotificationType];
	
	let isProcessing = $state(false);

	async function handleMarkAsRead() {
		if (notification.isRead || isProcessing) return;
		
		isProcessing = true;
		try {
			await notificationStore.markAsRead(notification.id);
		} catch (error) {
			console.error('Failed to mark notification as read:', error);
		} finally {
			setTimeout(() => {
				isProcessing = false;
			}, 300);
		}
	}

	function handleClick() {
		if (!isProcessing && !notification.isRead) {
			handleMarkAsRead();
		}
	}
</script>

<div
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
	role="button"
	tabindex="0"
	class="w-full cursor-pointer rounded-lg border p-4 text-left transition-all hover:shadow-md"
	class:bg-blue-50={!notification.isRead}
	class:border-blue-200={!notification.isRead}
	class:bg-white={notification.isRead}
	class:border-gray-200={notification.isRead}
>
	<div class="flex items-start gap-3">
		<div
			class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
			class:bg-blue-100={!notification.isRead}
			class:bg-gray-100={notification.isRead}
		>
			<Icon class="h-5 w-5 {notification.isRead ? 'text-gray-600' : 'text-blue-600'}" />
		</div>

		<div class="min-w-0 flex-1">
			<div class="flex items-start justify-between gap-2">
				<h4 class="font-semibold text-gray-900">{notification.title}</h4>
				{#if !notification.isRead}
					<span class="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
				{/if}
			</div>
			<p class="mt-1 text-sm text-gray-600">{notification.message}</p>
			<div class="mt-2 flex items-center gap-3">
				<span class="text-xs text-gray-500">{formatRelativeTime(notification.createdAt)}</span>
				{#if !notification.isRead}
					<button
						onclick={(e) => {
							e.stopPropagation();
							handleMarkAsRead();
						}}
						class="flex items-center gap-1 text-xs font-medium text-[#ff4d00] hover:text-[#ff4d00]/80"
					>
						<Check class="h-3 w-3" />
						Mark as read
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
