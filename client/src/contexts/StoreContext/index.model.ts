import { Dispatch, SetStateAction } from 'react'

import { Calendar, CalendarListActions } from './types/calendar'
import { Schedule, ScheduleActions } from './types/schedule'

export enum UserAction {
	ADD = 'ADD',
	ADD_MULTIPLE = 'ADD_MULTIPLE',
	EDIT = 'EDIT',
	REMOVE = 'REMOVE',
	REMOVE_MULTIPLE = 'REMOVE_MULTIPLE',
	CLEAR = 'CLEAR',
	REPLACE_ALL = 'REPLACE_ALL'
}

export type StoreStatus = {
	isUserChanged: boolean
	isCalendarsInitialized: boolean
	isFetchedDataInitialized: boolean
	isExternalEventsInitialized: boolean
};

export interface SaveToFirestoreProps<Actions> {
	dispatchFn: (value: Actions) => void
	action: Actions
}

export interface StoreState {
	savedSchedules: Array<Schedule> | []
	calendars: Array<Calendar> | []
}

export interface ContextState extends StoreState {
	filteredSchedules: Array<Schedule> | []
	status: StoreStatus
}

export type WhereToAddItems = 'local' | 'both' | 'cloud';

export type UserActionAddPayload = {
	addedItem: Schedule | Calendar
	whereTo?: WhereToAddItems
}

export type UserActionAddMultiplePayload = {
	addedItems: Array<Schedule | Calendar>
	whereTo?: WhereToAddItems
}

export type ExtractPayload<Action> = Action extends { payload: infer P } ? P : never;

export interface DispatchContextState {
	dispatchSchedules: Dispatch<ScheduleActions>
	dispatchCalendars: Dispatch<CalendarListActions>
	setStatus: Dispatch<SetStateAction<StoreStatus>>
}