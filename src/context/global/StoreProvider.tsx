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
	CalendarLabelType,
	CalendarListActionTypes,
	CalendarType,
	ScheduleActionTypes,
	ScheduleTypes,
	UserActionType,
} from './index.model';
import { uniqueID } from '../../util/reusable-funcs';
import { dateToday, stringifyDate } from '../../util/calendar-arrangement';
import { ScheduleNames } from './index.model';
import { defaultColorOption } from '../../docs/data';
import {
	updateLocalStorage,
	deleteLocalStorage,
	getItemFromLocal,
} from '../../util/local-storage';

function actionTypes<
	StateType extends ScheduleTypes | CalendarLabelType,
	ActionType extends CalendarListActionTypes | ScheduleActionTypes
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
					return Object.assign({}, obj, action.payload);
				}
				return obj;
			})];
			updateLocalStorage(stateName, editedArr);
			return editedArr;
		case UserActionType.REMOVE: // action receives id as its payload prop
			const reducedArr = [...state.filter((obj: StateType) => {
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
	action: ScheduleActionTypes,
) => {
	const accumulatedArr = [...state, action.payload as ScheduleTypes];
	const stateName = 'savedSchedules';
	return actionTypes<ScheduleTypes, ScheduleActionTypes>
		(state, action, accumulatedArr, stateName);
}

const calendarListReducer = (
	state: Array<CalendarLabelType> | [],
	action: CalendarListActionTypes) => {
	const accumulatedArr = state.length < 10
		? [...state, action.payload as CalendarLabelType]
		: state;
	const stateName = 'calendarList';
	return actionTypes<CalendarLabelType, CalendarListActionTypes>
		(state, action, accumulatedArr, stateName);
}

const initialCalendarList: Array<CalendarLabelType>
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
	const [calendarType, setCalendarType] = useState<CalendarType>('day');
	const [savedSchedules, dispatchSchedules] = useReducer(
		scheduleReducer,
		getItemFromLocal('savedSchedules').length
			? getItemFromLocal('savedSchedules')
			: [],
	);
	const [selectedDate, setSelectedDate] = useState(dateToday);
	const [selectedScheduleType, setSelectedScheduleType] = useState<ScheduleNames>('event');
	const { position, recordPos } = useCursorPosition();

	// can be a tag or a type of a schedule
	const [calendarList, dispatchCalendarList] =
		useReducer(calendarListReducer, initialCalendarList);

	// toggle states
	const [visibilities, setVisibilities] = useState<BooleansOnlyObj>({
		sidebar: true,
		labels: true,
	});

	const [
		scheduleDialogRef,
		isScheduleDialogVisible,
		setIsScheduleDialogVisible,
	] = useComponentVisible(false);

	// default values for schedule dialog(task or event)
	const [defaultDateTime, setDefaultDateTime] = useState({
		date: stringifyDate(dateToday),
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
			return calendarIds.includes(schedule.id);
		});
	}, [savedSchedules, calendarList]);

	useEffect(() => {
		setDefaultDateTime(defaultDateTime => ({
			...defaultDateTime,
			date: stringifyDate(selectedDate),
		}));
	}, [selectedDate]);

	const contextValues: GlobalContextInterface = {
		calendarType,
		setCalendarType,
		savedSchedules,
		visibilities,
		setVisibilities,
		calendarList,
		dispatchSchedules,
		dispatchCalendarList,
		// notifications,
		// setNotifications,
		filteredSchedules,
		// selectedSchedule,
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