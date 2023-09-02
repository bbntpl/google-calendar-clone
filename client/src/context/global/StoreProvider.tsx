/* eslint-disable max-lines */
import {
	ReactNode,
	useEffect,
	useMemo,
	useReducer,
	useState,
} from 'react';

import useCursorPosition from '../../hooks/useCursorPosition';
import useComponentVisible from '../../hooks/useComponentVisible';
import GlobalContext from './GlobalContext';
import GlobalContextInterface, {
	BooleansOnlyObj,
	CalendarItem,
	CalendarListActions,
	CalendarUnits,
	OtherCalendars,
	ScheduleActions,
	ScheduleTypeNames,
	ScheduleTypes,
	SelectedSchedule,
	UserActionType,
} from './index.model';
import { uniqueID } from '../../util/reusable-funcs';
import { dateToday, convertDateUnitsToString } from '../../util/calendar-arrangement';
import {
	updateLocalStorage,
	deleteLocalStorage,
	getItemFromLocal,
} from '../../util/local-storage';
import { defaultColorOption } from '../../themes/data';

function actionTypes<
	StateType extends ScheduleTypes | CalendarItem,
	ActionType extends CalendarListActions | ScheduleActions
>(
	state: StateType[] | [],
	action: ActionType,
	accumulatedArr: StateType[],
	stateName: string,
) {
	switch (action.type) {
		case UserActionType.ADD:
			updateLocalStorage(stateName, accumulatedArr);
			return accumulatedArr;
		case UserActionType.EDIT:
			const editedArr = [...state.map((obj: StateType) => {
				if (obj.id === action.payload.id) {
					return Object.assign(action.payload);
				}
				return obj;
			})];
			updateLocalStorage(stateName, editedArr);
			return editedArr;
		case UserActionType.REMOVE:
			const reducedArr = [...state.filter((obj: StateType) => {
				// The action payload is equivalent to id
				return obj.id !== action.payload;
			})];

			reducedArr.length
				? updateLocalStorage(stateName, reducedArr)
				: deleteLocalStorage(stateName);
			return reducedArr;
		default:
			throw new Error();
	}
}

const scheduleReducer = (
	state: Array<ScheduleTypes> | [],
	action: ScheduleActions,
) => {
	const accumulatedArr = [...state, action.payload as ScheduleTypes];
	const stateName = 'savedSchedules';
	return actionTypes<ScheduleTypes, ScheduleActions>
		(state, action, accumulatedArr, stateName);
}

const calendarListReducer = (
	state: Array<CalendarItem> | [],
	action: CalendarListActions) => {
	const accumulatedArr: CalendarItem[] = state.length < 10
		? [...state, action.payload as CalendarItem]
		: state;
	const stateName = 'calendarList';
	return actionTypes<CalendarItem, CalendarListActions>
		(state, action, accumulatedArr, stateName);
}

const initialCalendarList: Array<CalendarItem>
	= getItemFromLocal('calendarList').length
		? getItemFromLocal('calendarList')
		: [{
			id: uniqueID(),
			name: 'Your Calendar',
			colorOption: defaultColorOption,
			selected: true,
			removable: false,
		}];

export default function StoreProvider({ children }: { children: ReactNode }) {
	const [selectedCalendarUnit, setSelectedCalendarUnit] =
		useState<CalendarUnits>('day');
	const [savedSchedules, dispatchSchedules] = useReducer(
		scheduleReducer,
		getItemFromLocal('savedSchedules').length
			? getItemFromLocal('savedSchedules')
			: [],
	);
	const [selectedSchedule, setSelectedSchedule] = useState<SelectedSchedule>(null);
	const [selectedDate, setSelectedDate] = useState(dateToday);
	const [selectedScheduleType, setSelectedScheduleType] = useState<ScheduleTypeNames>('event');
	const { position, recordPos } = useCursorPosition();

	// Note: It can be a tag or a type of a schedule
	const [calendarList, dispatchCalendarList] =
		useReducer(calendarListReducer, initialCalendarList);

	const [otherCalendarList, setOtherCalendarList] =
		useState<OtherCalendars[] | []>([]);

	const [visibilities, setVisibilities] = useState<BooleansOnlyObj>({
		sidebar: true,
		labels: true,
	});

	const [
		scheduleDialogRef,
		isScheduleDialogVisible,
		setIsScheduleDialogVisible,
	] = useComponentVisible();

	// Default values for schedule dialog(task or event)
	const [defaultDateTime, setDefaultDateTime] = useState({
		date: convertDateUnitsToString(dateToday),
		time: {
			start: new Date().getHours(),
			end: new Date().getHours(),
		},
	});

	const filteredSchedules = useMemo(() => {
		const calendarIds = calendarList
			.filter((calendar: { selected: boolean; }) => calendar.selected)
			.map((calendar: { id: number; }) => calendar.id);
		return savedSchedules.filter((schedule: ScheduleTypes) => {
			return calendarIds.includes(schedule.calendarId);
		});
	}, [savedSchedules, calendarList]);

	useEffect(() => {
		setDefaultDateTime(defaultDateTime => ({
			...defaultDateTime,
			date: convertDateUnitsToString(selectedDate),
		}));
	}, [selectedDate]);

	const contextValues: GlobalContextInterface = {
		selectedCalendarUnit,
		setSelectedCalendarUnit,
		savedSchedules,
		visibilities,
		setVisibilities,
		calendarList,
		dispatchSchedules,
		dispatchCalendarList,
		// notifications,
		// setNotifications,
		otherCalendarList,
		setOtherCalendarList,
		filteredSchedules,
		selectedSchedule,
		setSelectedSchedule,
		selectedDate,
		setSelectedDate,
		position,
		recordPos,
		defaultDateTime,
		setDefaultDateTime,
		scheduleDialogRef,
		isScheduleDialogVisible,
		setIsScheduleDialogVisible,
		selectedScheduleType,
		setSelectedScheduleType,
	}
	return (
		<GlobalContext.Provider value={contextValues}>
			{children}
		</GlobalContext.Provider>
	);
}