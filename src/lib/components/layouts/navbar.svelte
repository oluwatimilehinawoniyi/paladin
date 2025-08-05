<script lang="ts">
	import logo from '$lib/assets/logo.png';
</script>

<nav class="mx-auto my-8 flex max-w-lg items-center justify-between rounded-xl bg-black p-2">
	<a href="/" class="block size-8" aria-label="logo">
		<img src={logo} alt="logo" class="size-full" />
	</a>

	<a
		href="/login"
		class="flex h-8 items-center justify-center rounded-md bg-white px-2.5 font-semibold text-[#ff4d00] capitalize"
		>get started</a
	>
</nav>
