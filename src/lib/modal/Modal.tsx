import { ModalArgs } from './index.model';
import { forwardRef } from 'react';

import ModalCore from './ModalCore';

type ComponentToPassRef = HTMLDivElement | null;
const ModalOptions = forwardRef<ComponentToPassRef, ModalArgs>((props, ref) => {
	const {
		closeable = true,
		componentProps,
		Component,
		defaultPosition = null,
		// represents change in x or/and y
		delta = { x: 0, y: 0 },
		draggable = true,
		isModalVisible,
		setIsModalVisible,
		stylePosition = 'fixed',
	} = props;

	// props to be passed on the modal component
	const modalProps = {
		defaultPosition,
		delta,
		draggableProps: {
			handle: '.handle',
		},
		eventHandlers: {
			toggleModal: () => setIsModalVisible((visible: boolean) => !visible),
		},
		flags: { draggable, closeable },
		stylePosition,
	}

	const componentPropsWithVisibilityControl = {
		...componentProps,
		isModalVisible,
		setIsModalVisible,
	}

	const modalCoreArgs = {
		Component,
		props: {
			componentProps: componentPropsWithVisibilityControl,
			modalProps,
		},
	};

	return (
		<>
			{
				isModalVisible
					? <ModalCore ref={ref} {...modalCoreArgs} />
					: null}
		</>
	)
})

ModalOptions.displayName = 'ModalOptions';

export default ModalOptions;