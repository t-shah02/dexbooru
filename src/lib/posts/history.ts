import type { History } from '$lib/interfaces/posts';

// localStorage helper functions

export function addPost(postID: string) {
	const history: History = JSON.parse(localStorage.getItem('history') || '[]');

	const historyItemID = crypto.randomUUID();
	history.push({
		postID,
		historyItemID,
		time: new Date(Date.now())
	});

	localStorage.setItem('history', JSON.stringify(history));
}

export function removePost(historyItemID: string) {
	const history: History = JSON.parse(localStorage.getItem('history') || '[]');

	const filteredHistory = history.filter((item) => item.historyItemID !== historyItemID);

	localStorage.setItem('history', JSON.stringify(filteredHistory));
}

export function getHistory() {
	const history: History = JSON.parse(localStorage.get('history') || '[]');

	history.forEach((historyItem) => (historyItem.time = new Date(historyItem.time)));

	return history;
}
