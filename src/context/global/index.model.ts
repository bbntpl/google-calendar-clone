import { Dispatch, MutableRefObject, SetStateAction } from 'react';

export type CalendarType = 'day' | 'week' | 'month' | 'fourDays';
export type ScheduleNames = 'task' | 'event';
export type COLORS = 'black' | 'basil' | 'blueberry' | 'citron' | 'raddichio' | 'tangerine' | 'grafito';
export type NonOptionalKeys<T> = {
	[k in keyof T]-?: undefined extends T[k] ? never : k
}[keyof T];

export interface DateTimeInputInterface {
	allDay: boolean,
	once: boolean,
	date: string,
	time: string,
	timezone?: string,
}

type OmitScheduleProps
	= Omit<TaskInterface | EventInterface, 'dateTime' | 'calendarId'>;
// interface ScheduleReqToOpt {
// 	dateTime?: DateTimeInputInterface,
// 	calendarId?: string,
// } 
export interface Schedule {
	id: number,
	description?: string,
	calendarId: number,
	dateTime: DateTimeInputInterface,
	type: ScheduleNames,
}

export interface EventInterface extends Schedule {
	location?: string,
}

export interface EditEvent extends OmitScheduleProps {
	dateTime?: DateTimeInputInterface,
	calendarId?: string,
}

export interface TaskInterface extends Schedule {
	completed?: boolean,
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
	defaultDate: string,
	defaultTimeIndex: number,
	setDefaultDate: Dispatch<SetStateAction<string>>,
	setDefaultTimeIndex: Dispatch<SetStateAction<number>>,
	evtRef: MutableRefObject<HTMLDivElement | null>,
	tskRef: MutableRefObject<HTMLDivElement | null>,
	isEvtDialogVisible: boolean,
	isTskDialogVisible: boolean,
	setIsEvtDialogVisible: Dispatch<SetStateAction<boolean>>,
	setIsTskDialogVisible: Dispatch<SetStateAction<boolean>>,
}

export default GlobalContextInterface;
