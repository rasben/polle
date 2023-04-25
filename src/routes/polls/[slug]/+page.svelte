<script lang="ts">
	import { onMount, setContext } from 'svelte';

	export let data;
	export let pollData;

	export async function getPollDataWeb(id: string) {
		const response = await fetch(`/api/vote?id=${id}`);

		const responseData = await response.json();

		return responseData?.pollData;
	}

	onMount(async () => {
		/*
		pollData = await getPollDataWeb(data.slug);

		setInterval(async () => {
			pollData = await getPollDataWeb(data.slug);
		}, 5000);
		*/
	});

	let loading = false;

	async function vote(event) {
		event.preventDefault();

		loading = true;

		const formData = new FormData(event.target);

		const voteData = {
			pollID: data.slug,
			value: formData.get('vote')
		};

		const response = await fetch('/api/vote', {
			method: 'POST',
			body: JSON.stringify(voteData),
			headers: {
				'content-type': 'application/json'
			}
		});

		pollData = await response.json();

		loading = false;
	}

</script>

<main>
	<h1>Rate this poll:</h1>
	<form class="my-6" on:submit|preventDefault={vote}>
		<div class="flex">
			<label>
				<input class="radio" type="radio" name="vote" value="1" />
				<p>😡</p>
			</label>

			<label>
				<input class="radio" type="radio" name="vote" value="2" />
				<p>🙁</p>
			</label>

			<label>
				<input class="radio" type="radio" name="vote" value="3" />
				<p>🫤</p>
			</label>

			<label>
				<input class="radio" type="radio" name="vote" value="4" />
				<p>😊</p>
			</label>

			<label>
				<input class="radio" type="radio" name="vote" value="5" />
				<p>😍</p>
			</label>
		</div>

		<button class="btn variant-filled-secondary" disabled={loading} type="submit">
			<span>:)</span>
		</button>

		<div>
			<h2>Current results:</h2>
			<p>Total votes: {pollData?.total_votes}</p>
			<p>Average rating: {pollData?.average_rating.toFixed(2)}</p>
		</div>

	</form>
</main>
