<script lang="ts">
	import Button from '../ui/Button.svelte';
	import { Check, X, AlertTriangle } from '@lucide/svelte';
	
	let { title, message, onConfirm, closeModal, type = 'warning' } = $props();

	function handleConfirm() {
		onConfirm?.();
		closeModal();
	}

	const iconMap = {
		warning: AlertTriangle,
		danger: X,
		info: Check
	};

	const colorMap = {
		warning: 'text-yellow-600 bg-yellow-100',
		danger: 'text-red-600 bg-red-100',
		info: 'text-blue-600 bg-blue-100'
	};

	const Icon = iconMap[type as keyof typeof iconMap] ?? AlertTriangle;
	const colors = colorMap[type as keyof typeof colorMap] ?? colorMap.warning;
</script>

<div class="space-y-6">
	<div class="flex items-start gap-4">
		<div class="flex h-12 w-12 items-center justify-center rounded-full {colors}">
			<Icon class="h-6 w-6" />
		</div>
		<div class="flex-1">
			<h2 class="text-lg font-semibold">{title}</h2>
			<p class="text-gray-600 mt-1">{message}</p>
		</div>
	</div>

	<div class="flex gap-3 pt-4">
		<Button 
			name="confirm" 
			icon={Check} 
			onClick={handleConfirm}
		/>
		<button
			onclick={closeModal}
			class="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
		>
			<X class="h-4 w-4" />
			Cancel
		</button>
	</div>
</div>