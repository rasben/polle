import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

export interface PollData {
	total_votes: number;
	total_rating: number;
	average_rating: number;
}

export interface VoteData {
	pollID: string;
	value: number|string;
}

function getFileName(id: string): string {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	const dateID = `${year}-${month}-${day}`;

	return `data/${id}/${dateID}.json`;
}

export async function getPollData(id: string) {
	const fileName = getFileName(id);

	let data;

	if (existsSync(fileName)) {
		data = await readFile(fileName, 'utf8');
		data = JSON.parse(data) as PollData;
	} else {
		data = {
			total_votes: 0,
			total_rating: 0,
			average_rating: 0
		};

		await writeFile(fileName, JSON.stringify(data));
	}

	return data as PollData;
}


export async function updatePollData(voteData: VoteData) {
	const fileName = getFileName(voteData.pollID);

	const pollData = await getPollData(voteData.pollID);

	const value = +(voteData.value);

	pollData.total_votes += +1;
	pollData.total_rating += +value.toFixed(1);

	const average_rating = pollData.total_rating / pollData.total_votes;

	pollData.average_rating = +average_rating.toFixed(1);

	await writeFile(fileName, JSON.stringify(pollData));

	return pollData;
}
