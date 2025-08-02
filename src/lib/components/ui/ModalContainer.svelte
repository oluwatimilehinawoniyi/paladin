<script lang="ts">
	import { modalStore } from '$lib/stores/modalStore';
	import Modal from './Modal.svelte';

	let modals = $derived($modalStore.modals);
</script>

<!-- Render all modals with proper z-index stacking -->
{#each modals as modal, index (modal.id)}
	<div style="z-index: {50 + index};" class="fixed inset-0">
		<Modal {modal} />
	</div>
{/each}