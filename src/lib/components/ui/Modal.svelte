<script lang="ts">
	import { modalStore, type ModalConfig } from '$lib/stores/modalStore';
	import { onMount, onDestroy } from 'svelte';
	import { X } from '@lucide/svelte';
	import { twMerge } from 'tailwind-merge';

	let { modal }: { modal: ModalConfig } = $props();

	const { component: ComponentOrImport, props: componentProps = {}, options = {}, id } = modal;

	// svelte-ignore non_reactive_update
	let Component: any = $state(null);

	// Handle dynamic imports
	// if (typeof ComponentOrImport === 'function' && ComponentOrImport.toString().includes('import')) {
	// 	// It's a dynamic import function
	// 	(ComponentOrImport as () => Promise<{ default: any }>)().then((module: any) => {
	// 		Component = module.default;
	// 	});
	// } else {
	// 	// It's a static component
	Component = ComponentOrImport;
	$effect(() => {
		if (ComponentOrImport) {
			if (
				typeof ComponentOrImport === 'function' &&
				ComponentOrImport.constructor.name === 'AsyncFunction'
			) {
				(ComponentOrImport as () => Promise<{ default: any }>)().then((module: any) => {
					Component = module.default || module;
				});
			} else if (ComponentOrImport && typeof (ComponentOrImport as any).then === 'function') {
				(ComponentOrImport as unknown as Promise<any>).then((module: any) => {
					Component = module.default || module;
				});
			} else {
				Component = ComponentOrImport;
			}
		}
	});

	const {
		closeOnEscape = true,
		closeOnBackdrop = true,
		size = 'md',
		position = 'center'
	} = options;

	let modalElement: HTMLDivElement;

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && closeOnEscape) {
			modalStore.close(id);
		}
	}

	// Handle backdrop click
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === modalElement && closeOnBackdrop) {
			modalStore.close(id);
		}
	}

	// Prevent body scroll when modal is open
	onMount(() => {
		document.body.style.overflow = 'hidden';
		if (closeOnEscape) {
			document.addEventListener('keydown', handleKeydown);
		}

		return () => {
			document.body.style.overflow = '';
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	// Size classes
	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
		full: 'max-w-full mx-4'
	};

	// Position classes
	const positionClasses = {
		center: 'items-center justify-center',
		top: 'items-start justify-center pt-16',
		bottom: 'items-end justify-center pb-16'
	};

	const backdropClasses = twMerge('fixed inset-0 z-50 flex', positionClasses[position]);

	const modalClasses = twMerge('relative w-full bg-white rounded-lg shadow-xl', sizeClasses[size]);
</script>

<!-- Backdrop -->
<div
	class={backdropClasses}
	style="background-color: rgba(0, 0, 0, 0.5);"
	bind:this={modalElement}
	onclick={handleBackdropClick}
	onkeydown={(e) => e.key === 'Enter' && handleBackdropClick(e as any)}
	role="dialog"
	aria-modal="true"
	tabindex="-1"
>
	<!-- Modal Content -->
	<div class={modalClasses}>
		<!-- Close Button -->
		<button
			class="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
			onclick={() => modalStore.close(id)}
			aria-label="Close modal"
		>
			<X class="h-4 w-4" />
		</button>

		<!-- Dynamic Component -->
		<div class="p-6">
			{#if Component}
				<Component
					{...componentProps}
					modalId={id}
					closeModal={() => modalStore.close(id)}
					openModal={modalStore.open}
				/>
			{/if}
		</div>
	</div>
</div>
