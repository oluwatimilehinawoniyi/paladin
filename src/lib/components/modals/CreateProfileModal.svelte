<script>
	import Button from '../ui/Button.svelte';
</script>

<div class="">
	<h2 class="">create profile</h2>
	<p class="">Add a profile that reflects your proficiency</p>

	<div class="">
		<div class="">
			<label for="title" class="capitalize">
				profile title <span class="text-[#ff4d00]">*</span>
			</label>
			<div class="">
				<input type="text" name="title" id="title" class="" />
			</div>
		</div>
		<div class="">
			<label for="summary" class="capitalize">
				professional summary <span class="text-[#ff4d00]">*</span>
			</label>
			<div class="">
				<input type="text" name="summary" id="summary" class="" />
			</div>
		</div>
		<div class="">
			<label for="skills" class="capitalize">
				skills (comma-separated) <span class="text-[#ff4d00]">*</span>
			</label>
			<div class="">
				<input type="text" name="skills" id="skills" class="" />
			</div>
		</div>
		<div class="">
			<label for="cv" class="capitalize">
				update CV (.pdf, .doc) <span class="text-[#ff4d00]">*</span>
			</label>
			<div class="">
				<input type="file" name="cv" id="cv" class="" />
			</div>
		</div>
	</div>
	<div class="">
		<Button name="cancel" />
		<Button name="update profile" />
	</div>
</div>
