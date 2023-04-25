import { VoteData, updatePollData, getPollData } from '$lib/db';

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const voteData = (await request.json()) as VoteData;

	const pollData = await updatePollData(voteData);

	return json(pollData);
}

export async function GET({ params, url }) {
	const pollID = url.searchParams.get('id');

	if (!pollID || typeof pollID !== 'string') {
		// todo  status is not set correctly.
		return {
			status: 400,
			body: { message: 'Invalid poll ID' },
		};
	}

	try {
		const pollData = await getPollData(pollID);
		// todo  status is not set correctly.
		return json({
			status: 200,
			pollData: pollData,
		});
	} catch (error) {
		console.error(error);
		// todo  status is not set correctly.
		return json({
			status: 500,
			body: { message: 'Error fetching poll data' },
		});
	}
}
