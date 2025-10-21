/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable, derived, get } from 'svelte/store';
import { apiService } from '$lib/api/apiService';
import { notificationPollingService } from '$lib/services/notificationPollingService';
import type {
	NotificationDTO,
	FeatureRequestDTO,
	RequestFilters,
	RequestSortOption,
	FeatureRequestCategory
} from '$lib/types/notification.types';

/**
 * Create notification store
 */
function createNotificationStore() {
	// Create writable stores for each piece of state
	const unreadCount = writable(0);
	const notifications = writable<NotificationDTO[]>([]);
	const notificationsPage = writable(0);
	const notificationsHasMore = writable(true);
	const allRequests = writable<FeatureRequestDTO[]>([]);
	const myRequests = writable<FeatureRequestDTO[]>([]);
	const requestFilters = writable<RequestFilters>({
		status: 'ALL' as const,
		category: 'ALL' as const,
		sortBy: 'most-voted' as RequestSortOption
	});
	const isLoadingNotifications = writable(false);
	const isLoadingRequests = writable(false);
	const isLoadingMyRequests = writable(false);
	const error = writable<string | null>(null);
	const lastBadgeFetch = writable<Date | null>(null);
	const lastNotificationsFetch = writable<Date | null>(null);
	const lastRequestsFetch = writable<Date | null>(null);

	// ============================================
	// DERIVED STATE (Using derived store)
	// ============================================

	const hasUnread = derived(unreadCount, ($unreadCount) => $unreadCount > 0);
	const badgeText = derived(unreadCount, ($unreadCount) =>
		$unreadCount > 99 ? '99+' : ($unreadCount ?? 0).toString()
	);

	// ============================================
	// BADGE METHODS (Tier 1)
	// ============================================

	/**
	 * Fetch unread count (called by polling service)
	 */
	async function fetchUnreadCount(): Promise<void> {
		try {
			const response = await apiService.getUnreadNotificationCount();
			unreadCount.set(response.data.count);
			lastBadgeFetch.set(new Date());
		} catch (err: any) {
			console.error('[Store] Failed to fetch unread count:', err);
			error.set(err.message || 'Failed to fetch unread count');
		}
	}

	/**
	 * Update badge count from polling service
	 */
	function updateBadgeCount(count: number): void {
		unreadCount.set(count);
	}

	/**
	 * Fetch notifications (first page or refresh)
	 */
	async function fetchNotifications(refresh: boolean = false): Promise<void> {
		if (get(isLoadingNotifications)) return;

		isLoadingNotifications.set(true);
		error.set(null);

		try {
			const page = refresh ? 0 : get(notificationsPage);
			const response = await apiService.getNotifications(page, 20);

			if (refresh) {
				notifications.set(response.data.content);
				notificationsPage.set(0);
			} else {
				const currentNotifications = get(notifications);
				notifications.set([...currentNotifications, ...response.data.content]);
			}

			notificationsHasMore.set(!response.data.last);
			lastNotificationsFetch.set(new Date());
		} catch (err: any) {
			console.error('[Store] Failed to fetch notifications:', err);
			error.set(err.message || 'Failed to fetch notifications');
		} finally {
			isLoadingNotifications.set(false);
		}
	}

	/**
	 * Load more notifications (pagination)
	 */
	async function loadMoreNotifications(): Promise<void> {
		if (!get(notificationsHasMore) || get(isLoadingNotifications)) return;

		notificationsPage.update((page) => page + 1);
		await fetchNotifications(false);
	}

	/**
	 * Update notification list from polling service
	 */
	function updateNotificationList(newNotifications: NotificationDTO[]): void {
		notifications.set(newNotifications);
		lastNotificationsFetch.set(new Date());
	}

	/**
	 * Mark single notification as read (optimistic update)
	 */
	async function markAsRead(notificationId: string): Promise<void> {
		// Find the notification
		const currentNotifications = get(notifications);
		const notification = currentNotifications.find((n) => n.id === notificationId);
		if (!notification || notification.isRead) return;

		// Optimistic update
		const wasUnread = !notification.isRead;
		notification.isRead = true;
		if (wasUnread && get(unreadCount) > 0) {
			unreadCount.update((count) => count - 1);
		}

		try {
			await apiService.markNotificationAsRead(notificationId);
			// Success - optimistic update already applied
		} catch (err: any) {
			console.error('[Store] Failed to mark as read:', err);
			// Rollback on error
			notification.isRead = false;
			if (wasUnread) {
				unreadCount.update((count) => count + 1);
			}
			error.set(err.message || 'Failed to mark notification as read');
		}
	}

	/**
	 * Mark all notifications as read
	 */
	async function markAllAsRead(): Promise<void> {
		if (get(isLoadingNotifications)) return;

		// Store original state for rollback
		const originalNotifications = get(notifications).map((n) => ({ ...n }));
		const originalCount = get(unreadCount);

		// Optimistic update
		notifications.update((currentNotifications) =>
			currentNotifications.map((n) => ({ ...n, isRead: true }))
		);
		unreadCount.set(0);

		try {
			await apiService.markAllNotificationsAsRead();
			// Success - optimistic update already applied
		} catch (err: any) {
			console.error('[Store] Failed to mark all as read:', err);
			// Rollback on error
			notifications.set(originalNotifications);
			unreadCount.set(originalCount);
			error.set(err.message || 'Failed to mark all as read');
		}
	}

	/**
	 * Fetch all feature requests (community view)
	 */
	async function fetchFeatureRequests(): Promise<void> {
		if (get(isLoadingRequests)) return;

		isLoadingRequests.set(true);
		error.set(null);

		try {
			const response = await apiService.getFeatureRequests();
			allRequests.set(
				(response.data || []).map((r: any) => ({
					...r,
					category: r.category as FeatureRequestCategory
				}))
			);
			lastRequestsFetch.set(new Date());
		} catch (err: any) {
			console.error('[Store] Failed to fetch feature requests:', err);
			error.set(err.message || 'Failed to fetch feature requests');
		} finally {
			isLoadingRequests.set(false);
		}
	}

	/**
	 * Fetch user's own feature requests
	 */
	async function fetchMyFeatureRequests(): Promise<void> {
		if (get(isLoadingMyRequests)) return;

		isLoadingMyRequests.set(true);
		error.set(null);

		try {
			const response = await apiService.getMyFeatureRequests();
			myRequests.set(
				(response.data || []).map((r: any) => ({
					...r,
					category: r.category as FeatureRequestCategory
				}))
			);
		} catch (err: any) {
			console.error('[Store] Failed to fetch my requests:', err);
			error.set(err.message || 'Failed to fetch your requests');
		} finally {
			isLoadingMyRequests.set(false);
		}
	}

	/**
	 * Upvote a feature request (optimistic update)
	 */
	async function upvoteRequest(requestId: string): Promise<void> {
		// Find request in both lists
		const currentAllRequests = get(allRequests);
		const currentMyRequests = get(myRequests);
		const allRequest = currentAllRequests.find((r) => r.id === requestId);
		const myRequest = currentMyRequests.find((r) => r.id === requestId);

		if (!allRequest && !myRequest) return;

		// Optimistic update
		if (allRequest) {
			allRequest.hasVoted = true;
			allRequest.voteCount += 1;
		}
		if (myRequest) {
			myRequest.voteCount += 1;
		}

		try {
			const response = await apiService.upvoteFeatureRequest(requestId);
			// Update with actual count from server
			if (allRequest) allRequest.voteCount = response.totalVotes;
			if (myRequest) myRequest.voteCount = response.totalVotes;
		} catch (err: any) {
			console.error('[Store] Failed to upvote:', err);
			// Rollback on error
			if (allRequest) {
				allRequest.hasVoted = false;
				allRequest.voteCount -= 1;
			}
			if (myRequest) {
				myRequest.voteCount -= 1;
			}
			error.set(err.message || 'Failed to upvote request');
		}
	}

	/**
	 * Remove upvote from a feature request (optimistic update)
	 */
	async function removeUpvote(requestId: string): Promise<void> {
		// Find request in both lists
		const currentAllRequests = get(allRequests);
		const currentMyRequests = get(myRequests);
		const allRequest = currentAllRequests.find((r) => r.id === requestId);
		const myRequest = currentMyRequests.find((r) => r.id === requestId);

		if (!allRequest && !myRequest) return;

		// Optimistic update
		if (allRequest) {
			allRequest.hasVoted = false;
			allRequest.voteCount = Math.max(0, allRequest.voteCount - 1);
		}
		if (myRequest) {
			myRequest.voteCount = Math.max(0, myRequest.voteCount - 1);
		}

		try {
			const response = await apiService.removeUpvote(requestId);
			// Update with actual count from server
			if (allRequest) allRequest.voteCount = response.totalVotes;
			if (myRequest) myRequest.voteCount = response.totalVotes;
		} catch (err: any) {
			console.error('[Store] Failed to remove upvote:', err);
			// Rollback on error
			if (allRequest) {
				allRequest.hasVoted = true;
				allRequest.voteCount += 1;
			}
			if (myRequest) {
				myRequest.voteCount += 1;
			}
			error.set(err.message || 'Failed to remove upvote');
		}
	}

	/**
	 * Delete a feature request
	 */
	async function deleteFeatureRequest(requestId: string): Promise<void> {
		try {
			await apiService.deleteFeatureRequest(requestId);
			// Remove from both lists
			allRequests.update((requests) => requests.filter((r) => r.id !== requestId));
			myRequests.update((requests) => requests.filter((r) => r.id !== requestId));
		} catch (err: any) {
			console.error('[Store] Failed to delete request:', err);
			error.set(err.message || 'Failed to delete request');
			throw err; // Re-throw so caller can handle
		}
	}

	/**
	 * Update request filters
	 */
	function setRequestFilters(filters: Partial<RequestFilters>): void {
		requestFilters.update((currentFilters) => ({ ...currentFilters, ...filters }));
	}

	/**
	 * Initialize store and connect to polling service
	 */
	function init(): void {
		// Listen to badge updates from polling service
		notificationPollingService.on('badge-update', ({ count }) => {
			updateBadgeCount(count);
		});

		// Listen to list updates from polling service
		notificationPollingService.on('list-update', ({ notifications }) => {
			updateNotificationList(notifications);
		});

		// Listen to errors
		notificationPollingService.on('error', ({ type, error }) => {
			console.error(`[Store] Polling error (${type}):`, error);
			// Silent retry is happening in the background
		});

		// Start badge polling
		notificationPollingService.startBadgePolling();
	}

	/**
	 * Cleanup store
	 * Call this on logout or app unmount
	 */
	function destroy(): void {
		notificationPollingService.stopBadgePolling();
		notificationPollingService.stopListPolling();

		// Reset state
		unreadCount.set(0);
		notifications.set([]);
		notificationsPage.set(0);
		notificationsHasMore.set(true);
		allRequests.set([]);
		myRequests.set([]);
		requestFilters.set({
			status: 'ALL' as const,
			category: 'ALL' as const,
			sortBy: 'most-voted' as RequestSortOption
		});
		isLoadingNotifications.set(false);
		isLoadingRequests.set(false);
		isLoadingMyRequests.set(false);
		error.set(null);
		lastBadgeFetch.set(null);
		lastNotificationsFetch.set(null);
		lastRequestsFetch.set(null);
	}

	function clearError(): void {
		error.set(null);
	}

	return {
		// State access (read-only stores)
		unreadCount,
		notifications,
		notificationsPage,
		notificationsHasMore,
		allRequests,
		myRequests,
		requestFilters,
		isLoadingNotifications,
		isLoadingRequests,
		isLoadingMyRequests,
		error,
		lastBadgeFetch,
		lastNotificationsFetch,
		lastRequestsFetch,

		// Derived state
		hasUnread,
		badgeText,

		// Badge methods
		fetchUnreadCount,

		// Notification methods
		fetchNotifications,
		loadMoreNotifications,
		markAsRead,
		markAllAsRead,

		// Feature request methods
		fetchFeatureRequests,
		fetchMyFeatureRequests,
		upvoteRequest,
		removeUpvote,
		deleteFeatureRequest,
		setRequestFilters,

		// Lifecycle
		init,
		destroy,
		clearError
	};
}

export const notificationStore = createNotificationStore();

export type NotificationStore = ReturnType<typeof createNotificationStore>;
