/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import '../styles.scss';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface, {
	UserActionType,
	SetState,
	SelectedSchedule,
} from '../../../context/global/index.model';
import { uniqueID } from '../../../util/reusable-funcs';

import ScheduleMainContent from './ScheduleMainContent';
import TaskBlock from '../Task/TaskBlock';
import EventBlock from '../Event/EventBlock';
import { ScheduleStates } from '../index.model';

interface ScheduleDialogProps {
	setIsScheduleDialogVisible: SetState<boolean>;
	selectedSchedule: SelectedSchedule;
}

export default function ScheduleDialog(props: ScheduleDialogProps) {
	const { setIsScheduleDialogVisible, selectedSchedule } = props;
	const {
		selectedScheduleType,
		calendarList,
		defaultDateTime,
		savedSchedules,
		dispatchSchedules,
		setSelectedSchedule,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const defaultScheduleState = {
		calendarId: calendarList[0].id,
		colorOption: calendarList[0].colorOption,
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

	const initScheduleProps = (): ScheduleStates => {
		if (selectedSchedule !== null) {
			return Object.assign(defaultScheduleState, selectedSchedule);
		} else {
			return defaultScheduleState;
		}
	}

	const [scheduleProps, setScheduleProps] = useState(initScheduleProps());
	const { completed, ...eventProps } = scheduleProps;
	const { location, colorOption, ...taskProps } = scheduleProps;

	useEffect(() => {
		if (selectedSchedule === null) return;

		// selected schedule becomes null after the component unmounts
		return () => {
			setSelectedSchedule(null);
		}
	}, []);

	const setTitle = (title: string) => {
		setScheduleProps(setScheduleProps => ({ ...setScheduleProps, title }));
	}

	const isIdExists = savedSchedules.find(sch => sch.id === scheduleProps.id);

	const editSchedule = () => {
		dispatchSchedules({
			type: UserActionType.EDIT,
			payload: selectedScheduleType === 'event'
				? eventProps : taskProps,
		});
	}

	const addSchedule = () => {
		dispatchSchedules({
			type: UserActionType.ADD,
			payload: selectedScheduleType === 'event'
				? eventProps : taskProps,
		});
	}

	const scheduleAction = () => {
		isIdExists ? editSchedule() : addSchedule();
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
						eventProps={eventProps}
						setScheduleProps={setScheduleProps}
					/>
					: <TaskBlock
						taskProps={taskProps}
						setScheduleProps={setScheduleProps}
					/>
			}
			<div className='schedule-dialog__options'>
				<button
					id='save-schedule'
					onClick={scheduleAction}
				>
					Save
				</button>
			</div>
		</div>
	)
}