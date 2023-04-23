import { readFile, writeFile, access } from 'fs/promises';
import { existsSync } from 'fs';

export interface PollData {
    'total_votes': number,
    'total_rating': number,
    'average_rating': number
}

export interface VoteData {
    'pollID': string,
    'value': number,
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
        data = JSON.parse(data) as PollData
    }
    else {
        data = {
            total_votes: 0,
            total_rating: 0,
            average_rating: 0
        }

        await writeFile(fileName, JSON.stringify(data));
    }

    return data as PollData;
}

export async function updatePollData(voteData: VoteData) {
    const fileName = getFileName(voteData.pollID);

    const pollData = await getPollData(voteData.pollID);

    pollData.total_votes += +1;
    pollData.total_rating += +voteData.value;
    pollData.average_rating = (pollData.total_rating / pollData.total_votes);

    await writeFile(fileName, JSON.stringify(pollData));

    return pollData;
}
