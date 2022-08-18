import React from 'react';

import { useContext } from 'react';
import { DialogArgs } from '../../lib/Dialog/index.model';

import Dialog from '../../lib/Dialog/index';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';
import { ScheduleDialog } from './ScheduleDialog';

export default function DialogController() {
	const {
		scheduleDialogRef,
		isScheduleDialogVisible,
		setIsScheduleDialogVisible,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const scheduleTypeProps = {
		componentProps: {},
		positionOffset: { x: '50%', y: '50%' },
		stylePosition: 'fixed' as const,
	}

	const scheduleDialogProps: DialogArgs = Object.assign({
		Component: ScheduleDialog,
		isDialogVisible: isScheduleDialogVisible,
		setIsDialogVisible: setIsScheduleDialogVisible,
	}, scheduleTypeProps);

	return <Dialog ref={scheduleDialogRef} {...scheduleDialogProps} />
}