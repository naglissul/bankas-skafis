<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
</script>

<h1 class="text-4xl font-semibold my-4 text-center">Bonjour, Naglis!</h1>
<div class="flex gap-4 w-3/4 justify-center mx-auto my-8">
	<div class="flex gap-4 justify-evenly flex-wrap w-full">
		<Button class="flex-grow" on:click={() => goto('/super-admin/manage-categories')}
			>Manage firestore categories</Button
		>
	</div>
</div>
