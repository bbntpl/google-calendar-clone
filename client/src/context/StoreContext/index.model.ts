import { Dispatch } from 'react'

import { Calendar, CalendarListActions } from './types/calendar'
import { Schedule, ScheduleActions } from './types/schedule'

export enum UserAction {
	ADD = 'ADD',
	ADD_MULTIPLE = 'ADD_MULTIPLE',
	EDIT = 'EDIT',
	REMOVE = 'REMOVE'
}

export interface ContextState {
	savedSchedules: Array<Schedule> | []
	calendars: Array<Calendar> | []
	filteredSchedules: Array<Schedule> | []
}

export type WhereToAddItems = 'memory' | 'both' | 'storage'

export type UserActionAddMultiplePayload = {
	addedItems: Array<Schedule | Calendar>
	whereTo?: WhereToAddItems
}

export interface DispatchContextState {
	dispatchSchedules: Dispatch<ScheduleActions>
	dispatchCalendars: Dispatch<CalendarListActions>
}