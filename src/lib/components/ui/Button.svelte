<script lang="ts">
	import { type Icon as IconType } from '@lucide/svelte';

	interface Props {
		name: string;
		icon?: typeof IconType;
		classes?: string;
		onClick?: () => void;
	}

	let { name, icon, classes = '', onClick }: Props = $props();
</script>

<button
	class="flex w-fit min-w-fit cursor-pointer items-center justify-center gap-2 rounded-md bg-[#ff4d00] px-4 py-2 font-medium text-white capitalize {classes}"
	onclick={onClick}
>
	{#if icon}
		{@const IconComponent = icon}
		<IconComponent class="size-4 stroke-2" />
	{/if}
	{name}
</button>
