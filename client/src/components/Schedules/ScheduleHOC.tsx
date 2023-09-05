import { forwardRef } from 'react';

import { useAppConfigUpdater } from '../../context/AppConfigContext';
import useComponentVisible from '../../hooks/useComponentVisible';
import { ScheduleTypeList } from './Dialog';
import Dialog from '../../lib/Dialog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function withScheduleDialogToggle(Component: any) {
	const wrappedComponent = () => {
		const { recordPosition } = useAppConfigUpdater();
		const [
			dialogRef,
			isDialogVisible,
			setIsDialogVisible,
			linkRef,
		] = useComponentVisible();

		const dialogProps = {
			Component: ScheduleTypeList,
			isCloseable: false,
			positionOffset: { x: 30, y: 60 },
			delta: { x: 10, y: 10 },
			isDraggable: false,
			isDialogVisible,
			setIsDialogVisible,
			stylePosition: 'absolute' as const,
		};

		const toggleVisibility = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
			recordPosition(e);
			setIsDialogVisible(visible => !visible);
		}

		const wrappedButtonProps = {
			hocMethods: {
				toggleVisibility,
			},
		}

		const ComponentWithRef = forwardRef<HTMLButtonElement>(Component);
		return (
			<>
				<ComponentWithRef ref={linkRef} {...wrappedButtonProps} />
				<Dialog ref={dialogRef} {...dialogProps} />
			</>
		)
	}
	return wrappedComponent;
}