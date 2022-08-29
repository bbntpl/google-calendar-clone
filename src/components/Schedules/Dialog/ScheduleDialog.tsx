import { useContext, useState } from 'react';
import '../styles.scss';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface, {
	UserActionType,
	SetState,
} from '../../../context/global/index.model';

import { uniqueID } from '../../../util/reusable-funcs';
import ScheduleMainContent from './ScheduleMainContent';
import TaskBlock from '../Task/TaskBlock';
import EventBlock from '../Event/EventBlock';

interface ScheduleDialogProps {
	setIsScheduleDialogVisible: SetState<boolean>;
}
export default function ScheduleDialog(props: ScheduleDialogProps) {
	const { setIsScheduleDialogVisible } = props;
	const {
		selectedScheduleType,
		calendarList,
		defaultDateTime,
		dispatchSchedules,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const defaultScheduleState = {
		calendarId: calendarList[0].id,
		color: calendarList[0].color,
		completed: false,
		dateTime: {
			allDay: false,
			once: true,
			date: defaultDateTime.date,
			time: {
				start: defaultDateTime.time.start,
				end: defaultDateTime.time.end,
			},
		},
		description: '',
		id: uniqueID(),
		location: '',
		title: '',
		type: selectedScheduleType,
	}

	const [scheduleProps, setScheduleProps] = useState({
		...defaultScheduleState,
	});

	const setTitle = (title: string) => {
		setScheduleProps(setScheduleProps => ({ ...setScheduleProps, title }));
	}

	const addSchedule = () => {
		dispatchSchedules({
			type: UserActionType.ADD,
			payload: scheduleProps,
		});
		setScheduleProps({ ...defaultScheduleState });
		setIsScheduleDialogVisible(visible => !visible);
	}

	return (
		<div className='schedule-dialog'>
			<ScheduleMainContent
				title={scheduleProps.title}
				setTitle={setTitle}
			/>
			{
				selectedScheduleType === 'event'
					? <EventBlock
						evtProps={{
							calendarId: scheduleProps.calendarId,
							color: scheduleProps.color,
							dateTime: scheduleProps.dateTime,
							description: scheduleProps.description,
							location: scheduleProps.location,
						}}
						setScheduleProps={setScheduleProps}
					/>
					: <TaskBlock
						evtProps={{
							calendarId: scheduleProps.calendarId,
							completed: scheduleProps.completed,
							dateTime: scheduleProps.dateTime,
							description: scheduleProps.description,
						}}
						setScheduleProps={setScheduleProps}
					/>
			}
			<div className='schedule-dialog__options'>
				<button
					id='save-schedule'
					onClick={addSchedule}
				>
					Save
				</button>
			</div>
		</div>
	)
}