export function normalizeTitle( rawTitle ) {
	let title = rawTitle.split(' - ')
	title.pop()

	return title.join( ' - ')
}
