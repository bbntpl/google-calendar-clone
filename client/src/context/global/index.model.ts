import { Dispatch, RefObject, SetStateAction } from 'react';
import { ColorOption } from '../../themes/data';
import React from 'react';

// Reusable types
export type NonOptionalKeys<T> = {
	[k in keyof T]-?: undefined extends T[k] ? never : k
}[keyof T];
export declare type SetState<T> = Dispatch<SetStateAction<T>>;
export interface Position {
	x: number;
	y: number;
}
export interface BooleansOnlyObj {
	[key: string]: boolean
}
export type CalendarUnits = 'day' | 'week' | 'month' | 'fourDays';
export type ElementsToRef = HTMLDivElement;

/*** DATE & TIME ***/
type DateUnitKeys = 'year' | 'month' | 'day';
type TimeUnitKeys = 'hours' | 'minutes' | 'timezone';
type FullDateComponentKeys = DateUnitKeys | TimeUnitKeys;
export interface DateUnits {
	year: number;
	month: number | string;
	day: number | string
}
export type FullDateUnits = { [key in FullDateComponentKeys]: number | string }
export interface TimeSetting {
	start: number;
	end: number | never;
}
export interface DateTimeInputs extends DefaultDateTime {
	allDay: boolean;
	once: boolean;
	timezone?: string | never;
}
export interface DefaultDateTime {
	date: string; //YYYYMMDD format
	time: TimeSetting;
}

/*** SCHEDULE ***/
// remove calendar id and date components
type OmitScheduleProps
	= Omit<TaskInterface | EventInterface, 'dateTime' | 'calendarId'>;

export type ScheduleTypeNames = 'task' | 'event';
export type ScheduleTypes = EventInterface | TaskInterface;
export type SchedulePayload = EditEvent | EditTask;
export type ScheduleTypesOnArray = Array<EventInterface> | Array<TaskInterface>
export interface Schedule {
	id: number;
	title: string;
	description: string;
	calendarId: number;
	dateTime: DateTimeInputs;
	type: ScheduleTypeNames;
}
export interface EventInterface extends Schedule {
	location: string;
	colorOption: ColorOption;
}
export interface TaskInterface extends Schedule {
	completed: boolean;
}
export interface HolidayEvent extends Schedule {
	location: string;
}
export interface HolidayCalendar {
	name: string
	description: string
	timeZone: string
	events: Array<HolidayEvent>
}

export type OtherCalendars = HolidayCalendar;

export interface EditEvent extends OmitScheduleProps {
	dateTime?: DateTimeInputs;
	calendarId?: string;
}
export interface EditTask extends OmitScheduleProps {
	dateTime?: DateTimeInputs;
	calendarId?: string;
}
export type SelectedSchedule = ScheduleTypes | null | undefined;

/*** CALENDAR ***/
export interface CalendarItem {
	id: number;
	name: string;
	selected: boolean;
	removable: boolean;
	colorOption: ColorOption;
}

export interface Notification {
	minute: number;
	scheduleId: number;
}

/*** USER ACTIONS ***/

// enumerated action types
export enum UserActionType {
	ADD = 'ADD',
	EDIT = 'EDIT',
	REMOVE = 'REMOVE'
}

// dispatch action types
export type ScheduleActions =
	| { type: UserActionType.ADD, payload: ScheduleTypes }
	| { type: UserActionType.EDIT, payload: SchedulePayload | Partial<ScheduleTypes> }
	| { type: UserActionType.REMOVE, payload: number };
export type CalendarListActions =
	| { type: UserActionType.ADD, payload: CalendarItem }
	| { type: UserActionType.EDIT, payload: CalendarItem | Partial<CalendarItem> }
	| { type: UserActionType.REMOVE, payload: number };

export default interface GlobalContextInterface {
	selectedCalendarUnit: CalendarUnits;
	setSelectedCalendarUnit: Dispatch<SetStateAction<CalendarUnits>>;
	savedSchedules: Array<ScheduleTypes> | [];
	dispatchSchedules: Dispatch<ScheduleActions>;
	calendarList: Array<CalendarItem> | [];
	dispatchCalendarList: Dispatch<CalendarListActions>;
	notifications?: Array<Notification> | [];
	setNotifications?: () => Dispatch<SetStateAction<Notification>>;
	otherCalendarList: Array<OtherCalendars> | [];
	setOtherCalendarList: Dispatch<SetStateAction<Array<OtherCalendars> | []>>
	filteredSchedules: Array<ScheduleTypes> | [];
	selectedSchedule: SelectedSchedule;
	setSelectedSchedule: Dispatch<SetStateAction<SelectedSchedule>>;
	selectedDate: DateUnits;
	setSelectedDate: Dispatch<SetStateAction<DateUnits>>;
	visibilities: BooleansOnlyObj;
	setVisibilities: Dispatch<SetStateAction<BooleansOnlyObj>>;
	position: Position;
	recordPos: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
	defaultDateTime: DefaultDateTime;
	setDefaultDateTime: Dispatch<SetStateAction<DefaultDateTime>>;
	scheduleDialogRef: RefObject<HTMLDivElement | null>;
	isScheduleDialogVisible: boolean;
	setIsScheduleDialogVisible: Dispatch<SetStateAction<boolean>>;
	selectedScheduleType: ScheduleTypeNames;
	setSelectedScheduleType: Dispatch<SetStateAction<ScheduleTypeNames>>;
}