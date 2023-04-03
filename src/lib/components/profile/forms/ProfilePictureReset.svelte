<script lang="ts">
	import ProfileUpload from '$lib/components/auth/ProfileUpload.svelte';
</script>

<div
	class="m-5 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
>
	<form class="space-y-6" method="POST" enctype="multipart/form-data" action="?/profile">
		<h5 class="text-xl font-medium text-gray-900 dark:text-white">Change your profile picture</h5>
		<ProfileUpload onSettingsPage={true} />
		<button
			type="submit"
			class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>Update</button
		>
	</form>
</div>
