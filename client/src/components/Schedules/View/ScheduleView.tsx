import {
	Dispatch,
	SetStateAction,
	useEffect,
} from 'react';

import { truncateString } from '../../../util/reusable-funcs';
import {
	dayjsObj,
	getScheduleTimeOptions,
	getShortDate,
	convertStringToDateUnits,
} from '../../../util/calendar-arrangement';
import useComponentVisible from '../../../hooks/useComponentVisible';

import '../styles.scss';
import CalendarIcon from '../../../assets/icons/calendar.png';
import ClockIcon from '../../../assets/icons/clock.png';
import DeleteIcon from '../../../assets/icons/trash.png';
import DescIcon from '../../../assets/icons/desc.png';
import EditIcon from '../../../assets/icons/edit.png';
import LocationIcon from '../../../assets/icons/location.png';

import Alert from '../../../lib/Alert/Alert';
import DataItem from './DataItem';
import { createPortal } from 'react-dom';
import {
	Event,
	Schedule,
	ScheduleType,
} from '../../../context/StoreContext/types/schedule';
import { DateTimeInputs } from '../../../context/CalendarConfigContext/index.model';
import { Calendar } from '../../../context/StoreContext/types/calendar';
import { useStore, useStoreUpdater } from '../../../context/StoreContext';
import { useCalendarConfigUpdater } from '../../../context/CalendarConfigContext';
import { UserAction } from '../../../context/StoreContext/index.model';

interface ScheduleViewProps {
	readonly scheduleProps: Schedule;
	setIsScheduleViewVisible: Dispatch<SetStateAction<boolean>>;
}

interface HoursRangeProps {
	readonly dateTime: DateTimeInputs;
	readonly type: ScheduleType;
}

function HoursRange(props: HoursRangeProps) {
	const { dateTime, type } = props;
	const { start, end } = dateTime.time;
	const timeOptions = getScheduleTimeOptions();
	return <span>
		{(start >= 0 && type === 'event') && `${timeOptions[start].time}-`}
		{start >= 0 && timeOptions[end].time}
	</span>
}

function ScheduleTime(props: HoursRangeProps) {
	const { dateTime } = props;
	const dateValues = convertStringToDateUnits(dateTime.date);
	const shortDate = getShortDate(dayjsObj(dateValues));
	return <>
		<div>{shortDate}</div>
		<HoursRange {...props} />
	</>
}

export function ScheduleView(props: ScheduleViewProps) {
	const { scheduleProps, setIsScheduleViewVisible } = props;
	const { calendarId, description, title, type, ...otherScheduleProps } = scheduleProps;

	const { calendars } = useStore();
	const { dispatchSchedules } = useStoreUpdater();
	const { setSelectedSchedule } = useCalendarConfigUpdater();
	const { setIsScheduleDialogVisible } = useCalendarConfigUpdater();

	const [alertRef, isAlertVisible, setIsAlertVisible] = useComponentVisible();
	const associatedCalendar
		= calendars.find((calendar: Calendar) => calendar.id === calendarId);

	useEffect(() => {
		// Set the received schedule props as a selected schedule
		setSelectedSchedule((schedule: Schedule | null | undefined) => {
			return schedule === null ? scheduleProps : { ...schedule, ...scheduleProps };
		});
		return () => setSelectedSchedule(null);
	}, []);

	const editSchedule = () => {
		setIsScheduleViewVisible(visible => !visible);
		setIsScheduleDialogVisible((visible: boolean) => !visible);
	}

	const toggleTaskCompletion = () => {
		if ('completed' in otherScheduleProps) {
			dispatchSchedules({
				type: UserAction.EDIT,
				payload: {
					...scheduleProps,
					completed: !otherScheduleProps.completed,
				},
			})
		}
	}
	const deleteSchedule = () => {
		dispatchSchedules({
			type: UserAction.REMOVE,
			payload: {
				id: scheduleProps.id,
			},
		})
		setIsScheduleViewVisible(false);
	}

	return (<>
		<div className='calendar-schedule__view'>
			<div className='schedule-view-block'>
				<div className='schedule-input-list'>
					<span>
						<div style={{
							borderRadius: '3px',
							backgroundColor: associatedCalendar?.colorOption.value,
							width: '22px',
							height: '22px',
						}} />
					</span>
					<div>{title || '(No title)'}</div>
				</div>
				<DataItem
					condition={!!('dateTime' in otherScheduleProps && (otherScheduleProps.dateTime.time.start && otherScheduleProps.dateTime.time.end))}
					icon={ClockIcon}
					DataElement={() => (
						<div>
							<ScheduleTime
								dateTime={otherScheduleProps.dateTime}
								type={type}
							/>
						</div>
					)}
				/>
				<DataItem
					condition={!!('location' in otherScheduleProps && otherScheduleProps.location)}
					icon={LocationIcon}
					DataElement={() => (<div>{(otherScheduleProps as Event).location}</div>)}
				/>
				<DataItem
					condition={!!description}
					icon={DescIcon}
					DataElement={() => (<div>{description}</div>)}
				/>
				<DataItem
					condition={!!calendarId}
					icon={CalendarIcon}
					DataElement={() => {
						return <div>{(associatedCalendar as Calendar).name}</div>
					}}
				/>
				<div className='schedule-view-block'>
					{
						'completed' in otherScheduleProps
						&& <button onClick={toggleTaskCompletion}>
							{`${otherScheduleProps.completed ? 'Not c' : 'C'}ompleted`}
						</button>
					}
				</div>
			</div>
			{
				scheduleProps.calendarType === 'default' ? 
				<div className='schedule-btn-list'>
					<button onClick={editSchedule}>
						<img src={EditIcon} />
					</button>
					<button onClick={() => setIsAlertVisible(visible => !visible)}>
						<img src={DeleteIcon} />
					</button>
				</div>
				: null
			}
		</div>
		{
			createPortal(
				<Alert
					ref={alertRef}
					name={`${truncateString(title, 30)}`}
					action={'delete'}
					type={type}
					handleAction={deleteSchedule}
					handleHideComponent={() => setIsAlertVisible(false)}
					isVisible={isAlertVisible}
				/>,
				document.body,
			)
		}
	</>)
}