import { useEffect, Dispatch, SetStateAction } from 'react';

import { UserAction, StoreStatus } from '../index.model';
import {
	Calendar,
	CalendarListActions,
	CalendarType,
} from '../types/calendar';

import { has } from '../../../util/local-storage';
import { uniqueID } from '../../../util/reusable-funcs';
import {
	getColorOption,
	getRandomColorOption,
} from '../../../util/color-options';

interface UseInitializeCalendarsProps {
	localStorageNamespace: string
	status: StoreStatus
	setStatus: Dispatch<SetStateAction<StoreStatus>>
	dispatchCalendars: (value: CalendarListActions) => void
}

export function useInitializeCalendars(props: UseInitializeCalendarsProps) {
	const {
		localStorageNamespace,
		status,
		setStatus,
		dispatchCalendars,
	} = props;
	useEffect(() => {
		const hasCalendars = has(`${localStorageNamespace}_calendars`);
		const {
			isUserChanged,
			isCalendarsInitialized,
			isFetchedDataInitialized,
		} = status;
		if (
			isUserChanged &&
			(!isCalendarsInitialized && isFetchedDataInitialized) &&
			!hasCalendars) {
			console.log('The initial calendars are getting initialized');
			// Initialize the calendars with default ones if no documents were
			// fetched from either cloud firestore or local storage
			const initialCalendars: Array<Calendar> = [
				{
					id: uniqueID(),
					name: 'Your Calendar',
					colorOption: getColorOption(),
					selected: true,
					removable: false,
					type: 'default' as CalendarType,
				},
				{
					id: uniqueID(),
					name: 'Holidays in United States',
					colorOption: getRandomColorOption(),
					selected: true,
					removable: true,
					type: 'holiday' as CalendarType,
					timeZone: 'UTC',
					description: 'Holidays and Observances in United States',
					region: 'en.usa',
				},
			];

			dispatchCalendars({
				type: UserAction.ADD_MULTIPLE,
				payload: {
					addedItems: initialCalendars,
					whereTo: 'both',
				},
			})

			setStatus(prevStatus => ({
				...prevStatus,
				isCalendarsInitialized: true,
			}))
		}
	}, [status, dispatchCalendars]);
}