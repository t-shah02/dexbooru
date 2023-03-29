const REPLACE_CHARS = ['\n', '\r', '\\'];

export function cleanQueryResult(query: string) {
	let cleanedQuery = query.trim().toLocaleLowerCase();

	for (const REPLACE_CHAR of REPLACE_CHARS) {
		cleanedQuery = cleanedQuery.replaceAll(REPLACE_CHAR, '');
	}

	return cleanedQuery;
}
