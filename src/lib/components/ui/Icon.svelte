<script lang="ts">
	import { type Icon as IconType } from '@lucide/svelte';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		icon: typeof IconType;
		iconClasses?: string;
		holderClasses?: string;
		onClick?: () => void;
	}

	let { icon, holderClasses = '', iconClasses = '', onClick }: Props = $props();

	let buttonClassesMerge = twMerge(
		'flex size-6 cursor-pointer items-center justify-center rounded transition-all duration-200 ease-linear',
		holderClasses
	);
	let iconClassesMerge = twMerge(
		'size-4 stroke-2 text-[#160200]  transition-all duration-200 ease-linear',
		iconClasses
	);
</script>

<button class={buttonClassesMerge} onclick={onClick}>
	{#if icon}
		{@const IconComponent = icon}
		<IconComponent class={iconClassesMerge} />
	{/if}
</button>
