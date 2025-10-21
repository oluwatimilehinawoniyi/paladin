
/**
 * Notification Type Enum
 */
export enum NotificationType {
	STATUS_UPDATE = 'STATUS_UPDATE',
	ADMIN_RESPONSE = 'ADMIN_RESPONSE',
	SUBSCRIBED_UPDATE = 'SUBSCRIBED_UPDATE',
	FEATURE_ANNOUNCEMENT = 'FEATURE_ANNOUNCEMENT',
	SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT'
}

/**
 * Feature Request Status Enum
 */
export enum FeatureRequestStatus {
	PENDING = 'PENDING',
	UNDER_REVIEW = 'UNDER_REVIEW',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED',
	REJECTED = 'REJECTED'
}

/**
 * Feature Request Category Enum
 */
export enum FeatureRequestCategory {
	AI_FEATURES = 'AI_FEATURES',
	EMAIL_AUTOMATION = 'EMAIL_AUTOMATION',
	UI_UX = 'UI_UX',
	JOB_TRACKING = 'JOB_TRACKING',
	CV_MANAGEMENT = 'CV_MANAGEMENT',
	INTEGRATIONS = 'INTEGRATIONS',
	ANALYTICS = 'ANALYTICS',
	PERFORMANCE = 'PERFORMANCE',
	MOBILE = 'MOBILE',
	OTHER = 'OTHER'
}

/**
 * Related Entity Type
 */
export enum RelatedEntityType {
	FEATURE_REQUEST = 'FEATURE_REQUEST',
	SYSTEM = 'SYSTEM'
}

/**
 * Notification DTO
 */
export interface NotificationDTO {
	id: string;
	type: NotificationType;
	title: string;
	message: string;
	relatedEntityId: string | null;
	relatedEntityType: RelatedEntityType | null;
	isRead: boolean;
	createdAt: string;
}

/**
 * Feature Request
 */
export interface FeatureRequestDTO {
	id: string;
	userId: string;
	userEmail: string;
	title: string;
	description: string;
	category: FeatureRequestCategory;
	categoryDisplayName: string;
	status: FeatureRequestStatus;
	statusDisplayName: string;
	adminResponse: string | null;
	voteCount: number;
	hasVoted: boolean;
	createdAt: string;
	updatedAt: string;
}

/**
 * Paginated Response Wrapper
 */
export interface PaginatedResponse<T> {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	last: boolean;
}

// ============================================
// UI-SPECIFIC TYPES
// ============================================

/**
 * Tab types for Paladin Hub Modal
 */
export type PaladinHubTab = 'inbox' | 'requests' | 'my-requests';

/**
 * Sort options for feature requests
 */
export type RequestSortOption = 'most-voted' | 'newest' | 'oldest';

/**
 * Filter options for feature requests
 */
export interface RequestFilters {
	status: FeatureRequestStatus | 'ALL';
	category: FeatureRequestCategory | 'ALL';
	sortBy: RequestSortOption;
}

/**
 * Grouped notifications by date
 */
export interface GroupedNotifications {
	today: NotificationDTO[];
	yesterday: NotificationDTO[];
	thisWeek: NotificationDTO[];
	older: NotificationDTO[];
}

// ============================================
// DISPLAY HELPERS
// ============================================

/**
 * Status badge color mapping
 */
export const STATUS_COLORS: Record<
	FeatureRequestStatus,
	{ bg: string; text: string; border: string }
> = {
	[FeatureRequestStatus.PENDING]: {
		bg: 'bg-yellow-100',
		text: 'text-yellow-800',
		border: 'border-yellow-200'
	},
	[FeatureRequestStatus.UNDER_REVIEW]: {
		bg: 'bg-purple-100',
		text: 'text-purple-800',
		border: 'border-purple-200'
	},
	[FeatureRequestStatus.IN_PROGRESS]: {
		bg: 'bg-blue-100',
		text: 'text-blue-800',
		border: 'border-blue-200'
	},
	[FeatureRequestStatus.COMPLETED]: {
		bg: 'bg-green-100',
		text: 'text-green-800',
		border: 'border-green-200'
	},
	[FeatureRequestStatus.REJECTED]: {
		bg: 'bg-red-100',
		text: 'text-red-800',
		border: 'border-red-200'
	}
};

