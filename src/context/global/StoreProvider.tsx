import { ReactNode, useMemo, useReducer, useState } from 'react';
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

import useCursorPosition from '../../hooks/useCursorPosition';
import useComponentVisible from '../../hooks/useComponentVisible';
import { dateToday, stringifiedDate } from '../../util/calendar-arrangement';

function actionTypes<
	StateType extends ScheduleTypes | CalendarLabelType,
	ActionType extends CalendarListActionTypes | ScheduleActionTypes
>(state: StateType[] | [], action: ActionType, actionTypeAdd: StateType[]) {
	switch (action.type) {
		case UserActionType.ADD:
			return actionTypeAdd;
		case UserActionType.EDIT:
			return [...state.map((obj: StateType) => {
				if (obj.id === action.payload.id) {
					return Object.assign({}, obj, action.payload);
				}
				return obj;
			})];
		case UserActionType.REMOVE: // action receives id as its payload prop
			return [...state.filter((obj: StateType) => {
				return obj.id !== action.payload;
			})];
		default:
			throw new Error();
	}
}

const scheduleReducer = (
	state: Array<ScheduleTypes> | [],
	action: ScheduleActionTypes,
) => {
	const actionTypeAdd = [...state, action.payload as ScheduleTypes];
	return actionTypes<ScheduleTypes, ScheduleActionTypes>
		(state, action, actionTypeAdd);
}

const calendarListReducer = (
	state: Array<CalendarLabelType> | [],
	action: CalendarListActionTypes) => {
	const actionTypeAdd = state.length < 10
		? [...state, action.payload as CalendarLabelType]
		: state;
	return actionTypes<CalendarLabelType, CalendarListActionTypes>
		(state, action, actionTypeAdd);
}


// initial states
const initialCalendarList: Array<CalendarLabelType> = [{
	id: uniqueID(),
	name: 'C.C. Antipolo C.C. Antipolo',
	color: 'black',
	selected: true,
	removable: true,
}];

export default function StoreProvider({ children }: { children: ReactNode }) {
	const [calendarType, setCalendarType] = useState<CalendarType>('day');
	const [savedSchedules, dispatchSchedules] = useReducer(scheduleReducer, []);
	const [selectedDate, setSelectedDate] = useState(dateToday);
	const { position, recordPos } = useCursorPosition();

	// can be a tag or a type of a schedule
	const [calendarList, dispatchCalendarList] =
		useReducer(calendarListReducer, initialCalendarList);

	// toggle states
	const [visibilities, setVisibilities] = useState<BooleansOnlyObj>({
		sidebar: true,
		labels: true,
	});

	const [evtRef, isEvtModalVisible, setIsEvtModalVisible] = useComponentVisible(false);
	const [tskRef, isTskModalVisible, setIsTskModalVisible] = useComponentVisible(false);

	// default values for schedule modal(task or event)
	const [defaultDay, setDefaultDay] = useState(stringifiedDate(dateToday));
	const [defaultTime, setDefaultTime] = useState(new Date().getHours().toString());

	const filteredSchedules = useMemo(() => {
		const calendarIds = calendarList
			.filter((calendar: { selected: boolean; }) => calendar.selected)
			.map((calendar: { id: number; }) => calendar.id);
		return savedSchedules.filter((schedule: ScheduleTypes) => {
			return calendarIds.includes(schedule.id);
		});
	}, [savedSchedules, calendarList]);

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
		defaultDay,
		defaultTime,
		setDefaultDay,
		setDefaultTime,
		evtRef,
		tskRef,
		isEvtModalVisible,
		isTskModalVisible,
		setIsEvtModalVisible,
		setIsTskModalVisible,
	}

	return (
		<GlobalContext.Provider value={contextValues}>
			{children}
		</GlobalContext.Provider>
	);
}