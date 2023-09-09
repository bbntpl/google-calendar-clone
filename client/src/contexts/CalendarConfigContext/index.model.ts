import { Dispatch, RefObject, SetStateAction } from 'react';
import { ScheduleType, SelectedSchedule } from '../StoreContext/types/schedule';

export type CalendarUnits = 'day' | 'week' | 'month' | 'fourDays';

export interface DateUnits {
	year: number
	month: number | string
	day: number | string
}

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

export interface ContextState {
	selectedCalendarUnit: CalendarUnits
	selectedSchedule: SelectedSchedule
	selectedDate: DateUnits
	defaultDateTime: DefaultDateTime
	selectedScheduleType: ScheduleType;
	scheduleDialogRef: RefObject<HTMLDivElement | null>
	isScheduleDialogVisible: boolean
}

export interface DispatchContextState {
	setSelectedCalendarUnit: Dispatch<SetStateAction<CalendarUnits>>
	setSelectedSchedule: Dispatch<SetStateAction<SelectedSchedule>>
	setSelectedDate: Dispatch<SetStateAction<DateUnits>>
	setDefaultDateTime: Dispatch<SetStateAction<DefaultDateTime>>
	setSelectedScheduleType: Dispatch<SetStateAction<ScheduleType>>
	setIsScheduleDialogVisible: Dispatch<SetStateAction<boolean>>
}