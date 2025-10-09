<script lang="ts">
	import { type Icon as IconType } from '@lucide/svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset' | null | undefined;
		name: string;
		icon?: typeof IconType;
		classes?: string;
		onClick?: () => void;
		disabled?: boolean;
	}

	let { name, icon, type, classes = '', onClick, disabled }: Props = $props();
</script>

<button
	{type}
	class="flex w-fit min-w-fit cursor-pointer items-center justify-center gap-2 rounded-md bg-[#ff4d00] px-4 py-2 font-medium text-white capitalize {classes}"
	onclick={onClick}
	{disabled}
>
	{#if icon}
		{@const IconComponent = icon}
		<IconComponent class="size-4 stroke-2" />
	{/if}
	{name}
</button>
