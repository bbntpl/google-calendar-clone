import React from 'react';

import { useContext } from 'react';
import { DialogProps } from '../../lib/Dialog/index.model';

import Dialog from '../../lib/Dialog/index';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';
import ScheduleDialog from './Dialog';

// It controls the visibility of the schedule dialog
export default function DialogController() {
	const {
		scheduleDialogRef,
		selectedSchedule,
		isScheduleDialogVisible,
		setIsScheduleDialogVisible,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const scheduleDialogProps: DialogProps = {
		componentProps: {
			setIsScheduleDialogVisible,
			selectedSchedule,
		},
		Component: ScheduleDialog,
		isSelfAdjustable: true,
		isDialogVisible: isScheduleDialogVisible,
		setIsDialogVisible: setIsScheduleDialogVisible,
		hasInitTransition: true,
	};
	
	return <Dialog ref={scheduleDialogRef} {...scheduleDialogProps} />
}