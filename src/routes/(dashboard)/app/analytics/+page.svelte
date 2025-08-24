<script lang="ts">
	import { apiService, type Application, type ApplicationStatus } from '$lib/api/apiService';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { formatDate } from '$lib/utils/formatDate';
	import {
		Calendar,
		Users,
		TrendingUp,
		Target,
		Filter,
		Search,
		ChevronDown,
		Mail,
		CheckCircle,
		XCircle,
		Clock,
		Eye,
		ExternalLink,
		Send
	} from '@lucide/svelte';
	import { onMount } from 'svelte';

	// Filter and search state
	let searchQuery = $state('');
	let statusFilter = $state('All Statuses');
	let profileFilter = $state('All Profiles');

	let applications: Application[] = $state([]);

	onMount(async () => {
		await loadApplications();
	});

	async function loadApplications() {
		try {
			const response = await apiService.getMyApplications();
			applications = response.data;
		} catch (error) {
			console.error('Failed to load applications:', error);
			applications = [];
		}
	}

	async function updateStatus(applicationId: string, newStatus: ApplicationStatus) {
		try {
			await apiService.updateApplicationStatus(applicationId, newStatus);
			await loadApplications();
		} catch (error) {
			console.error('Failed to update status:', error);
		}
	}

	// Status color mapping
	function getStatusColor(status: string) {
		switch (status) {
			case 'SENT':
				return 'bg-blue-100 text-blue-800';
			case 'INTERVIEW':
				return 'bg-yellow-100 text-yellow-800';
			case 'ACCEPTED':
				return 'bg-green-100 text-green-800';
			case 'REJECTED':
				return 'bg-red-100 text-red-800';
			case 'FOLLOW_UP':
				return 'bg-orange-100 text-orange-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	// Status icon mapping
	function getStatusIcon(status: string) {
		switch (status.toLowerCase()) {
			case 'applied':
				return Clock;
			case 'interview':
				return Users;
			case 'offer':
				return CheckCircle;
			case 'rejected':
				return XCircle;
			default:
				return Clock;
		}
	}

	let fetchedProfiles = $derived(applications.map((app) => app.profile));

	// Filter applications based on search and filters
	let filteredApplications = $derived(
		applications.filter((app) => {
			const matchesSearch =
				app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
				app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'All Statuses' || app.status === statusFilter;
			const matchesProfile = profileFilter === 'All Profiles' || app.profile === profileFilter;

			return matchesSearch && matchesStatus && matchesProfile;
		})
	);
</script>

<section class="flex w-full flex-col gap-8 overflow-hidden p-4 md:h-screen md:pt-14">
	<!-- Header -->
	<div class="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-end">
		<div>
			<h1 class="text-2xl font-bold text-gray-700 capitalize">Analytics Dashboard</h1>
			<p class="text-gray-500">Track your job search performance and optimize your strategy</p>
		</div>
	</div>

	<div class="custom-scrollbar flex-1 space-y-8 overflow-x-hidden overflow-y-auto pb-4">
		<!-- Application History Table -->
		{#if applications.length === 0}
			<div class="flex flex-col items-center justify-center py-12">
				<div class="text-center">
					<Send class="mx-auto h-12 w-12 text-gray-400" />
					<h3 class="mt-4 text-lg font-medium text-gray-900">No applications yet</h3>
					<p class="mt-2 text-gray-500">Start applying for jobs to see your analytics here.</p>
					<a
						href="/app/applications"
						class="mt-4 inline-flex items-center gap-2 rounded-md bg-[#ff4d00] px-4 py-2 text-white hover:bg-[#ff4d00]/90"
					>
						<Send class="h-4 w-4" />
						Apply for Jobs
					</a>
				</div>
			</div>
		{:else}
			<div class="overflow-x-hidden rounded-lg border border-gray-200 bg-white p-6">
				<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 class="text-lg font-semibold text-gray-800">Application History</h3>
						<p class="text-sm text-gray-600">Track and manage all your job applications</p>
					</div>
				</div>

				<!-- Filters & Search -->
				<div class="mb-6 flex w-full flex-wrap gap-4 sm:items-center">
					<!-- Search -->
					<div class="relative">
						<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search companies or positions..."
							bind:value={searchQuery}
							class="w-full max-w-72 rounded-md border border-gray-300 py-2 pr-3 pl-10 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
						/>
					</div>

					<!-- Status Filter -->
					<div class="relative">
						<select
							bind:value={statusFilter}
							class="appearance-none rounded-md border border-gray-300 bg-white py-2 pr-8 pl-3 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
						>
							<option>All Statuses</option>
							<option value="SENT">Sent</option>
							<option value="INTERVIEW">Interview</option>
							<option value="ACCEPTED">Accepted</option>
							<option value="REJECTED">Rejected</option>
							<option value="FOLLOW_UP">Follow Up</option>
						</select>
						<ChevronDown class="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					</div>

					<!-- Profile Filter -->
					<div class="relative">
						<select
							bind:value={profileFilter}
							class="appearance-none rounded-md border border-gray-300 bg-white py-2 pr-8 pl-3 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
						>
							<option>All Profiles</option>
							{#each fetchedProfiles as profile}
								<option value={profile}>{profile}</option>
							{/each}
						</select>
						<ChevronDown class="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					</div>
				</div>

				<!-- Applications Table -->
				<div class="w-full overflow-x-auto">
					<table class="w-[450%] min-w-full whitespace-nowrap md:w-[205%] lg:w-full">
						<thead>
							<tr class="border-b border-gray-200">
								<th class="px-4 py-3 text-left font-medium text-gray-600">Company</th>
								<th class="px-4 py-3 text-left font-medium text-gray-600">Position</th>
								<th class="px-8 py-3 text-left font-medium text-gray-600">Date Applied</th>
								<th class="px-4 py-3 text-left font-medium text-gray-600">Profile Used</th>
								<th class="px-4 py-3 text-left font-medium text-gray-600">Status</th>
								<th class="px-4 py-3 text-left font-medium text-gray-600">Contact</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredApplications as application (application.id)}
								{@const StatusIcon = getStatusIcon(application.status)}
								<tr class="border-b border-gray-100 hover:bg-gray-50">
									<td class="px-4 py-4">
										<div class="flex items-center gap-2">
											<Icon icon={StatusIcon} />
											<p class="text-gray-600 capitalize">
												{application.company}
											</p>
										</div>
									</td>
									<td class="px-4 py-4 text-gray-600 capitalize">{application.jobTitle}</td>
									<td class="px-8 py-4 text-gray-600">{formatDate(application.sentAt)}</td>
									<td class="px-4 py-4 text-gray-600">{application.profile}</td>
									<td class="px-4 py-4">
										<select
											value={application?.status}
											onchange={(e) =>
												updateStatus(
													application.id,
													(e.target as HTMLSelectElement).value as ApplicationStatus
												)}
											class="rounded border px-2 py-1 text-xs outline-0 {getStatusColor(
												application.status.toLocaleUpperCase()
											)}"
										>
											<option value="SENT">Sent</option>
											<option value="INTERVIEW">Interview</option>
											<option value="ACCEPTED">Accepted</option>
											<option value="REJECTED">Rejected</option>
											<option value="FOLLOW_UP">Follow Up</option>
										</select>
									</td>
									<td class="px-4 py-4">
										<a
											href="mailto:{application.jobEmail}"
											class="grid grid-cols-[auto_auto] items-center gap-1 text-sm text-gray-600 hover:text-[#ff4d00]"
										>
											<Mail class=" size-3 translate-y-0.5" />
											<p class="">
												{application.jobEmail}
											</p>
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>

					{#if filteredApplications.length === 0}
						<div class="py-12 text-center">
							<Search class="mx-auto h-12 w-12 text-gray-400" />
							<h3 class="mt-4 text-lg font-medium text-gray-900">No applications found</h3>
							<p class="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
						</div>
					{/if}
				</div>

				<!-- Table Footer with Stats -->
				<div
					class="mt-6 flex flex-col justify-between gap-4 border-t border-gray-200 pt-4 lg:flex-row lg:items-center"
				>
					<p class="text-sm text-gray-600">
						Showing {filteredApplications.length} of {applications.length} applications
					</p>
					<div class="grid grid-cols-2 gap-4 text-sm md:grid-cols-4 lg:grid-cols-5">
						<div class="flex flex-col gap-1 lg:flex-row lg:items-center">
							<div class="h-2 w-2 rounded-full bg-blue-500"></div>
							<span class="text-gray-600"
								>Sent ({applications.filter((a) => a.status === 'Sent'.toLocaleUpperCase())
									.length})</span
							>
						</div>
						<div class="flex flex-col gap-1 lg:flex-row lg:items-center">
							<div class="h-2 w-2 rounded-full bg-yellow-500"></div>
							<span class="text-gray-600"
								>Interview ({applications.filter(
									(a) => a.status === 'Interview'.toLocaleUpperCase()
								).length})</span
							>
						</div>
						<div class="flex flex-col gap-1 lg:flex-row lg:items-center">
							<div class="h-2 w-2 rounded-full bg-green-500"></div>
							<span class="text-gray-600"
								>Accepted ({applications.filter((a) => a.status === 'Accepted'.toLocaleUpperCase())
									.length})</span
							>
						</div>
						<div class="flex flex-col gap-1 lg:flex-row lg:items-center">
							<div class="h-2 w-2 rounded-full bg-red-500"></div>
							<span class="text-gray-600"
								>Rejected ({applications.filter((a) => a.status === 'Rejected'.toLocaleUpperCase())
									.length})</span
							>
						</div>
						<div class="flex flex-col gap-1 lg:flex-row lg:items-center">
							<div class="h-2 w-2 rounded-full bg-red-500"></div>
							<span class="text-gray-600"
								>Follow Up ({applications.filter(
									(a) => a.status === 'Follow_up'.toLocaleUpperCase()
								).length})</span
							>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	table {
		table-layout: fixed;
	}
	.custom-scrollbar {
		scrollbar-width: thin;
		scrollbar-color: #ff4d00 transparent;
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 8px;
	}

	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
		border-radius: 4px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e5e7eb;
		border-radius: 4px;
		transition: background-color 0.2s ease;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #d1d5db;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb:active {
		background: #9ca3af;
	}
</style>
