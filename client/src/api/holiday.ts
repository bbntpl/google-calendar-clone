export async function getHolidayEvents() {
	const holidayApiUrl = process.env.REACT_APP_HOLIDAY_API_URL;
	if (!holidayApiUrl) {
		throw new Error('REACT_APP_HOLIDAY_API_URL env var not set.');
	}

	try {
		const response = await fetch(holidayApiUrl);
		const data = await response.json();

		return data;
	} catch (error) {
		console.error('Error fetching holiday events:', error);
		throw error;
	}
}