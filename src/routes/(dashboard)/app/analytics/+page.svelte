<script lang="ts">
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
		ExternalLink
	} from '@lucide/svelte';

	// Mock data for applications - this would come from your data store/API
	let applications = [
		{
			id: 1,
			company: 'TechCorp Inc.',
			position: 'Senior Frontend Developer',
			dateApplied: '1/20/2024',
			profileUsed: 'Frontend Developer',
			status: 'Interview',
			contact: 'hr@techcorp.com'
		},
		{
			id: 2,
			company: 'StartupXYZ',
			position: 'Full Stack Engineer',
			dateApplied: '1/18/2024',
			profileUsed: 'Full Stack Engineer',
			status: 'Applied',
			contact: 'jobs@startupxyz.com'
		},
		{
			id: 3,
			company: 'DataFlow Solutions',
			position: 'React Developer',
			dateApplied: '1/15/2024',
			profileUsed: 'Frontend Developer',
			status: 'Rejected',
			contact: 'careers@dataflow.com'
		},
		{
			id: 4,
			company: 'InnovateLabs',
			position: 'Software Engineer',
			dateApplied: '1/12/2024',
			profileUsed: 'Full Stack Engineer',
			status: 'Offer',
			contact: 'talent@innovatelabs.com'
		},
		{
			id: 5,
			company: 'CloudTech Systems',
			position: 'Frontend Specialist',
			dateApplied: '1/10/2024',
			profileUsed: 'Frontend Developer',
			status: 'Interview',
			contact: 'hr@cloudtech.com'
		},
		{
			id: 6,
			company: 'WebDev Agency',
			position: 'UI Developer',
			dateApplied: '1/8/2024',
			profileUsed: 'Frontend Developer',
			status: 'Applied',
			contact: 'jobs@webdevagency.com'
		}
	];

	// Summary statistics
	let totalApplications = 95;
	let totalInterviews = 27; // 28.4% of 95
	let totalOffers = 12; // 12.6% of 95
	let successRate = 44.4; // Interviews to offers conversion

	// Goals progress
	let applicationGoal = 25;
	let interviewGoal = 5;
	let offerGoal = 2;
	let currentApplications = 22;
	let currentInterviews = 7;
	let currentOffers = 4;

	// Filter and search state
	let searchQuery = '';
	let statusFilter = 'All Statuses';
	let profileFilter = 'All Profiles';

	// Status color mapping
	function getStatusColor(status: string) {
		switch (status.toLowerCase()) {
			case 'applied':
				return 'bg-blue-100 text-blue-800';
			case 'interview':
				return 'bg-yellow-100 text-yellow-800';
			case 'offer':
				return 'bg-green-100 text-green-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
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

	// Filter applications based on search and filters
	$: filteredApplications = applications.filter((app) => {
		const matchesSearch =
			app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
			app.position.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'All Statuses' || app.status === statusFilter;
		const matchesProfile = profileFilter === 'All Profiles' || app.profileUsed === profileFilter;

		return matchesSearch && matchesStatus && matchesProfile;
	});

	// Calculate percentages for display
	$: interviewRate =
		totalApplications > 0 ? ((totalInterviews / totalApplications) * 100).toFixed(1) : '0.0';
	$: offerRate =
		totalApplications > 0 ? ((totalOffers / totalApplications) * 100).toFixed(1) : '0.0';
	$: conversionRate =
		totalInterviews > 0 ? ((totalOffers / totalInterviews) * 100).toFixed(1) : '0.0';

	// Calculate goal progress percentages
	$: applicationProgress = Math.min((currentApplications / applicationGoal) * 100, 100);
	$: interviewProgress = Math.min((currentInterviews / interviewGoal) * 100, 100);
	$: offerProgress = Math.min((currentOffers / offerGoal) * 100, 100);

	// Mock data for trend chart (would be calculated from real data)
	let trendData = [
		{ week: 'Week 1', applications: 3, interviews: 1, offers: 0 },
		{ week: 'Week 2', applications: 3, interviews: 1, offers: 1 },
		{ week: 'Week 3', applications: 4, interviews: 2, offers: 1 },
		{ week: 'Week 4', applications: 4, interviews: 3, offers: 2 }
	];

	// Insight recommendations
	let insights = [
		{
			type: 'success',
			title: 'Frontend Profile Performing Well',
			message: 'Your Frontend Developer profile has the highest usage and success rate',
			icon: TrendingUp
		},
		{
			type: 'warning',
			title: 'Optimize Application Timing',
			message: 'Consider applying earlier in the week for faster response times',
			icon: Calendar
		},
		{
			type: 'info',
			title: 'Diversify Your Approach',
			message: 'Try using your other profiles more frequently to expand opportunities',
			icon: Target
		}
	];

	function handleApplicationView(id: number) {
		console.log('View application details:', id);
		// Navigate to application details or open modal
	}

	function handleCompanyVisit(company: string) {
		console.log('Visit company website:', company);
		// Open company website in new tab
	}
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
		<!-- Summary Statistics Cards -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<!-- Total Applications -->
			<div class="rounded-lg border border-gray-200 bg-white p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Applications</p>
						<p class="text-3xl font-bold text-gray-900">{totalApplications}</p>
						<div class="mt-2 flex items-center text-sm">
							<TrendingUp class="mr-1 h-4 w-4 text-green-500" />
							<span class="text-green-600">+12% from last month</span>
						</div>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
						<Calendar class="h-6 w-6 text-blue-600" />
					</div>
				</div>
			</div>

			<!-- Interview Rate -->
			<div class="rounded-lg border border-gray-200 bg-white p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Interview Rate</p>
						<p class="text-3xl font-bold text-gray-900">{interviewRate}%</p>
						<div class="mt-2 h-2 w-full rounded-full bg-gray-200">
							<div class="h-2 rounded-full bg-yellow-500" style="width: {interviewRate}%"></div>
						</div>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
						<Users class="h-6 w-6 text-yellow-600" />
					</div>
				</div>
			</div>

			<!-- Offer Rate -->
			<div class="rounded-lg border border-gray-200 bg-white p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Offer Rate</p>
						<p class="text-3xl font-bold text-gray-900">{offerRate}%</p>
						<div class="mt-2 h-2 w-full rounded-full bg-gray-200">
							<div class="h-2 rounded-full bg-green-500" style="width: {offerRate}%"></div>
						</div>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
						<CheckCircle class="h-6 w-6 text-green-600" />
					</div>
				</div>
			</div>

			<!-- Conversion Rate -->
			<div class="rounded-lg border border-gray-200 bg-white p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Conversion Rate</p>
						<p class="text-3xl font-bold text-gray-900">{conversionRate}%</p>
						<p class="mt-1 text-sm text-gray-500">Interviews to offers</p>
					</div>
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
						<Target class="h-6 w-6 text-purple-600" />
					</div>
				</div>
			</div>
		</div>

		<!-- Application History Table -->
		<div class="overflow-x-scroll rounded-lg border border-gray-200 bg-white p-6">
			<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h3 class="text-lg font-semibold text-gray-800">Application History</h3>
					<p class="text-sm text-gray-600">Track and manage all your job applications</p>
				</div>
			</div>

			<!-- Filters & Search -->
			<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
				<!-- Search -->
				<div class="relative flex-1">
					<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search companies or positions..."
						bind:value={searchQuery}
						class="w-full rounded-md border border-gray-300 py-2 pr-3 pl-10 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
					/>
				</div>

				<!-- Quick Actions -->
				<div class="flex items-center gap-2">
					<button
						class="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
					>
						<Calendar class="h-4 w-4" />
						Last 30 Days
						<ChevronDown class="h-4 w-4" />
					</button>
				</div>

				<!-- Status Filter -->
				<div class="relative">
					<select
						bind:value={statusFilter}
						class="appearance-none rounded-md border border-gray-300 bg-white py-2 pr-8 pl-3 focus:border-[#ff4d00] focus:ring-1 focus:ring-[#ff4d00] focus:outline-none"
					>
						<option>All Statuses</option>
						<option>Applied</option>
						<option>Interview</option>
						<option>Offer</option>
						<option>Rejected</option>
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
						<option>Frontend Developer</option>
						<option>Full Stack Engineer</option>
						<option>Backend Developer</option>
					</select>
					<ChevronDown class="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
				</div>
			</div>

			<!-- Applications Table -->
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-gray-200">
							<th class="px-4 py-3 text-left font-medium text-gray-600">Company</th>
							<th class="px-4 py-3 text-left font-medium text-gray-600">Position</th>
							<th class="px-4 py-3 text-left font-medium text-gray-600">Date Applied</th>
							<th class="px-4 py-3 text-left font-medium text-gray-600">Profile Used</th>
							<th class="px-4 py-3 text-left font-medium text-gray-600">Status</th>
							<th class="px-4 py-3 text-left font-medium text-gray-600">Contact</th>
							<!-- <th class="text-left py-3 px-4 font-medium text-gray-600">Actions</th> -->
						</tr>
					</thead>
					<tbody>
						{#each filteredApplications as application (application.id)}
							{@const StatusIcon = getStatusIcon(application.status)}
							<tr class="border-b border-gray-100 hover:bg-gray-50">
								<td class="px-4 py-4">
									<div class="flex items-center gap-2">
										<button
											onclick={() => handleCompanyVisit(application.company)}
											class="font-medium text-gray-900 hover:text-[#ff4d00] hover:underline"
										>
											{application.company}
										</button>
										<ExternalLink class="h-3 w-3 text-gray-400" />
									</div>
								</td>
								<td class="px-4 py-4 text-gray-600">{application.position}</td>
								<td class="px-4 py-4 text-gray-600">{application.dateApplied}</td>
								<td class="px-4 py-4 text-gray-600">{application.profileUsed}</td>
								<td class="px-4 py-4">
									<span
										class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium {getStatusColor(
											application.status
										)}"
									>
										<StatusIcon class="h-3 w-3" />
										{application.status}
									</span>
								</td>
								<td class="px-4 py-4">
									<a
										href="mailto:{application.contact}"
										class="flex items-center gap-1 text-sm text-gray-600 hover:text-[#ff4d00]"
									>
										<Mail class="h-3 w-3" />
										{application.contact}
									</a>
								</td>
								<!-- <td class="py-4 px-4">
									<button
										onclick={() => handleApplicationView(application.id)}
										class="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
									>
										<Eye class="h-3 w-3" />
										View
									</button>
								</td> -->
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
			<div class="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
				<p class="text-sm text-gray-600">
					Showing {filteredApplications.length} of {applications.length} applications
				</p>
				<div class="flex items-center gap-4 text-sm">
					<div class="flex items-center gap-1">
						<div class="h-2 w-2 rounded-full bg-blue-500"></div>
						<span class="text-gray-600"
							>Applied ({applications.filter((a) => a.status === 'Applied').length})</span
						>
					</div>
					<div class="flex items-center gap-1">
						<div class="h-2 w-2 rounded-full bg-yellow-500"></div>
						<span class="text-gray-600"
							>Interview ({applications.filter((a) => a.status === 'Interview').length})</span
						>
					</div>
					<div class="flex items-center gap-1">
						<div class="h-2 w-2 rounded-full bg-green-500"></div>
						<span class="text-gray-600"
							>Offer ({applications.filter((a) => a.status === 'Offer').length})</span
						>
					</div>
					<div class="flex items-center gap-1">
						<div class="h-2 w-2 rounded-full bg-red-500"></div>
						<span class="text-gray-600"
							>Rejected ({applications.filter((a) => a.status === 'Rejected').length})</span
						>
					</div>
				</div>
			</div>
		</div>

		<!-- Monthly Goals Progress -->
		<div class="rounded-lg border border-gray-200 bg-white p-6">
			<div class="mb-6 flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4d00]/10">
					<Target class="h-5 w-5 text-[#ff4d00]" />
				</div>
				<div>
					<h3 class="text-lg font-semibold text-gray-800">Monthly Goals Progress</h3>
					<p class="text-sm text-gray-600">Track your progress towards monthly application goals</p>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
				<!-- Applications Goal -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<h4 class="font-medium text-gray-800">Applications Goal ({applicationGoal})</h4>
						<span class="text-sm text-gray-600">{currentApplications}/{applicationGoal}</span>
					</div>
					<div class="h-3 w-full rounded-full bg-gray-200">
						<div
							class="h-3 rounded-full bg-[#ff4d00] transition-all duration-500"
							style="width: {applicationProgress}%"
						></div>
					</div>
					<p class="text-xs text-gray-500">
						{applicationGoal - currentApplications > 0
							? `${applicationGoal - currentApplications} more to reach goal`
							: 'Goal achieved! 🎉'}
					</p>
				</div>

				<!-- Interview Goal -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<h4 class="font-medium text-gray-800">Interview Goal ({interviewGoal})</h4>
						<span class="text-sm text-gray-600">{currentInterviews}/{interviewGoal}</span>
					</div>
					<div class="h-3 w-full rounded-full bg-gray-200">
						<div
							class="h-3 rounded-full bg-yellow-500 transition-all duration-500"
							style="width: {interviewProgress}%"
						></div>
					</div>
					<p class="text-xs text-gray-500">
						{interviewGoal - currentInterviews > 0
							? `${interviewGoal - currentInterviews} more to reach goal`
							: 'Goal exceeded! 🎉'}
					</p>
				</div>

				<!-- Offer Goal -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<h4 class="font-medium text-gray-800">Offer Goal ({offerGoal})</h4>
						<span class="text-sm text-gray-600">{currentOffers}/{offerGoal}</span>
					</div>
					<div class="h-3 w-full rounded-full bg-gray-200">
						<div
							class="h-3 rounded-full bg-green-500 transition-all duration-500"
							style="width: {offerProgress}%"
						></div>
					</div>
					<p class="text-xs text-gray-500">
						{offerGoal - currentOffers > 0
							? `${offerGoal - currentOffers} more to reach goal`
							: 'Goal exceeded! 🎉'}
					</p>
				</div>
			</div>
		</div>

		<!-- Main Content Grid -->
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Application Trends Chart (Left Column - 2/3 width) -->
			<div class="lg:col-span-2">
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<div class="mb-6 flex items-center justify-between">
						<div>
							<h3 class="text-lg font-semibold text-gray-800">Application Trends</h3>
							<p class="text-sm text-gray-600">
								Monthly breakdown of applications, interviews, and offers
							</p>
						</div>
					</div>

					<!-- Simple trend visualization -->
					<div class="space-y-4">
						{#each trendData as data, index}
							<div class="flex items-center gap-4">
								<div class="w-16 text-sm font-medium text-gray-600">{data.week}</div>
								<div class="flex-1 space-y-2">
									<!-- Applications bar -->
									<div class="flex items-center gap-2">
										<div class="w-20 text-xs text-gray-500">Applications</div>
										<div class="h-2 flex-1 rounded-full bg-gray-200">
											<div
												class="h-2 rounded-full bg-blue-500 transition-all duration-500"
												style="width: {(data.applications / 6) * 100}%"
											></div>
										</div>
										<div class="w-8 text-xs text-gray-600">{data.applications}</div>
									</div>
									<!-- Interviews bar -->
									<div class="flex items-center gap-2">
										<div class="w-20 text-xs text-gray-500">Interviews</div>
										<div class="h-2 flex-1 rounded-full bg-gray-200">
											<div
												class="h-2 rounded-full bg-yellow-500 transition-all duration-500"
												style="width: {(data.interviews / 6) * 100}%"
											></div>
										</div>
										<div class="w-8 text-xs text-gray-600">{data.interviews}</div>
									</div>
									<!-- Offers bar -->
									<div class="flex items-center gap-2">
										<div class="w-20 text-xs text-gray-500">Offers</div>
										<div class="h-2 flex-1 rounded-full bg-gray-200">
											<div
												class="h-2 rounded-full bg-green-500 transition-all duration-500"
												style="width: {(data.offers / 6) * 100}%"
											></div>
										</div>
										<div class="w-8 text-xs text-gray-600">{data.offers}</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Profile Usage & Insights (Right Column - 1/3 width) -->
			<div class="space-y-6">
				<!-- Profile Usage Distribution -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<div class="mb-4">
						<h3 class="text-lg font-semibold text-gray-800">Profile Usage Distribution</h3>
						<p class="text-sm text-gray-600">
							Which profiles are used most frequently for applications
						</p>
					</div>

					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="h-3 w-3 rounded-full bg-blue-500"></div>
								<span class="text-sm font-medium">Frontend Developer</span>
							</div>
							<span class="text-sm text-gray-600">45%</span>
						</div>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="h-3 w-3 rounded-full bg-green-500"></div>
								<span class="text-sm font-medium">Full Stack Engineer</span>
							</div>
							<span class="text-sm text-gray-600">35%</span>
						</div>
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<div class="h-3 w-3 rounded-full bg-purple-500"></div>
								<span class="text-sm font-medium">Backend Developer</span>
							</div>
							<span class="text-sm text-gray-600">20%</span>
						</div>
					</div>
				</div>

				<!-- Insights & Recommendations -->
				<div class="rounded-lg border border-gray-200 bg-white p-6">
					<div class="mb-4">
						<h3 class="text-lg font-semibold text-gray-800">Insights & Recommendations</h3>
					</div>

					<div class="space-y-4">
						{#each insights as insight}
							{@const IconComponent = insight.icon}
							<div class="flex gap-3 rounded-md bg-gray-50 p-3">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full bg-{insight.type ===
									'success'
										? 'green'
										: insight.type === 'warning'
											? 'yellow'
											: 'blue'}-100"
								>
									<IconComponent
										class="h-4 w-4 text-{insight.type === 'success'
											? 'green'
											: insight.type === 'warning'
												? 'yellow'
												: 'blue'}-600"
									/>
								</div>
								<div class="flex-1">
									<h4 class="text-sm font-medium text-gray-800">{insight.title}</h4>
									<p class="mt-1 text-xs text-gray-600">{insight.message}</p>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
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
