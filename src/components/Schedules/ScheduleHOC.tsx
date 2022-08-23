import { useContext } from 'react';
import { ScheduleTypeList } from './Dialog';
import useComponentVisible from '../../hooks/useComponentVisible';
import GlobalContext from '../../context/global/GlobalContext';
import GlobalContextInterface from '../../context/global/index.model';
import Dialog from '../../lib/Dialog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function withScheduleDialogToggle(Component: any) {
	const wrappedComponent = () => {
		const { recordPos } = useContext(GlobalContext) as GlobalContextInterface;
		const [dialogRef, isDialogVisible, setIsDialogVisible] = useComponentVisible(false);

		const dialogProps = {
			componentProps: {},
			Component: ScheduleTypeList,
			closeable: false,
			positionOffset: { x: 20, y: 50 },
			delta: { x: 10, y: 10 },
			draggable: false,
			isDialogVisible,
			setIsDialogVisible,
			stylePosition: 'absolute' as const,
		};
		const toggleVisibility = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
			recordPos(e);
			setIsDialogVisible(visible => !visible);
		}

		const wrappedComponentProps = {
			dialogProps,
			hocMethods: {
				toggleVisibility,
			},
		}

		return (
			<>
				<Component {...wrappedComponentProps} />
				<Dialog ref={dialogRef} {...dialogProps} />
			</>
		)
	}
	return wrappedComponent;
}