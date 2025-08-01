<script lang="ts">
	let { title, Icon, link } = $props();
</script>

<div class="group rounded p-2 transition-colors duration-200 ease-linear hover:bg-[#ff4d00]">
	<a
		href="/app/{link}"
		class="flex items-center gap-2 text-[#030000] transition-colors duration-200 ease-linear group-hover:text-white"
	>
		<Icon class="size-4 transition-colors duration-200 ease-linear group-hover:text-white" />
		<p class="">{title}</p>
	</a>
</div>
