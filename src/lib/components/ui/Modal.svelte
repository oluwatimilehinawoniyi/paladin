<script lang="ts">
	import { modalStore, type ModalConfig } from '$lib/stores/modalStore';
	import { onMount } from 'svelte';
	import { X } from '@lucide/svelte';
	import { twMerge } from 'tailwind-merge';

	let { modal }: { modal: ModalConfig } = $props();

	const { component: ComponentOrImport, props: componentProps = {}, options = {}, id } = modal;

	let Component: any = $state(null);
	let isLoading = $state(true);

	// Simple dynamic import handling
	$effect(() => {
		async function loadComponent() {
			console.log('Loading component:', modal.component, typeof modal.component);

			if (typeof modal.component === 'function') {
				// It's a dynamic import function
				try {
					console.log('Attempting dynamic import...');
					const module = await modal.component();
					console.log('Module loaded:', module);
					Component = module.default || module;
					console.log('Component set:', Component);
				} catch (error) {
					console.error('Failed to load modal component:', error);
				}
			} else {
				// It's a regular component
				console.log('Setting regular component...');
				Component = modal.component;
			}
			isLoading = false;
		}

		loadComponent();
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
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-full mx-4'
	};

	// Position classes
	const positionClasses = {
		center: 'items-center justify-center',
		top: 'items-start justify-center pt-16',
		bottom: 'items-end justify-center pb-16'
	};

	const backdropClasses = twMerge('fixed p-4 inset-0 z-50 flex', positionClasses[position]);

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
		<div class="p-2">
			{#if !isLoading && Component}
				<Component
					{...componentProps}
					modalId={id}
					closeModal={() => modalStore.close(id)}
					openModal={modalStore.open}
				/>
			{:else if isLoading}
				<div class="flex items-center justify-center py-8">
					<div class="text-gray-500">Loading...</div>
				</div>
			{/if}
		</div>
	</div>
</div>
