import { ColorOption } from '../../../util/color-options';
import { UserAction } from '../index.model';

export type CalendarType = 'default' | 'holiday';
export interface CalendarItem {
	id: number
	name: string
	selected: boolean
	removable: boolean
	colorOption: ColorOption
	type: CalendarType
}

export interface HolidayCalendarItem extends CalendarItem {
	description: string
	timeZone: string
}

export type Calendar = CalendarItem | HolidayCalendarItem;

type CalendarId = {
	id: Calendar['id'];
}

export type CalendarListActions =
	| { type: UserAction.ADD, payload: Calendar }
	| { type: UserAction.EDIT, payload: Calendar | Partial<Calendar> }
	| { type: UserAction.REMOVE, payload: CalendarId };