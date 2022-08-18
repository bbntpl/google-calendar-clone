import { Dispatch, MutableRefObject, SetStateAction } from 'react';

export type CalendarType = 'day' | 'week' | 'month' | 'fourDays';
export type ScheduleNames = 'task' | 'event';
export type COLORS = 'black' | 'basil' | 'blueberry' | 'citron' | 'raddichio' | 'tangerine' | 'grafito';
export type NonOptionalKeys<T> = {
	[k in keyof T]-?: undefined extends T[k] ? never : k
}[keyof T];

interface TimeSetting {
	start: number
	end: number | never
}

export interface DateTimeInputInterface {
	allDay: boolean,
	once: boolean,
	date: string, //YYYYMMDD format
	time: TimeSetting,
	timezone?: string | never,
}

export interface DefaultDateTime {
	date: string, //YYYYMMDD format
	time: TimeSetting,
}

type OmitScheduleProps
	= Omit<TaskInterface | EventInterface, 'dateTime' | 'calendarId'>;

export interface Schedule {
	id: number,
	title: string,
	description: string,
	calendarId: number,
	dateTime: DateTimeInputInterface,
	type: ScheduleNames,
}

export interface EventInterface extends Schedule {
	location: string,
	color: COLORS,
}

export interface EditEvent extends OmitScheduleProps {
	dateTime?: DateTimeInputInterface,
	calendarId?: string,
}

export interface TaskInterface extends Schedule {
	completed: boolean,
}

export interface EditTask extends OmitScheduleProps {
	dateTime?: DateTimeInputInterface,
	calendarId?: string,
}
export interface CalendarLabelType {
	id: number,
	name: string,
	selected: boolean,
	removable: boolean,
	color: COLORS
}

export interface SelectedDate {
	year: number,
	month: number,
	day: number,
	hours?: number,
	minutes?: number,
}

export interface Position {
	x: number,
	y: number,
}

export interface Notification {
	minute: number,
	scheduleId: number,
}

export type ScheduleTypes = EventInterface | TaskInterface;
export type SchedulePayload = EditEvent | EditTask;
export type ArrOfScheduleTypes = Array<EventInterface> | Array<TaskInterface>

export enum UserActionType {
	ADD = 'ADD',
	EDIT = 'EDIT',
	REMOVE = 'REMOVE'
}

export interface BooleansOnlyObj {
	[key: string]: boolean
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

export interface GlobalContextInterface {
	calendarType: CalendarType,
	setCalendarType: Dispatch<SetStateAction<CalendarType>>,
	savedSchedules: Array<ScheduleTypes> | [],
	dispatchSchedules: Dispatch<ScheduleActionTypes>,
	calendarList: Array<CalendarLabelType> | [],
	dispatchCalendarList: Dispatch<CalendarListActionTypes>,
	notifications?: Array<Notification> | [],
	setNotifications?: () => Dispatch<SetStateAction<Notification>>,
	filteredSchedules: Array<ScheduleTypes> | [],
	selectedSchedule?: ScheduleTypes,
	selectedDate: SelectedDate, // timestamp,
	setSelectedDate: Dispatch<SetStateAction<SelectedDate>>, // returning timestamp
	visibilities: BooleansOnlyObj,
	setVisibilities: Dispatch<SetStateAction<BooleansOnlyObj>>,
	position: Position,
	recordPos: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
	defaultDateTime: DefaultDateTime,
	setDefaultDateTime: Dispatch<SetStateAction<DefaultDateTime>>,
	scheduleDialogRef: MutableRefObject<HTMLDivElement | null>,
	isScheduleDialogVisible: boolean,
	setIsScheduleDialogVisible: Dispatch<SetStateAction<boolean>>,
	selectedScheduleType: ScheduleNames,
	setSelectedScheduleType: Dispatch<SetStateAction<ScheduleNames>>
}

export default GlobalContextInterface;
