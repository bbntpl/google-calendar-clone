import executeAction from '.';
import { Schedule, ScheduleActions } from '../types/schedule';

const scheduleReducer = (
	state: Array<Schedule> | [],
	action: ScheduleActions,
):
	Array<Schedule> => {
	const updatedState = [...state, action.payload as Schedule];
	const stateName = 'savedSchedules';

	return executeAction<Schedule, ScheduleActions>
		({ state, action, updatedState, stateName });
}

export default scheduleReducer;