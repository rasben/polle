import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

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
	const dataDir = path.join(process.cwd(), `data/${id}`);
	console.error(`dataDir: ${dataDir}`)

	mkdir(dataDir, { recursive: true }).catch(console.error);

	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	const dateID = `${year}-${month}-${day}`;

	return `${dataDir}/${dateID}.json`;
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

		console.error(data);
		console.error('pre write');
		await writeFile(fileName, JSON.stringify(data));
		console.error('post write');
	}

	return data as PollData;
}


export async function updatePollData(voteData: VoteData) {
	const fileName = getFileName(voteData.pollID);
	console.error(fileName);

	const pollData = await getPollData(voteData.pollID);

	const value = +(voteData.value);

	pollData.total_votes += +1;
	pollData.total_rating += +value.toFixed(1);

	const average_rating = pollData.total_rating / pollData.total_votes;

	pollData.average_rating = +average_rating.toFixed(1);

	await writeFile(fileName, JSON.stringify(pollData));

	return pollData;
}
