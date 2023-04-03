function debounce(fn: Function, delay: number) {
	let id: NodeJS.Timeout | undefined;

	return (...args: string[]) => {
		if (id) {
			clearTimeout(id);
		} else {
			id = setTimeout(() => {
				fn(...args);
			}, delay);
		}
	};
}

export default debounce;
