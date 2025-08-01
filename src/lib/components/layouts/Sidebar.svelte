<script lang="ts">
	import { BarChart3, FileText, LogOut, Send, Settings, User } from '@lucide/svelte';
	import SidebarMenuItem from '../ui/SidebarMenuItem.svelte';
	import logo from '$lib/assets/logo.png';

	const menuItems = [
		{
			title: 'Profiles',
			icon: User,
			id: ''
		},
		{
			title: 'Applications',
			icon: Send,
			id: 'applications'
		},
		{
			title: 'History',
			icon: FileText,
			id: 'history'
		},
		{
			title: 'Analytics',
			icon: BarChart3,
			id: 'analytics'
		},
		{
			title: 'Settings',
			icon: Settings,
			id: 'settings'
		}
	];
</script>

<section class="flex w-[200px] flex-col justify-between bg-gray-50 p-4">
	<div class="flex flex-col gap-8">
		<!-- HEADER -->
		<div class="rounded">
			<div class="flex items-center gap-2">
				<img src={logo} alt="paladin's logo" class="size-8" />
				<p class="text-3xl font-bold text-[#030000]">Paladin</p>
			</div>
		</div>

		<!-- CONTENT -->
		<div class="flex flex-col gap-4">
			{#each menuItems as item (item.id)}
				{@const Icon = item.icon}
				<SidebarMenuItem {Icon} title={item.title} link={item.id} />
			{/each}
		</div>
	</div>

	<!-- FOOTER -->
	<div class="space-y-4 border-t border-[#ff4d00]/30 pt-4">
		<div class="flex items-center gap-4">
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
				<User class="h-4 w-4 text-[#ff4d00]" />
			</div>
			<div class="min-w-0 flex-1">
				<p class="truncate text-sm font-medium text-gray-900">
					John Doe
					<!-- {user?.firstName} -->
					<!-- {user?.lastName} -->
				</p>
				<p class="truncate text-xs text-gray-500">
					johndoe@gmail.com
					<!-- {user?.email} -->
				</p>
			</div>
		</div>

		<button
			class="text[#160200] flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#ff4d00] px-4 py-2 font-medium text-white capitalize"
		>
			<LogOut class="size-4" />
			logout</button
		>
	</div>
</section>

<style lang="postcss">
</style>
