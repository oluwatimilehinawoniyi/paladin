<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { Shield } from '@lucide/svelte';
	import logo from '$lib/assets/logo.png';
	// Props for customization
	interface Props {
		className?: string;
	}

	let { className = '' }: Props = $props();

	// Component classes
	let containerClasses = twMerge('border-t border-slate-200/60 bg-slate-50', className);

	// Navigation links - minimal and essential
	const navLinks = [
		{ name: 'Privacy', href: '/privacy' },
		{ name: 'Terms', href: '/terms' }
	];

	// Current year for copyright
	const currentYear = new Date().getFullYear();
</script>

<footer class={containerClasses}>
	<div class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="grid w-full justify-items-center items-center gap-6 md:grid-cols-3">
			<!-- Left: Navigation Links -->
			<nav class="justify-self-start flex items-center gap-8">
				{#each navLinks as link}
					<a
						href={link.href}
						class="text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-slate-700"
					>
						{link.name}
					</a>
				{/each}
			</nav>

			<!-- Center: Logo (hidden on mobile, shown on desktop) -->
			<div class="hidden md:block">
				<img src={logo} alt="" class="size-6" />
			</div>

			<!-- Right: Copyright -->
			<div class="text-sm justify-self-end text-slate-500">
				© {currentYear} Paladin. All rights reserved.
			</div>
		</div>

		<!-- Mobile Logo (shown only on mobile) -->
		<div
			class="mt-4 flex items-center justify-center gap-2 border-t border-slate-200/60 pt-4 opacity-60 md:hidden"
		>
			<div
				class="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff4d00] to-orange-600"
			>
				<Shield class="h-4 w-4 text-white" />
			</div>
			<span class="text-sm font-semibold text-slate-600">Paladin</span>
		</div>
	</div>
</footer>
