<script lang="ts">
	import { SourceDisplayDtoReviewStatusEnum } from '$services/gen-client';
	import { Badge, Button, Input, Popover } from 'flowbite-svelte';
	import { MessageDotsOutline } from 'flowbite-svelte-icons';
	import { successStore } from '$lib/stores';
	import { getNiceTimeString } from '$lib/utils';
	import AuthorLink from './AuthorLink.svelte';
	import { reviewApi } from '$services/apiService';

	export let reviewStatus: SourceDisplayDtoReviewStatusEnum;
	export let sourceId: string;
	export let reviewHistory: string;
	export let afterReview: () => void = () => {};

	let id = `button-${Math.random().toString(36).substring(2, 9)}`;

	let newMessage = '';

	let bgForBar = 'bg-yellow-400';
	let placeholder = 'Čia galite parašyti žinutę...';

	async function reject() {
		if (!newMessage) {
			alert('Atmetant privaloma parašyti žinutę (priežastį)');
			return;
		}
		reviewApi.reject(sourceId, { reviewMessage: newMessage });
		successStore.set('Sėkmingai atmesta');
		bgForBar = 'bg-slate-400';
		afterReview();
	}

	async function approve() {
		reviewApi.approve(sourceId, { reviewMessage: newMessage });
		successStore.set('Sėkmingai patvirtinta');
		bgForBar = 'bg-slate-400';
		afterReview();
	}
</script>

<div class={`flex flex-row gap-4 ${bgForBar} p-2 rounded-t-md`}>
	{#if reviewStatus === SourceDisplayDtoReviewStatusEnum.Pending}
		<Badge color="yellow" class="ml-2">Peržiūrėkite</Badge>
	{/if}
	{#if reviewHistory !== ''}
		<Button {id} color="blue" class="p-2 mx-1 relative"><MessageDotsOutline /></Button>
		<Popover class="w-64 text-sm font-light " triggeredBy={`#${id}`} trigger="click">
			{#each reviewHistory
				.trim()
				.split('\n\n')
				.map((entry) => {
					const [timestamp, rest] = entry.trim().split(/ (.+)/); // Split into timestamp and the rest
					if (!rest) {
						console.error('Parsing error: ', entry);
						return { timestamp: 'Invalid Date', author: '', action: '', message: '' };
					}
					const [author, actionMessage] = rest.split(/ (.+)/);
					const [action, message] = actionMessage.split(':').map((s) => s.trim());
					return { timestamp, author: author.split(' ')[0], action, message };
				}) as entry}
				<p>
					{getNiceTimeString(entry.timestamp).substring(5, 16)}
					<AuthorLink author={entry.author} />
					{entry.action}{entry.message ? ': ' : ''}<strong
						>{entry.message ? entry.message : ''}</strong
					>
				</p>
			{/each}
		</Popover>
	{/if}
	<Input type="text" {placeholder} bind:value={newMessage} />
	<span class="flex flex-row">
		<Button color="green" disabled={bgForBar === 'bg-slate-400'} on:click={approve} class="p-2 mx-1"
			>Patvirtinti</Button
		>
		<Button color="red" disabled={bgForBar === 'bg-slate-400'} on:click={reject} class="p-2 mx-1"
			>Atmesti</Button
		>
	</span>
</div>