/**
 * Category display names
 */
export const CATEGORY_LABELS: Record<FeatureRequestCategory, string> = {
	[FeatureRequestCategory.AI_FEATURES]: 'AI & Analysis',
	[FeatureRequestCategory.EMAIL_AUTOMATION]: 'Email & Communication',
	[FeatureRequestCategory.UI_UX]: 'User Interface',
	[FeatureRequestCategory.JOB_TRACKING]: 'Job Tracking',
	[FeatureRequestCategory.CV_MANAGEMENT]: 'CV Management',
	[FeatureRequestCategory.INTEGRATIONS]: 'Integrations',
	[FeatureRequestCategory.ANALYTICS]: 'Analytics & Reports',
	[FeatureRequestCategory.PERFORMANCE]: 'Performance',
	[FeatureRequestCategory.MOBILE]: 'Mobile App',
	[FeatureRequestCategory.OTHER]: 'Other'
};

/**
 * Notification type icon mapping
 * Uses lucide-svelte icon names
 */
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
	[NotificationType.STATUS_UPDATE]: 'Sparkles',
	[NotificationType.ADMIN_RESPONSE]: 'MessageSquare',
	[NotificationType.SUBSCRIBED_UPDATE]: 'TrendingUp',
	[NotificationType.FEATURE_ANNOUNCEMENT]: 'Megaphone',
	[NotificationType.SYSTEM_ANNOUNCEMENT]: 'Info'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format relative time (e.g., "2 hours ago", "just now")
 */
export function formatRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return 'just now';
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
	}

	const diffInWeeks = Math.floor(diffInDays / 7);
	if (diffInWeeks < 4) {
		return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
	}

	const diffInMonths = Math.floor(diffInDays / 30);
	if (diffInMonths < 12) {
		return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
	}

	const diffInYears = Math.floor(diffInDays / 365);
	return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
}

/**
 * Group notifications by date categories
 */
export function groupNotificationsByDate(notifications: NotificationDTO[]): GroupedNotifications {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const thisWeekStart = new Date(today);
	thisWeekStart.setDate(thisWeekStart.getDate() - 7);

	const grouped: GroupedNotifications = {
		today: [],
		yesterday: [],
		thisWeek: [],
		older: []
	};

	notifications.forEach((notification) => {
		const notifDate = new Date(notification.createdAt);
		const notifDateOnly = new Date(
			notifDate.getFullYear(),
			notifDate.getMonth(),
			notifDate.getDate()
		);

		if (notifDateOnly.getTime() === today.getTime()) {
			grouped.today.push(notification);
		} else if (notifDateOnly.getTime() === yesterday.getTime()) {
			grouped.yesterday.push(notification);
		} else if (notifDateOnly >= thisWeekStart) {
			grouped.thisWeek.push(notification);
		} else {
			grouped.older.push(notification);
		}
	});

	return grouped;
}

/**
 * Sort feature requests based on option
 */
export function sortFeatureRequests(
	requests: FeatureRequestDTO[],
	sortBy: RequestSortOption
): FeatureRequestDTO[] {
	const sorted = [...requests];

	switch (sortBy) {
		case 'most-voted':
			return sorted.sort((a, b) => b.voteCount - a.voteCount);
		case 'newest':
			return sorted.sort(
				(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
		case 'oldest':
			return sorted.sort(
				(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			);
		default:
			return sorted;
	}
}

/**
 * Filter feature requests
 */
export function filterFeatureRequests(
	requests: FeatureRequestDTO[],
	filters: RequestFilters
): FeatureRequestDTO[] {
	let filtered = [...requests];

	// Filter by status
	if (filters.status !== 'ALL') {
		filtered = filtered.filter((req) => req.status === filters.status);
	}

	// Filter by category
	if (filters.category !== 'ALL') {
		filtered = filtered.filter((req) => req.category === filters.category);
	}

	// Sort
	filtered = sortFeatureRequests(filtered, filters.sortBy);

	return filtered;
}
