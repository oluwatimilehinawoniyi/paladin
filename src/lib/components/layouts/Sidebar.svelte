<script lang="ts">
	import {
		BarChart3,
		FileText,
		LogOut,
		MessageSquareMore,
		Send,
		Settings,
		User,
		Loader2,
		Bell
	} from '@lucide/svelte';
	import SidebarMenuItem from '../ui/SidebarMenuItem.svelte';
	import logo from '$lib/assets/logo.png';
	import Button from '../ui/Button.svelte';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { modalStore } from '$lib/stores/modalStore';
	import NotificationBell from '../ui/NotificationBell.svelte';

	const menuItems = [
		{
			title: 'Profiles',
			icon: User,
			id: ''
		},
		{
			title: 'Applications',
			icon: Send,
			id: '/applications'
		},
		{
			title: 'Analytics',
			icon: BarChart3,
			id: '/analytics'
		},
		{
			title: 'Settings',
			icon: Settings,
			id: '/settings'
		}
	];

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
		modalStore.open({
			component: () => import('$lib/components/modals/RequestFeatureModal.svelte'),
			options: {
				size: 'lg',
				closeOnBackdrop: true,
				closeOnEscape: true
			}
		});
	}
</script>

<section class="hidden h-screen w-[200px] flex-col justify-between bg-gray-50 p-4 md:flex">
	<div class="flex flex-col gap-8">
		<!-- HEADER -->
		<div class="flex items-center justify-between gap-4 rounded">
			<div class="flex items-center justify-center gap-1.5">
				<img src={logo} alt="paladin's logo" class="size-6" />
				<p class="text-2xl font-bold text-[#030000]">Paladin</p>
			</div>

			<NotificationBell />
		</div>

		<!-- CONTENT -->
		<div class="flex flex-col gap-4">
			{#each menuItems as item (item.id)}
				{@const Icon = item.icon}
				{@const isActive =
					$page.url.pathname === `/app${item.id}` ||
					($page.url.pathname === '/app' && item.id === '')}
				<SidebarMenuItem {Icon} title={item.title} link={item.id} {isActive} />
			{/each}

			<div>
				<!-- <NotificationBell /> -->
			</div>
		</div>
	</div>

	<!-- REQUEST A FEATURE -->
	<div
		class="flex min-h-36 flex-col items-center justify-between gap-4 rounded-md bg-[#030000] p-3"
	>
		<p class="text-center text-sm font-medium text-white/80">
			Is there a feature you'll love paladin to have? We would love to hear your feedback.
		</p>
		<Button
			onClick={handleRequestFeature}
			name="request a feature"
			classes="w-full text-xs font-normal"
		/>
	</div>

	<!-- FOOTER -->
	<div class="space-y-4 border-t border-[#ff4d00]/30 pt-4">
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
</section>
