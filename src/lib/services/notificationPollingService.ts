/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiService } from '$lib/api/apiService';
import { browser } from '$app/environment';

/**
 * Polling intervals (in milliseconds)
 */
const INTERVALS = {
	BADGE_ACTIVE: 30000, // 30 seconds when tab is active
	BADGE_HIDDEN: 120000, // 2 minutes when tab is hidden
	LIST: 30000 // 30 seconds when modal is open
} as const;

/**
 * Event types for polling service
 */
type PollingEvent = 'badge-update' | 'list-update' | 'error';

/**
 * Event listener callback type
 */
type EventCallback = (data: any) => void;

/**
 * Notification Polling Service
 */
class NotificationPollingService {
	// Polling intervals
	private badgeInterval: number | null = null;
	private listInterval: number | null = null;

	// State flags
	private isBadgePolling = false;
	private isListPolling = false;
	private isTabHidden = false;

	// Event listeners
	private listeners: Map<PollingEvent, Set<EventCallback>> = new Map([
		['badge-update', new Set()],
		['list-update', new Set()],
		['error', new Set()]
	]);

	// Abort controllers for cancelling in-flight requests
	private badgeAbortController: AbortController | null = null;
	private listAbortController: AbortController | null = null;

	constructor() {
		if (browser) {
			this.setupVisibilityListener();
		}
	}

	/**
	 * Start badge polling (Tier 1)
	 * This should run from login to logout
	 */
	startBadgePolling(): void {
		if (!browser || this.isBadgePolling) return;

		this.isBadgePolling = true;

		// Poll immediately on start
		this.pollBadgeCount();

		// Start interval based on tab visibility
		const interval = this.isTabHidden ? INTERVALS.BADGE_HIDDEN : INTERVALS.BADGE_ACTIVE;
		this.badgeInterval = window.setInterval(() => {
			this.pollBadgeCount();
		}, interval);
	}

	/**
	 * Stop badge polling (Tier 1)
	 * Call this on logout
	 */
	stopBadgePolling(): void {
		if (!browser || !this.isBadgePolling) return;

		this.isBadgePolling = false;

		if (this.badgeInterval !== null) {
			clearInterval(this.badgeInterval);
			this.badgeInterval = null;
		}

		// Cancel in-flight request
		if (this.badgeAbortController) {
			this.badgeAbortController.abort();
			this.badgeAbortController = null;
		}
	}

	/**
	 * Start list polling (Tier 2)
	 * Call this when modal opens
	 */
	startListPolling(): void {
		if (!browser || this.isListPolling) return;

		this.isListPolling = true;

		// Poll immediately on start
		this.pollNotificationList();

		// Start interval
		this.listInterval = window.setInterval(() => {
			this.pollNotificationList();
		}, INTERVALS.LIST);
	}

	/**
	 * Stop list polling (Tier 2)
	 * Call this when modal closes
	 */
	stopListPolling(): void {
		if (!browser || !this.isListPolling) return;

		this.isListPolling = false;

		if (this.listInterval !== null) {
			clearInterval(this.listInterval);
			this.listInterval = null;
		}

		// Cancel in-flight request
		if (this.listAbortController) {
			this.listAbortController.abort();
			this.listAbortController = null;
		}
	}

	/**
	 * Subscribe to polling events
	 */
	on(event: PollingEvent, callback: EventCallback): () => void {
		const listeners = this.listeners.get(event);
		if (listeners) {
			listeners.add(callback);
		}

		// Return unsubscribe function
		return () => {
			const listeners = this.listeners.get(event);
			if (listeners) {
				listeners.delete(callback);
			}
		};
	}

	/**
	 * Get current polling state (for debugging)
	 */
	getState() {
		return {
			isBadgePolling: this.isBadgePolling,
			isListPolling: this.isListPolling,
			isTabHidden: this.isTabHidden,
			intervals: {
				badge: this.isTabHidden ? INTERVALS.BADGE_HIDDEN : INTERVALS.BADGE_ACTIVE,
				list: INTERVALS.LIST
			}
		};
	}

	/**
	 * Manually trigger a badge poll
	 */
	triggerBadgePoll(): void {
		if (browser && this.isBadgePolling) {
			this.pollBadgeCount();
		}
	}

	/**
	 * Manually trigger a list poll
	 */
	triggerListPoll(): void {
		if (browser && this.isListPolling) {
			this.pollNotificationList();
		}
	}

	/**
	 * Poll badge count (Tier 1)
	 */
	private async pollBadgeCount(): Promise<void> {
		try {
			// Cancel previous request if still in flight
			if (this.badgeAbortController) {
				this.badgeAbortController.abort();
			}
			this.badgeAbortController = new AbortController();

			const response = await apiService.getUnreadNotificationCount();
			const count = response.data.unreadCount;

			// Emit event to listeners
			this.emit('badge-update', { count });
		} catch (error: any) {
			if (error.name === 'AbortError') return;

			console.error('[Polling] Badge count error:', error);
			this.emit('error', { type: 'badge', error });
		}
	}

	/**
	 * Poll notification list (Tier 2)
	 */
	private async pollNotificationList(): Promise<void> {
		try {
			// Cancel previous request if still in flight
			if (this.listAbortController) {
				this.listAbortController.abort();
			}
			this.listAbortController = new AbortController();

			const response = await apiService.getNotifications(0, 20);
			const notifications = response.data.content;

			// Emit event to listeners
			this.emit('list-update', { notifications });
		} catch (error: any) {
			// Ignore abort errors
			if (error.name === 'AbortError') return;

			console.error('[Polling] List error:', error);
			this.emit('error', { type: 'list', error });
		}
	}

	/**
	 * Emit event to all listeners
	 */
	private emit(event: PollingEvent, data: any): void {
		const listeners = this.listeners.get(event);
		if (listeners) {
			listeners.forEach((callback) => callback(data));
		}
	}

	/**
	 * Setup document visibility change listener
	 * Adapts badge polling interval based on tab visibility
	 */
	private setupVisibilityListener(): void {
		document.addEventListener('visibilitychange', () => {
			const wasHidden = this.isTabHidden;
			this.isTabHidden = document.hidden;

			// Tab visibility changed
			if (wasHidden !== this.isTabHidden) {
				console.log(`[Polling] Tab visibility changed: ${this.isTabHidden ? 'HIDDEN' : 'ACTIVE'}`);

				// Restart badge polling with new interval if it's running
				if (this.isBadgePolling) {
					this.stopBadgePolling();
					this.startBadgePolling();

					// If tab just became active, poll immediately
					if (!this.isTabHidden) {
						this.pollBadgeCount();
					}
				}
			}
		});
	}

	/**
	 * Cleanup method - call on app unmount
	 */
	destroy(): void {
		console.log('[Polling] Destroying polling service');
		this.stopBadgePolling();
		this.stopListPolling();
		this.listeners.clear();
	}
}

export const notificationPollingService = new NotificationPollingService();
