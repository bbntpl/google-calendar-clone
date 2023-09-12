import { ColorOption } from '../../../util/color-options';
import { CalendarType } from './calendar';
import { ExtractPayload, UserAction, UserActionAddMultiplePayload, UserActionAddPayload } from '../index.model';
import { DateTimeInputs } from '../../CalendarConfigContext/index.model';

export interface BaseSchedule {
	id: number;
	title: string;
	description: string;
	calendarId: number;
	calendarType: CalendarType;
	dateTime: DateTimeInputs;
	type: ScheduleType;
	isExternal?: boolean;
}

export interface Event extends BaseSchedule {
	location: string;
	colorOption: ColorOption;
}

export interface Task extends BaseSchedule {
	completed: boolean;
}

export type Schedule = Event | Task;
export type ScheduleType = 'task' | 'event';
export type SingleTypedScheduleOnArray = Array<Event> | Array<Task>;
export type SelectedSchedule = Schedule | null | undefined;
export type SchedulePayload = EditEvent | EditTask;

type OmitScheduleProps
	= Omit<Schedule, 'dateTime' | 'calendarId'>;

export interface EditEvent extends OmitScheduleProps {
	dateTime?: DateTimeInputs;
	calendarId?: string;
}

export interface EditTask extends OmitScheduleProps {
	dateTime?: DateTimeInputs;
	calendarId?: string;
}

export type ScheduleId = {
	id: Schedule['id']
}

export type SchedulePayloads = ExtractPayload<ScheduleActions>

export type ScheduleActions =
	| { type: UserAction.ADD, payload: UserActionAddPayload }
	| { type: UserAction.ADD_MULTIPLE, payload: UserActionAddMultiplePayload }
	| { type: UserAction.EDIT, payload: SchedulePayload | Partial<Schedule> }
	| { type: UserAction.REMOVE, payload: ScheduleId }
	| { type: UserAction.REMOVE_MULTIPLE, payload: ScheduleId[] }
	| { type: UserAction.CLEAR }
	| { type: UserAction.REPLACE_ALL, payload: Schedule[] }