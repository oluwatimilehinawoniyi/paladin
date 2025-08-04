<script lang="ts">
	import { Menu, X, User, Send, BarChart3, Settings, LogOut, UserRoundPlus } from '@lucide/svelte';
	import { page } from '$app/stores';
	import logo from '$lib/assets/logo.png';
	import Button from '../ui/Button.svelte';

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

	// Close menu when route changes
	$effect(() => {
		const unsubscribe = page.subscribe(() => {
			closeMenu();
		});
		return unsubscribe;
	});
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
	<div
		class="fixed inset-0 z-50 md:hidden"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Escape' && closeMenu()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Backdrop -->
		<div class="absolute inset-0 bg-black/50"></div>

		<!-- Slide-out Menu -->
		<div class="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl">
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

				<!-- User Section -->
				<div class="border-t border-gray-200 p-4">
					<!-- User Info -->
					<div class="mb-4 flex items-center gap-3">
						<div class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
							<User class="h-5 w-5 text-[#ff4d00]" />
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate font-medium text-gray-900">John Doe</p>
							<p class="truncate text-sm text-gray-500">johndoe@gmail.com</p>
						</div>
					</div>

					<!-- Action Buttons -->
					<div class="space-y-3">
						<Button
							name="Create Profile"
							icon={UserRoundPlus}
							classes="w-full justify-center text-sm"
						/>
						<button
							class="flex w-full items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
						>
							<LogOut class="size-4" />
							Logout
						</button>
					</div>
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
