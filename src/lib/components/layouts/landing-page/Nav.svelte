<script>
	import { Play, ArrowRight } from '@lucide/svelte';
</script>

<!-- Navigation -->
<nav class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
	<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<div class="flex items-center gap-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff4d00] to-orange-600 font-bold text-white"
				>
					P
				</div>
				<span class="text-xl font-bold text-slate-900">Paladin</span>
			</div>

			<!-- CTA Buttons -->
			<div class="flex items-center gap-3">
				<a
					href="/auth/login"
					class="flex items-center gap-2 rounded-lg bg-[#ff4d00] px-4 py-2 font-medium text-white transition-all"
				>
					Get Started
					<ArrowRight class="h-4 w-4" />
				</a>
			</div>
		</div>
	</div>
</nav>
