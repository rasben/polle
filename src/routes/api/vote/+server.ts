import { VoteData, updatePollData } from "$lib/db"

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const voteData = await request.json() as VoteData;

    const pollData = await updatePollData(voteData);

    return json(pollData);
}
