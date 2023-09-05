import { Dispatch } from 'react'

import { Calendar, CalendarListActions } from './types/calendar'
import { Schedule, ScheduleActions } from './types/schedule'

export enum UserAction {
	ADD = 'ADD',
	EDIT = 'EDIT',
	REMOVE = 'REMOVE'
}

export interface ContextState {
	savedSchedules: Array<Schedule> | []
	calendars: Array<Calendar> | []
	filteredSchedules: Array<Schedule> | []
}

export interface DispatchContextState {
	dispatchSchedules: Dispatch<ScheduleActions>
	dispatchCalendars: Dispatch<CalendarListActions>
}