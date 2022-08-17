import React, { useContext } from 'react';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface from '../../../context/global/index.model';

function ScheduleTypeSelector(props: { scheduleType: string }) {
	const { scheduleType } = props;
	const {
		isEvtDialogVisible,
		isTskDialogVisible,
		setIsEvtDialogVisible,
		setIsTskDialogVisible,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const scheduleTypeClassName = (buttonName) => {
		return `schedule-type${buttonName === scheduleType ? '--active' : ''}`;
	}
	return (
		<div>
			<button
				className={scheduleTypeClassName('event')}
				onClick={() => {
					if (isEvtDialogVisible) return;
					setIsEvtDialogVisible(true);
					setIsTskDialogVisible(false);
				}}
			>Event</button>
			<button
				className={scheduleTypeClassName('task')}
				onClick={() => {
					if (isTskDialogVisible) return;
					setIsEvtDialogVisible(false);
					setIsTskDialogVisible(true);
				}}
			>Task</button>
		</div>
	)
}

export default ScheduleTypeSelector;