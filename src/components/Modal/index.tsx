import { useContext } from 'react';
import { ModalArgs } from '../../lib/modal/index.model';

import Event from '../Schedules/Event';
import Task from '../Schedules/Task';
import Modal from '../../lib/modal/index';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';

export function GlobalModals() {
	const {
		evtRef,
		tskRef,
		isEvtModalVisible,
		isTskModalVisible,
		setIsEvtModalVisible,
		setIsTskModalVisible,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const scheduleTypeProps = {
		componentProps: {},
		defaultPosition: { x: 50, y: 50 },
		stylePosition: 'fixed' as const,
	}
	const tskModalProps: ModalArgs = Object.assign({
		Component: Task,
		isModalVisible: isTskModalVisible,
		setIsModalVisible: setIsTskModalVisible,
	}, scheduleTypeProps);
	const evtModalProps: ModalArgs = Object.assign({
		Component: Event,
		isModalVisible: isEvtModalVisible,
		setIsModalVisible: setIsEvtModalVisible,
	}, scheduleTypeProps);

	return (
		<>
			<Modal ref={tskRef} {...tskModalProps} />
			<Modal ref={evtRef} {...evtModalProps} />
		</>
	)
}