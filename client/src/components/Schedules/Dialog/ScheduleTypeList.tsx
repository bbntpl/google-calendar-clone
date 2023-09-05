import { useCalendarConfigUpdater } from '../../../context/CalendarConfigContext';
import { DialogProps } from '../../../lib/Dialog/index.model';

export default function ScheduleTypeList(props: DialogProps) {
	const { setIsDialogVisible } = props;
	const {
		setIsScheduleDialogVisible,
		setSelectedScheduleType,
	} = useCalendarConfigUpdater();

	return (
		<>
			<ul className='dialog__options start-xs'>
				<li>
					<button
						onClick={() => {
							setSelectedScheduleType('event');
							setIsDialogVisible(false);
							setIsScheduleDialogVisible(true);
						}}
					>
						Event
					</button>
				</li>
				<li>
					<button onClick={() => {
						setSelectedScheduleType('task');
						setIsDialogVisible(false);
						setIsScheduleDialogVisible(true);
					}}>
						Task
					</button>
				</li>
			</ul>
		</>
	)
}