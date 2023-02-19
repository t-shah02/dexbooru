import type { Post, PostFilters } from '$lib/interfaces/posts';

const deepCopyObject = (target: object[] | object): object | object[] => {
	if (Array.isArray(target)) {
		const arrayCopy = [];

		for (const item of target) {
			if (typeof item === 'object') {
				arrayCopy.push(deepCopyObject(item));
			} else {
				arrayCopy.push(item);
			}
		}

		return arrayCopy;
	}

	const objectCopy: { [key: string]: object | object[] } = {};
	for (const [k, v] of Object.entries(target)) {
		if (typeof v === 'object') {
			objectCopy[k] = deepCopyObject(v);
		} else {
			objectCopy[k] = v;
		}
	}

	return objectCopy;
};

function compareUploaders(postOne: Post, postTwo: Post) {
	const u1 = postOne.authorName.toLocaleUpperCase();
	const u2 = postTwo.authorName.toLocaleUpperCase();

	if (u1 === u2) return 0;
	if (u1 < u2) return -1;
	return 1;
}

function compareDates(postOne: Post, postTwo: Post) {
	const d1 = Date.parse(postOne.date.toString());
	const d2 = Date.parse(postTwo.date.toString());

	if (d1 === d2) return 0;
	if (d1 < d2) return -1;
	return 1;
}

function compareViews(postOne: Post, postTwo: Post) {
	const v1 = postOne.views;
	const v2 = postTwo.views;

	if (v1 === v2) return 0;
	if (v1 < v2) return -1;
	return 1;
}

export function generatePostArrangements(posts: Post[]): PostFilters {
	const dateIncreasing = Array.from(posts.sort(compareDates));
	const dateDecreasing = Array.from(dateIncreasing).reverse();

	const viewsIncreasing = Array.from(posts.sort(compareViews));
	const viewsDecreasing = Array.from(viewsIncreasing).reverse();

	const uploaderIncreasing = Array.from(posts.sort(compareUploaders));
	const uploaderDecreasing = Array.from(uploaderIncreasing).reverse();

	return {
		views: {
			increasing: viewsIncreasing,
			decreasing: viewsDecreasing
		},
		uploader: {
			increasing: uploaderIncreasing,
			decreasing: uploaderDecreasing
		},
		date: {
			increasing: dateIncreasing,
			decreasing: dateDecreasing
		}
	};
}
