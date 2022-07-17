<script>
	import { homePageQuery, searchMatches } from '../stores';

	export let tags;

	function getMatches() {
		const parts = $homePageQuery.split(' ');
		const searchTarget = parts[parts.length - 1];

		let results = [];
		for (let i = 0; i < tags.length; i++) {
			if (tags[i].includes(searchTarget)) {
				results.push(tags[i]);
			}
			if (results.length >= 10) {
				break;
			}
		}

		searchMatches.set(results);
	}
</script>

<div>
	<form action="/search" method="GET">
		<div class="field has-addons">
			<div class="control">
				<input
					id="homepage-searchbar"
					class="input"
					on:input={(e) => {
						homePageQuery.set(e.target.value);
						getMatches();
					}}
					type="text"
					placeholder="Search for tagged posts"
          name="query"
				/>
			</div>
			<div class="control">
				<button type="submit" class="button is-success">
					<i class="fa-solid fa-magnifying-glass" />
				</button>
			</div>
		</div>
	</form>
</div>

<style>
	a {
		text-decoration: none;
	}
</style>
