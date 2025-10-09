<script lang="ts">
	import {
		Menu,
		X,
		User,
		Send,
		BarChart3,
		Settings,
		LogOut,
		UserRoundPlus,
		Loader2,
		Lightbulb
	} from '@lucide/svelte';
	import { page } from '$app/stores';
	import logo from '$lib/assets/logo.png';
	import Button from '../ui/Button.svelte';
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { modalStore } from '$lib/stores/modalStore';

	let isOpen = $state(false);

	const menuItems = [
		{
			title: 'Profiles',
			icon: User,
			id: '',
			href: '/app'
		},
		{
			title: 'Applications',
			icon: Send,
			id: '/applications',
			href: '/app/applications'
		},
		{
			title: 'Analytics',
			icon: BarChart3,
			id: '/analytics',
			href: '/app/analytics'
		},
		{
			title: 'Settings',
			icon: Settings,
			id: '/settings',
			href: '/app/settings'
		}
	];

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	// Close menu when clicking outside
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeMenu();
		}
	}

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeMenu();
		}
	}

	// Close menu when route changes
	$effect(() => {
		const unsubscribe = page.subscribe(() => {
			closeMenu();
		});
		return unsubscribe;
	});

	// Add/remove event listeners for escape key
	$effect(() => {
		if (isOpen) {
			document.addEventListener('keydown', handleKeydown);
			return () => {
				document.removeEventListener('keydown', handleKeydown);
			};
		}
	});

	let user = $derived($authStore.user);
	let isLoading = $derived($authStore.isLoading);
	let isInitialized = $derived($authStore.isInitialized);

	// Initialize auth store on mount
	onMount(async () => {
		if (!$authStore.isInitialized) {
			await authStore.init();
		}
	});

	async function handleLogout() {
		await authStore.logout();
	}

	function handleRequestFeature() {
		closeMenu(); // Close menu first
		modalStore.open({
			component: () => import('$lib/components/modals/RequestFeatureModal.svelte'),
			options: {
				size: 'md',
				closeOnBackdrop: true,
				closeOnEscape: true
			}
		});
	}
</script>

<!-- Mobile Navbar - Only visible on mobile -->
<nav class="sticky top-0 z-40 border-b border-gray-200 bg-white md:hidden">
	<div class="flex items-center justify-between px-4 py-3">
		<!-- Logo -->
		<a href="/app" class="flex items-center gap-2">
			<img src={logo} alt="Paladin logo" class="size-8" />
			<span class="text-xl font-bold text-[#030000]">Paladin</span>
		</a>

		<!-- Menu Button -->
		<button
			onclick={toggleMenu}
			class="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
			aria-label="Toggle menu"
		>
			{#if isOpen}
				<X class="size-6" />
			{:else}
				<Menu class="size-6" />
			{/if}
		</button>
	</div>
</nav>

<!-- Mobile Menu Overlay -->
{#if isOpen}
	<div class="fixed inset-0 z-50 h-dvh md:hidden">
		<!-- Backdrop -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="absolute inset-0 bg-black/50"
			onclick={handleBackdropClick}
			role="button"
			tabindex="-1"
			aria-label="Close menu"
		></div>

		<!-- Slide-out Menu -->
		<div class="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white pb-16 shadow-xl">
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
				<div class="flex items-center gap-2">
					<img src={logo} alt="Paladin logo" class="size-8" />
					<span class="text-xl font-bold text-[#030000]">Paladin</span>
				</div>
				<button
					onclick={closeMenu}
					class="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
					aria-label="Close menu"
				>
					<X class="size-5" />
				</button>
			</div>

			<!-- Menu Content -->
			<div class="flex h-full flex-col">
				<!-- Navigation Links -->
				<div class="flex-1 px-4 py-6">
					<div class="space-y-2">
						{#each menuItems as item (item.id)}
							{@const Icon = item.icon}
							{@const isActive =
								$page.url.pathname === item.href ||
								($page.url.pathname === '/app' && item.id === '')}

							<a
								href={item.href}
								class="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-700 transition-colors hover:bg-gray-100 {isActive
									? 'bg-[#ff4d00] text-white hover:bg-[#ff4d00]'
									: ''}"
								onclick={closeMenu}
							>
								<Icon class="size-5 {isActive ? 'text-white' : 'text-gray-500'}" />
								<span class="font-medium">{item.title}</span>
							</a>
						{/each}
					</div>
				</div>

				<!-- Request Feature Button -->
				<div class="border-t border-gray-200 px-4 py-4">
					<button
						onclick={handleRequestFeature}
						class="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all hover:border-[#ff4d00] hover:bg-[#ff4d00]/5"
					>
						<Lightbulb class="size-5 text-[#ff4d00]" />
						<span class="font-medium">Request a Feature</span>
					</button>
				</div>

				<!-- User Section -->
				<div class="space-y-4 border-t border-[#ff4d00]/30 px-4 py-4">
					<div class="flex items-center gap-4">
						<div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
							{#if isLoading && !isInitialized}
								<Loader2 class="h-4 w-4 animate-spin text-[#ff4d00]" />
							{:else}
								<User class="h-4 w-4 text-[#ff4d00]" />
							{/if}
						</div>
						<div class="min-w-0 flex-1">
							{#if isLoading && !isInitialized}
								<!-- Loading skeleton -->
								<div class="animate-pulse">
									<div class="mb-1 h-4 w-20 rounded bg-gray-300"></div>
									<div class="h-3 w-24 rounded bg-gray-200"></div>
								</div>
							{:else if user}
								<!-- User data loaded -->
								<p class="truncate text-sm font-medium text-gray-900">
									{user.firstName}
									{user.lastName}
								</p>
								<p class="truncate text-xs text-gray-500">
									{user.email}
								</p>
							{:else}
								<!-- No user data -->
								<p class="truncate text-sm font-medium text-gray-500">Not logged in</p>
								<p class="truncate text-xs text-gray-400">Please refresh</p>
							{/if}
						</div>
					</div>

					<Button
						name="logout"
						classes="w-full"
						icon={LogOut}
						onClick={handleLogout}
						disabled={isLoading && !isInitialized}
					/>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Smooth slide animation */
	.absolute.right-0 {
		animation: slideIn 0.3s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}
</style>
