<script lang="ts">
	import { notificationStore } from '$lib/stores/notificationStore';
	import { modalStore } from '$lib/stores/modalStore';
	import { scale } from 'svelte/transition';
	import { Bell } from '@lucide/svelte';

	const {
		unreadCount: unreadCountStore,
		hasUnread: hasUnreadStore,
		badgeText: badgeTextStore
	} = notificationStore;
	let unreadCount = $derived($unreadCountStore);
	let hasUnread = $derived($hasUnreadStore);
	let badgeText = $derived($badgeTextStore);

	let previousCount = $state(0);
	let shouldAnimate = $state(false);

	$effect(() => {
		if (unreadCount > previousCount && previousCount > 0) {
			shouldAnimate = true;
			setTimeout(() => {
				shouldAnimate = false;
			}, 600);
		}
		previousCount = unreadCount;
	});

	function handleClick() {
		modalStore.open({
			component: () => import('$lib/components/ui/PaladinHub.svelte'),
			options: {
				size: 'xl',
				closeOnBackdrop: true,
				closeOnEscape: true
			}
		});
	}
</script>

<button
	onclick={handleClick}
	class="relative cursor-pointer rounded-md bg-gray-200 p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#ff4d00]"
	aria-label="Notifications"
>
	<Bell class="size-3.5" />

	{#if hasUnread}
		<span
			transition:scale={{ duration: 200 }}
			class="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff4d00] px-1 text-xs font-semibold text-white"
			class:animate-bounce={shouldAnimate}
		>
			{badgeText}
		</span>
	{/if}
</button>

<style>
	.animate-bounce {
		animation: bounce 0.6s ease-in-out;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: scale(1);
		}
		25% {
			transform: scale(1.2);
		}
		50% {
			transform: scale(0.9);
		}
		75% {
			transform: scale(1.1);
		}
	}
</style>
