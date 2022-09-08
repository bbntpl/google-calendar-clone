import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface, {
	CalendarLabelType,
	EventInterface,
	ScheduleTypes,
	UserActionType,
} from '../../../context/global/index.model';
import { truncateString } from '../../../util/reusable-funcs';
import { 
	dayjsObj,
	getScheduleTimeOptions, 
	getShortDate, 
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

interface ScheduleViewProps {
	scheduleProps: ScheduleTypes;
	setIsScheduleViewVisible: Dispatch<SetStateAction<boolean>>;
}

export function ScheduleView(props: ScheduleViewProps) {
	const { scheduleProps, setIsScheduleViewVisible } = props;
	const {
		calendarId,
		description,
		title,
		type,
		...rest
	} = scheduleProps;
	const {
		calendarList,
		selectedDate,
		setSelectedSchedule,
		dispatchSchedules,
		setIsScheduleDialogVisible,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const [alertRef, isAlertVisible, setIsAlertVisible] = useComponentVisible(false);

	const associateCalendar = calendarList.find(cal => cal.id === calendarId);

	useEffect(() => {
		// set the received schedule props as a selected schedule
		setSelectedSchedule((sch: ScheduleTypes | null | undefined) => {
			return sch === null ? scheduleProps : { ...sch, ...scheduleProps };
		});

		// selected schedule becomes null after the component unmounts
		return () => setSelectedSchedule(null);
	}, []);

	const editSchedule = () => {
		setIsScheduleViewVisible(visible => !visible);
		setIsScheduleDialogVisible(visible => !visible);
	}

	const deleteSchedule = () => {
		dispatchSchedules({
			type: UserActionType.REMOVE,
			payload: scheduleProps.id,
		})
		setIsScheduleViewVisible(visible => !visible);
	}

	const DisplayHoursRange = () => {
		const { start, end } = rest.dateTime.time;
		const timeOptions = getScheduleTimeOptions();
		return (<span>
			{(start >= 0 && type === 'event') && `${timeOptions[start].time}-`}
			{start >= 0 && timeOptions[end].time}
		</span>)
	}

	const DisplayScheduleTime = () => {
		return (<>
			<div>{getShortDate(dayjsObj(selectedDate))}</div>
			<DisplayHoursRange />
		</>)
	}

	return (<>
		<div className='calendar-schedule__view'>
			<div className='schedule-view-block'>
				<div className='schedule-input-list'>
					<span>
						<div style={{
							borderRadius: '3px',
							backgroundColor: associateCalendar?.colorOption.value,
							width: '22px',
							height: '22px',
						}} />
					</span>
					<div>{title}</div>
				</div>
				<DataItem
					condition={!!('dateTime' in rest && (rest.dateTime.time.start && rest.dateTime.time.end))}
					icon={ClockIcon}
					DataElement={() => (
						<div><DisplayScheduleTime /></div>
					)}
				/>
				<DataItem
					condition={!!('location' in rest && rest.location)}
					icon={LocationIcon}
					DataElement={() => (<div>{(rest as EventInterface).location}</div>)}
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
						return <div>{(associateCalendar as CalendarLabelType).name}</div>
					}}
				/>
			</div>
			<div className='schedule-btn-list'>
				<button onClick={editSchedule}>
					<img src={EditIcon} />
				</button>
				<button onClick={() => setIsAlertVisible(visible => !visible)}>
					<img src={DeleteIcon} />
				</button>
			</div>
		</div>
		<Alert
			ref={alertRef}
			name={`${truncateString(title, 30)}`}
			action={'delete'}
			type={type}
			handleAction={deleteSchedule}
			handleHideComponent={() => setIsAlertVisible(false)}
			isVisible={isAlertVisible}
		/>
	</>)
}