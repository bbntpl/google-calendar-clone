import React, { useContext } from 'react';
import '../styles.scss';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface, {
	ScheduleNames,
} from '../../../context/global/index.model';

function ScheduleTypeSelector() {
	const {
		selectedScheduleType,
		setSelectedScheduleType,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const scheduleTypeClassName = (buttonName: ScheduleNames) => {
		return `schedule-type${buttonName === selectedScheduleType
			? '--active' : ''}`;
	}
	return (
		<div>
			<button
				className={scheduleTypeClassName('event')}
				onClick={() => setSelectedScheduleType('event')}
			>Event</button>
			<button
				className={scheduleTypeClassName('task')}
				onClick={() => setSelectedScheduleType('task')}
			>Task</button>
		</div>
	)
}

export default ScheduleTypeSelector;