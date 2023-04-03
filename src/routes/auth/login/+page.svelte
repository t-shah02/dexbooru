<script lang="ts">
	import LoginForm from '$lib/components/auth/LoginForm.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData = {};
</script>

<LoginForm errorMessage={form ? form.message : ''} />
