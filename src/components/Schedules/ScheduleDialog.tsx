import { useContext } from 'react';
import { DialogArgs } from '../../lib/Dialog/index.model';

import Event from './Event';
import Task from './Task';
import Dialog from '../../lib/Dialog/index';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

export function ScheduleDialog() {
	const {
		evtRef,
		tskRef,
		isEvtDialogVisible,
		isTskDialogVisible,
		setIsEvtDialogVisible,
		setIsTskDialogVisible,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const scheduleTypeProps = {
		componentProps: {},
		defaultPosition: { x: 50, y: 50 },
		stylePosition: 'fixed' as const,
	}
	const tskDialogProps: DialogArgs = Object.assign({
		Component: Task,
		isDialogVisible: isTskDialogVisible,
		setIsDialogVisible: setIsTskDialogVisible,
	}, scheduleTypeProps);
	const evtDialogProps: DialogArgs = Object.assign({
		Component: Event,
		isDialogVisible: isEvtDialogVisible,
		setIsDialogVisible: setIsEvtDialogVisible,
	}, scheduleTypeProps);

	return (
		<>
			<Dialog ref={tskRef} {...tskDialogProps} />
			<Dialog ref={evtRef} {...evtDialogProps} />
		</>
	)
}