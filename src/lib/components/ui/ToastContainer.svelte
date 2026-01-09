<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
	import Toast from './Toast.svelte';
</script>

<div
	class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 outline-none pointer-events-none"
>
    <!-- Pointer events auto allows clicking on toasts, but passing through the container -->
    <div class="flex flex-col gap-2 pointer-events-auto">
        {#each $toastStore as toast (toast.id)}
            <Toast {toast} />
        {/each}
    </div>
</div>
