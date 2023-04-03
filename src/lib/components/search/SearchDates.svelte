<script lang="ts">
	import { search } from '$lib/stores/searchStores';
	import Flatpickr from 'svelte-flatpickr';

	const onStartDateChange = (event: CustomEvent) => {
		const [dates, dateStr]: [Date[], string] = event.detail;

		if (dates.length) {
			const newSearchQuery = { ...$search };
			newSearchQuery.startDate = dateStr;

			search.set(newSearchQuery);
		}
	};

	const onEndDateChange = (event: CustomEvent) => {
		const [dates, dateStr]: [Date[], string] = event.detail;

		if (dates.length) {
			const newSearchQuery = { ...$search };
			newSearchQuery.endDate = dateStr;

			search.set(newSearchQuery);
		}
	};

	const onExactDateChange = (event: CustomEvent) => {
		const [dates, dateStr]: [Date[], string] = event.detail;

		if (dates.length) {
			const newSearchQuery = { ...$search };
			newSearchQuery.exactDate = dateStr;

			search.set(newSearchQuery);
		}
	};
</script>

<div class="flex flex-col space-y-4">
	<Flatpickr on:change={onStartDateChange} placeholder="Post upload start date" />
	<Flatpickr on:change={onEndDateChange} placeholder="Post upload end date" />
	<Flatpickr on:change={onExactDateChange} placeholder="Post upload exact date" />

	<input type="hidden" name="startDate" value={$search.startDate || ''} />
	<input type="hidden" name="endDate" value={$search.endDate || ''} />
	<input type="hidden" name="exactDate" value={$search.exactDate || ''} />
</div>

<style>
	div {
		width: 50%;
	}
</style>
