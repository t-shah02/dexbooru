<script lang="ts">
	export let heading: string;
	export let subHeading: string;
	export let imageSource: string | null = null;
	export let redirectLink: string | null = null;
	export let redirectLinkText: string | null = null;
</script>

<section class="bg-white dark:bg-gray-900">
	<div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
		<div class="mx-auto max-w-screen-sm text-center">
			<h1
				class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-900 text-primary-600 dark:text-primary-500 dark:text-white"
			>
				{heading}
			</h1>
			<p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
				{subHeading}
			</p>
			{#if redirectLink && redirectLinkText}
				<a
					href={redirectLink}
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
					>{redirectLinkText}</a
				>
			{/if}
		</div>
	</div>
</section>
