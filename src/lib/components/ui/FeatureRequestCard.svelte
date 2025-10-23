<script lang="ts">
	import { Flame, Edit2, Trash2, MessageSquare } from '@lucide/svelte';
	import { formatRelativeTime, STATUS_COLORS } from '$lib/types/notification.types';
	import type { FeatureRequestDTO, FeatureRequestStatus } from '$lib/types/notification.types';

	let {
		request,
		showUpvote = false,
		showActions = false,
		onUpvote = undefined,
		onEdit = undefined,
		onDelete = undefined
	} = $props<{
		request: FeatureRequestDTO;
		showUpvote?: boolean;
		showActions?: boolean;
		onUpvote?: (id: string, hasVoted: boolean) => void;
		onEdit?: (id: string) => void;
		onDelete?: (id: string) => void;
	}>();

	let isExpanded = $state(false);
	const statusColors = STATUS_COLORS[request.status as FeatureRequestStatus];

	function toggleExpand() {
		isExpanded = !isExpanded;
	}

	function handleUpvoteClick(e: Event) {
		e.stopPropagation();
		if (onUpvote) {
			onUpvote(request.id, request.hasVoted);
		}
	}

	function handleEditClick(e: Event) {
		e.stopPropagation();
		if (onEdit) {
			onEdit(request.id);
		}
	}

	function handleDeleteClick(e: Event) {
		e.stopPropagation();
		if (onDelete) {
			onDelete(request.id);
		}
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
	<div
		onclick={toggleExpand}
		onkeydown={(e) => e.key === 'Enter' && toggleExpand()}
		class="w-full cursor-pointer p-4 text-left"
		role="button"
		tabindex="0"
		aria-expanded={isExpanded}
	>
		<div class="flex items-start gap-3">
			{#if showUpvote}
				<button
					onclick={handleUpvoteClick}
					onkeydown={(e) => e.key === 'Enter' && handleUpvoteClick(e)}
					class="flex cursor-pointer flex-col items-center gap-1 rounded-lg px-2 py-1 transition-colors"
					class:bg-orange-100={request.hasVoted}
					class:text-[#ff4d00]={request.hasVoted}
					class:bg-gray-100={!request.hasVoted}
					class:text-gray-600={!request.hasVoted}
					class:hover:bg-orange-200={request.hasVoted}
					class:hover:bg-gray-200={!request.hasVoted}
				>
					<Flame class="h-5 w-5" />
					<span class="text-xs font-semibold">{request.voteCount}</span>
				</button>
			{:else}
				<div
					class="flex flex-col items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-gray-600"
				>
					<Flame class="h-5 w-5" />
					<span class="text-xs font-semibold">{request.voteCount}</span>
				</div>
			{/if}

			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-2">
					<h4 class="font-semibold text-gray-900">{request.title}</h4>
					{#if request.adminResponse}
						<span
							class="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700"
						>
							<MessageSquare class="size-2.5" />
							Recieved a Response
						</span>
					{/if}
				</div>
				<p
					class="mt-1 text-sm text-gray-600"
					class:line-clamp-2={!isExpanded}
					class:whitespace-pre-wrap={isExpanded}
				>
					{request.description}
				</p>

				<div class="mt-3 flex flex-wrap items-center gap-2">
					<div class="text-xs">
						<p class="inline">status:</p>
						<p
							class="inline-flex items-center rounded-full border px-2.5 py-0.5 font-medium {statusColors.bg} {statusColors.text} {statusColors.border}"
						>
							{request.statusDisplayName}
						</p>
					</div>

					<div class="text-xs">
						<p class="inline">category:</p>
						<p
							class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-gray-700"
						>
							{request.categoryDisplayName}
						</p>
					</div>
					<p class="text-xs text-gray-500">{formatRelativeTime(request.createdAt)}</p>
				</div>

				{#if request.adminResponse && isExpanded}
					<div class="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
						<div class="flex items-start gap-2">
							<MessageSquare class="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
							<div class="flex-1">
								<p class="text-xs font-semibold text-blue-900">Admin Response</p>
								<p class="mt-1 text-sm text-blue-800">{request.adminResponse}</p>
							</div>
						</div>
					</div>
				{/if}

				{#if showActions}
					<div class="mt-3 flex items-center gap-2">
						<button
							onclick={handleDeleteClick}
							onkeydown={(e) => e.key === 'Enter' && handleDeleteClick(e)}
							class="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
						>
							<Edit2 class="h-3.5 w-3.5" />
							Edit
						</button>
						<div
							onclick={handleDeleteClick}
							onkeydown={(e) => e.key === 'Enter' && handleDeleteClick(e)}
							class="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
							role="button"
							tabindex="0"
						>
							<Trash2 class="h-3.5 w-3.5" />
							Delete
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
