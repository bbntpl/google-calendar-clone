import executeAction from '.';
import { getLocalStorageNamespace } from '..';
import { Calendar, CalendarListActions } from '../types/calendar';

export const calendarReducer = (
	state: Array<Calendar> | [],
	action: CalendarListActions,
) => {
	const namespace = getLocalStorageNamespace();
	const propKey = `${namespace}_calendars`;

	return executeAction<Calendar, CalendarListActions>
		({ state, action, propKey });
}

export default calendarReducer;