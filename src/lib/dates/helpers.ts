export function prettifyDate(date: Date) {
	const ymdFormat = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
	const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
	const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
	const timeStampFormat = `${hours}:${minutes}`;

	return `${ymdFormat} ${timeStampFormat}`;
}
