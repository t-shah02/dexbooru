<script lang="ts">
	import type { PageData } from './$types';
	import ProfileBar from '$lib/components/ProfileBar.svelte';

	export let data: PageData;

	const { targetUser, sameUser } = data;
	

</script>

<svelte:head>
	<title>Profile - {targetUser.username}</title>
</svelte:head>

<h3 class="profile-card-title center-align">Profile card</h3>
<article class="no-padding">
	<div class="grid no-space">
		<div class="s6">
			<img
				class="profile-card-img responsive"
				src={targetUser.profilePictureUrl}
				alt="full view for {targetUser.username}"
			/>
		</div>
		<div class="s6">
			<div class="padding">
				<h5>{targetUser.username}</h5>
				<p>
					<span class="bold">Date created:</span>
					<br />
					{targetUser.createdAt}
					
				</p>
			</div>
		</div>
	</div>
</article>

<ProfileBar {sameUser} />

<style>
	.profile-card-title {
		margin-bottom: 25px;
	}

	article {
		display: block;
		margin-left: auto;
		margin-right: auto;
		width: 500px;
	}

	.profile-card-img {
		object-fit: contain;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}
</style>
