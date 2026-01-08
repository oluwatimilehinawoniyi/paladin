<script lang="ts">
	import { onMount } from 'svelte';
	import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from '@lucide/svelte';
	import { toastStore, type Toast, type ToastType } from '$lib/stores/toastStore';
	import { fly } from 'svelte/transition';

	const { toast } = $props<{ toast: Toast }>();

	function remove() {
		toastStore.remove(toast.id);
	}

	const icons: Record<ToastType, any> = {
		success: CheckCircle,
		error: AlertCircle,
		info: Info,
		warning: AlertTriangle
	};

	const colors: Record<ToastType, string> = {
		success: 'bg-green-50 text-green-800 border-green-200',
		error: 'bg-red-50 text-red-800 border-red-200',
		info: 'bg-blue-50 text-blue-800 border-blue-200',
		warning: 'bg-yellow-50 text-yellow-800 border-yellow-200'
	};

	const iconColors: Record<ToastType, string> = {
		success: 'text-green-500',
		error: 'text-red-500',
		info: 'text-blue-500',
		warning: 'text-yellow-500'
	};

	const Icon = icons[toast.type as ToastType];
	const containerClass = colors[toast.type as ToastType];
	const iconClass = iconColors[toast.type as ToastType];
</script>

<div
	role="alert"
	class="flex w-full items-start gap-3 rounded-lg border p-4 shadow-sm md:w-[400px] {containerClass}"
	transition:fly={{ x: 300, duration: 300 }}
>
	<Icon class="mt-0.5 h-5 w-5 flex-shrink-0 {iconClass}" />
	<div class="flex-1">
		<p class="text-sm font-medium">{toast.message}</p>
	</div>
	<button
		onclick={remove}
		class="ml-auto inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/5"
	>
		<X class="h-4 w-4 opacity-50" />
		<span class="sr-only">Close</span>
	</button>
</div>
