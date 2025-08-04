<script lang="ts">
	let { title, Icon, link, isActive = false } = $props();
</script>

<div
	class="group rounded transition-colors duration-200 ease-linear hover:bg-[#ff4d00] {isActive
		? 'bg-[#ff4d00]'
		: ''}"
>
	<a
		href="/app{link}"
		class="flex items-center gap-2 p-2 transition-colors duration-200 ease-linear {isActive
			? 'text-white'
			: 'text-[#030000] group-hover:text-white'}"
	>
		<Icon
			class="size-4 transition-colors duration-200 ease-linear {isActive
				? 'text-white'
				: 'group-hover:text-white'}"
		/>
		<p class="">{title}</p>
	</a>
</div>
