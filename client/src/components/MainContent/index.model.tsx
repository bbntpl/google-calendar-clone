import { calendar_v3 } from '@googleapis/calendar/build/v3';

export interface SelectedHoliday {
  calendarId: number;
  region: string;
}

export interface ExternalHolidayCalendar {
	calendarId: number;
	events: calendar_v3.Schema$Events[]
}

export interface ExternalHolidayEvent extends calendar_v3.Schema$Event {
  calendarId: number
}