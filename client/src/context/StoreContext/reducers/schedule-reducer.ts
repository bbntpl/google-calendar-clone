import executeAction from '.';
import { Schedule, ScheduleActions } from '../types/schedule';

import { getLocalStorageNamespace } from '..';

const scheduleReducer = (
	state: Array<Schedule> | [],
	action: ScheduleActions,
):
	Array<Schedule> => {
	const namespace = getLocalStorageNamespace();
	const propKey = `${namespace}_savedSchedules`;

	return executeAction<Schedule, ScheduleActions>
		({ state, action, propKey });
}

export default scheduleReducer;