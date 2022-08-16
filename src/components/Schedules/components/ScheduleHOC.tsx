import { useContext } from 'react';
import ScheduleModal from '../ScheduleTypeList';
import useComponentVisible from '../../../hooks/useComponentVisible';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface from '../../../context/global/index.model';
import { ModalArgs } from '../../../lib/modal/index.model';
import Modal from '../../../lib/modal';

interface HOCMethods {
	toggleVisibility: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
}

export interface ScheduleCreationProps {
	modalProps: ModalArgs,
	hocMethods: HOCMethods
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function withScheduleModalToggle(Component: any) {
	const wrappedComponent = () => {
		const { recordPos } = useContext(GlobalContext) as GlobalContextInterface;
		const [modalRef, isModalVisible, setIsModalVisible] = useComponentVisible(false);

		const modalProps: ModalArgs = {
			componentProps: {},
			Component: ScheduleModal,
			closeable: false,
			defaultPosition: { x: 20, y: 50 },
			delta: { x: 10, y: 10 },
			draggable: false,
			isModalVisible,
			setIsModalVisible,
			stylePosition: 'absolute',
		};
		const toggleVisibility = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
			recordPos(e);
			setIsModalVisible(visible => !visible);
		}

		const wrappedComponentProps = {
			modalProps,
			hocMethods: {
				toggleVisibility,
			},
		}

		return (
			<>
				<Component {...wrappedComponentProps} />
				<Modal ref={modalRef} {...modalProps} />
			</>
		)
	}
	return wrappedComponent;
}