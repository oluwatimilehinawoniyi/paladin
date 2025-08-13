<script lang="ts">
	import { CheckCircle, Mail, Building, User, Calendar, ExternalLink } from '@lucide/svelte';
	import Button from '../ui/Button.svelte';

	interface Props {
		modalId: string;
		closeModal: () => void;
		applicationData: {
			company: string;
			position: string;
			recipientEmail: string;
			profileUsed: string;
			applicationId?: string;
			sentAt: string;
		};
	}

	let { modalId, closeModal, applicationData }: Props = $props();

	function handleViewApplications() {
		closeModal();
		window.location.href = '/app/analytics';
	}

	function handleSendAnother() {
		closeModal();
	}
</script>

<div class="text-center space-y-4 py-2 max-w-md mx-auto">
	<!-- Success Icon -->
	<div class="flex justify-center">
		<div class="flex size-14 items-center justify-center rounded-full bg-green-100 animate-pulse">
			<CheckCircle class="size-8 text-green-600" />
		</div>
	</div>

	<!-- Success Message -->
	<div class="space-y-1">
		<h2 class="text-xl font-bold text-gray-900">Application Sent! 🎉</h2>
		<p class="text-gray-600 text-sm">
			Your job application has been successfully sent and is now in the hands of the hiring team.
		</p>
	</div>

	<!-- Application Details Card -->
	<div class="bg-gray-50 rounded-lg px-4 py-2 text-left">
		<h3 class="font-semibold text-gray-800 mb-1.5">Application Summary</h3>
		
		<div class="space-y-2 text-xs text-sm">
			<div class="flex items-center gap-2">
				<Building class="size-3 text-gray-500" />
				<span class="text-gray-600">Company:</span>
				<span class="font-medium text-gray-800">{applicationData.company}</span>
			</div>
			
			<div class="flex items-center gap-2">
				<User class="size-3 text-gray-500" />
				<span class="text-gray-600">Position:</span>
				<span class="font-medium text-gray-800">{applicationData.position}</span>
			</div>
			
			<div class="flex items-center gap-2">
				<Mail class="size-3 text-gray-500" />
				<span class="text-gray-600">Sent to:</span>
				<span class="font-medium text-gray-800">{applicationData.recipientEmail}</span>
			</div>
			
			<div class="flex items-center gap-2">
				<User class="size-3 text-gray-500" />
				<span class="text-gray-600">Profile:</span>
				<span class="font-medium text-gray-800">{applicationData.profileUsed}</span>
			</div>
			
			<div class="flex items-center gap-2">
				<Calendar class="size-3 text-gray-500" />
				<span class="text-gray-600">Sent:</span>
				<span class="font-medium text-gray-800">{new Date(applicationData.sentAt).toLocaleString()}</span>
			</div>

			{#if applicationData.applicationId}
				<div class="flex items-center gap-2">
					<CheckCircle class="size-3 text-gray-500" />
					<span class="text-gray-600">ID:</span>
					<span class="font-mono text-xs text-gray-800">{applicationData.applicationId}</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- encouragement message -->
	<div class="bg-blue-50 border border-blue-200 rounded-lg py-2.5 px-4">
		<p class="text-xs text-blue-800">
			🚀 <strong>Good luck!</strong> Keep track of your applications and follow up in a week if you don't hear back.
		</p>
	</div>

	<!-- action buttons -->
	<div class="flex flex-col sm:flex-row gap-3">
		<Button
			name="Send Another Application"
			onClick={handleSendAnother}
			classes="flex-1 justify-center bg-[#ff4d00] hover:bg-[#ff4d00]/90"
		/>
		<button
			onclick={handleViewApplications}
			class="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
		>
			<ExternalLink class="h-4 w-4" />
			View All Applications
		</button>
	</div>
</div>