export function formatDate(timestamp) {
	// Create a date object from the timestamp
	let date = new Date(timestamp);

	// Create a list of names for the months
	let months = [
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
		"December",
	];

	// return a formatted date
	return (
		months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
	);
}
