import { ScheduleType } from '../../../contexts/StoreContext/types/schedule';
import {
	useCalendarConfig,
	useCalendarConfigUpdater,
} from '../../../contexts/CalendarConfigContext';

interface ScheduleTypeSelectorProps {
	scheduleType: ScheduleType | null | undefined;
}
export default function ScheduleTypeSelector(props: ScheduleTypeSelectorProps) {
	const { scheduleType } = props;
	const {
		selectedScheduleType,
	} = useCalendarConfig();
	const { setSelectedScheduleType } = useCalendarConfigUpdater();

	const scheduleTypeClassName = (buttonName: ScheduleType) => {
		return `schedule-type${buttonName === (scheduleType || selectedScheduleType)
			? '--active' : ''}`;
	}

	return (
		<div className='schedule-type-selector'>
			<button
				className={scheduleTypeClassName('event')}
				onClick={() => setSelectedScheduleType('event')}
			>Event</button>
			<button
				className={scheduleTypeClassName('task')}
				onClick={() => setSelectedScheduleType('task')}
			>Task</button>
		</div>
	)
}