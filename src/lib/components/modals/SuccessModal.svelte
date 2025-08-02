<script lang="ts">
	import Button from '../ui/Button.svelte';
	import { Check } from '@lucide/svelte';
	
	let { title, message, closeModal } = $props();

	function handleClose() {
		closeModal();
	}
</script>

<div class="space-y-6 text-center">
	<div class="flex flex-col items-center gap-4">
		<div class="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
			<Check class="h-8 w-8 text-green-600" />
		</div>
		<div>
			<h2 class="text-xl font-semibold">{title}</h2>
			<p class="text-gray-600 mt-2">{message}</p>
		</div>
	</div>

	<Button 
		name="close" 
		onClick={handleClose}
		classes="mx-auto"
	/>
</div>