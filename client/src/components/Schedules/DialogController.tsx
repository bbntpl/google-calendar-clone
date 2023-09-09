import { DialogProps } from '../../lib/Dialog/index.model';
import Dialog from '../../lib/Dialog/index';
import ScheduleDialog from './Dialog';

import {
	useCalendarConfig,
	useCalendarConfigUpdater,
} from '../../contexts/CalendarConfigContext';

// It controls the visibility of the schedule dialog
export default function DialogController() {
	const {
		scheduleDialogRef,
		selectedSchedule,
		isScheduleDialogVisible,
	} = useCalendarConfig();
	const { setIsScheduleDialogVisible } = useCalendarConfigUpdater();

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