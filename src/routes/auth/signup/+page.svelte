<script lang="ts">
	import type { ActionData } from './$types';
	import RegisterForm from '$lib/components/auth/RegisterForm.svelte';

	export let form: ActionData = {};
</script>

<RegisterForm errorMessage={form ? form.message : ''} />
