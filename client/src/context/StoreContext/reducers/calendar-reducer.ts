import executeAction from '.';
import { Calendar, CalendarListActions } from '../types/calendar';

export const calendarReducer = (
	state: Array<Calendar> | [],
	action: CalendarListActions,
) => {

	const updatedState: Array<Calendar> = state.length < 60
		? [...state, action.payload as Calendar]
		: state;
	const stateName = 'calendars';

	return executeAction<Calendar, CalendarListActions>
		({ state, action, updatedState, stateName });
}

export default calendarReducer;