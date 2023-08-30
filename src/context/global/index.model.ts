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
export type CalendarType = 'day' | 'week' | 'month' | 'fourDays';

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
export interface CalendarLabelType {
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
export type ScheduleActionTypes =
	| { type: UserActionType.ADD, payload: ScheduleTypes }
	| { type: UserActionType.EDIT, payload: SchedulePayload | Partial<ScheduleTypes> }
	| { type: UserActionType.REMOVE, payload: number };
export type CalendarListActionTypes =
	| { type: UserActionType.ADD, payload: CalendarLabelType }
	| { type: UserActionType.EDIT, payload: CalendarLabelType | Partial<CalendarLabelType> }
	| { type: UserActionType.REMOVE, payload: number };

export default interface GlobalContextInterface {
	calendarType: CalendarType;
	setCalendarType: Dispatch<SetStateAction<CalendarType>>;
	savedSchedules: Array<ScheduleTypes> | [];
	dispatchSchedules: Dispatch<ScheduleActionTypes>;
	calendarList: Array<CalendarLabelType> | [];
	dispatchCalendarList: Dispatch<CalendarListActionTypes>;
	notifications?: Array<Notification> | [];
	setNotifications?: () => Dispatch<SetStateAction<Notification>>;
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
	scheduleDialogRef: RefObject<HTMLElement | null>;
	isScheduleDialogVisible: boolean;
	setIsScheduleDialogVisible: Dispatch<SetStateAction<boolean>>;
	selectedScheduleType: ScheduleTypeNames;
	setSelectedScheduleType: Dispatch<SetStateAction<ScheduleTypeNames>>;
}