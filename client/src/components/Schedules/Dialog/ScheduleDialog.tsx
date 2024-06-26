/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import '../styles.scss';

import { uniqueID } from '../../../util/reusable-funcs';

import ScheduleMainContent from './ScheduleMainContent';
import TaskBlock from '../Task/TaskBlock';
import EventBlock from '../Event/EventBlock';

import { ScheduleStates } from '../index.model';
import { SetState } from '../../../contexts/index.model';
import { SelectedSchedule } from '../../../contexts/StoreContext/types/schedule';
import { UserAction } from '../../../contexts/StoreContext/index.model';
import { useStore, useStoreUpdater } from '../../../contexts/StoreContext';
import { useCalendarConfig, useCalendarConfigUpdater } from '../../../contexts/CalendarConfigContext';
import { CalendarType } from '../../../contexts/StoreContext/types/calendar';

interface ScheduleDialogProps {
	setIsScheduleDialogVisible: SetState<boolean>;
	selectedSchedule: SelectedSchedule;
}

export default function ScheduleDialog(props: ScheduleDialogProps) {
	const { setIsScheduleDialogVisible, selectedSchedule } = props;
	const {
		savedSchedules,
		calendars,
	} = useStore();
	const { dispatchSchedules } = useStoreUpdater();
	const {
		defaultDateTime,
		selectedScheduleType,
	} = useCalendarConfig();
	const {
		setSelectedSchedule,
		setSelectedScheduleType,
	} = useCalendarConfigUpdater();

	const defaultScheduleState = {
		calendarType: 'default' as CalendarType,
		calendarId: calendars[0].id,
		colorOption: calendars[0].colorOption,
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
		// Set the selected schedule type derived from the received
		// selected schedule only if it is not null
		if (selectedSchedule) {
			setSelectedScheduleType(selectedSchedule.type);
		}
		if (selectedSchedule === null) return;
		// Selected schedule becomes null after the component unmounts
		return () => setSelectedSchedule(null);
	}, []);

	const setTitle = (title: string) => {
		setScheduleProps(setScheduleProps => ({ ...setScheduleProps, title }));
	}

	const isIdExists = savedSchedules.find(schedule => schedule.id === scheduleProps.id);

	const editSchedule = () => {
		dispatchSchedules({
			type: UserAction.EDIT,
			payload: selectedScheduleType === 'event'
				? { ...eventProps, type: 'event' }
				: { ...taskProps, type: 'task' },
		});
	}

	const addSchedule = () => {
		dispatchSchedules({
			type: UserAction.ADD,
			payload: {
				addedItem: selectedScheduleType === 'event'
					? eventProps : taskProps,
				whereTo: 'both',
			},
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
				scheduleType={selectedScheduleType}
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
				<button id='save-schedule' onClick={scheduleAction}>Save</button>
			</div>
		</div>
	)
}