import { ColorOption } from '../../../util/color-options';
import {
	ExtractPayload,
	UserAction,
	UserActionAddMultiplePayload,
} from '../index.model';

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
	region: string
}

export type Calendar = CalendarItem | HolidayCalendarItem;

type CalendarId = {
	id: Calendar['id'];
}

export type CalendarPayloads = ExtractPayload<CalendarListActions>;

export type CalendarListActions =
	| { type: UserAction.ADD, payload: Calendar }
	| { type: UserAction.ADD_MULTIPLE, payload: UserActionAddMultiplePayload }
	| { type: UserAction.EDIT, payload: Calendar | Partial<Calendar> }
	| { type: UserAction.REMOVE, payload: CalendarId }
	| { type: UserAction.REMOVE_MULTIPLE, payload: CalendarId[] }
	| { type: UserAction.CLEAR }
	| { type: UserAction.REPLACE_ALL, payload: Calendar[] }