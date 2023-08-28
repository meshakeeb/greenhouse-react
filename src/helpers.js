const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
]

export function normalizeTitle( rawTitle ) {
	const out = {}
	const parts = rawTitle.split('; ')
	const title = parts[0].split(' - ')
	const dates = parts[1].split(' - ')

	const d1 = new Date(dates[0].substr(0,10))
	const d2 = new Date(dates[1].substr(0,10))
	const options = { month:"long", day:"numeric", year: "numeric"}
	const formatter = new Intl.DateTimeFormat('en-US', options)

	out.title = title[0]
	out.date = formatter.format(d1) + ' - ' + formatter.format(d2)

	return out
}
