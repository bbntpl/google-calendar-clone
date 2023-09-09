import { calendar_v3 } from '@googleapis/calendar';
import { CalendarType } from '../contexts/StoreContext/types/calendar';
import { ScheduleType } from '../contexts/StoreContext/types/schedule';
import { DateTimeInputs } from '../contexts/CalendarConfigContext/index.model';

import { uniqueID } from '../util/reusable-funcs';
import { getRandomColorOption } from '../util/color-options';

import { ExternalHolidayEvent } from '../components/MainContent/index.model';

interface ConvertExternalEventsToCalendarProps {
	holidayCalendar: calendar_v3.Schema$Events
	calendarId: number
	regionCode: string
}

export async function getHolidayEventsByRegion(region: string) {
	const holidayApiUrl = `${process.env.REACT_APP_HOLIDAY_API_URL}/${region}`;
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

export function convertExternalEventsToCalendar(props: ConvertExternalEventsToCalendarProps) {
	const { holidayCalendar, regionCode, calendarId } = props;
	const {
		summary,
		timeZone,
		description,
	} = holidayCalendar;

	return {
		id: calendarId,
		name: summary || '',
		colorOption: getRandomColorOption(),
		selected: true,
		removable: true,
		type: 'holiday' as CalendarType,
		timeZone: timeZone || '',
		description: description || '',
		region: regionCode,
	}
}

// Extract values from holiday event properties and
// set it as values for holiday schedule event
export function convertExternalEventToSchedule(
	externalEvent: ExternalHolidayEvent,
) {
	let date, locationName: string = '';

	if (externalEvent.organizer && externalEvent.organizer.displayName) {
		const calendarName = externalEvent.organizer.displayName;
		const splitResult = calendarName.split(' in ');
		if (splitResult.length > 1) {
			locationName = splitResult[1].trim();
		}
	}

	if (externalEvent.start && externalEvent.start.date) {
		const [year, month, day] = externalEvent.start.date.split('-');
		date = `${year}${month}${day}`;
	}

	return {
		id: uniqueID(),
		title: externalEvent.summary || '',
		description: externalEvent.description || '',
		calendarId: externalEvent.calendarId,
		calendarType: 'holiday' as CalendarType,
		dateTime: {
			allDay: false,
			once: true,
			date,
			time: { start: -1, end: -1 },
		} as DateTimeInputs,
		type: 'event' as ScheduleType,
		isExternal: true,
		location: locationName,
		colorOption: getRandomColorOption(),
	}
}