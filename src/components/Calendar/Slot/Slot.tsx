import { useContext } from 'react';
import GlobalContextInterface, {
	ScheduleTypes,
} from '../../../context/global/index.model';
import GlobalContext from '../../../context/global/GlobalContext';
import { getScheduleTimeOptions } from '../../../util/calendar-arrangement';

type SlotProps = ScheduleTypes & {
	stringifiedDate: string;
}
export default function Slot(props: SlotProps) {
	const { calendarId, stringifiedDate } = props;
	const { time, date: scheduleDate } = props.dateTime;
	const { start, end } = time;
	const { calendarList }
		= useContext(GlobalContext) as GlobalContextInterface

	const timeOptions = getScheduleTimeOptions();

	const timeRange = () => {
		if(start < 0) return '';
		const startTime = timeOptions[start].time || '';
		const endTime = timeOptions[end].time || '';
		if (startTime && endTime) {
			return `${startTime}-${endTime}`;
		} else if (startTime || endTime) {
			return startTime || endTime;
		}
		return '';
	}

	const slotHeight = () => {
		const defaultHeight = 13;
		if(start < 0) {
			return defaultHeight * 3;
		} else if (stringifiedDate !== scheduleDate) {
			return end * defaultHeight;
		} else if (end > start) {
			return (calendarList.length - end) * defaultHeight;
		} else if (start > end) {
			return (timeOptions.length - start) * defaultHeight;
		}
		return defaultHeight;
	}

	const topPosition = () => {
		const initTime = start || end;
		if(initTime < 0 || stringifiedDate !== scheduleDate) return 0;
		return (initTime % 4) * 13;
	}

	const associatedCalendar = calendarList.find(obj => obj.id === calendarId);
	const bgColor = 'colorOption' in props
		? props.colorOption.value || associatedCalendar?.colorOption.value
		: associatedCalendar?.colorOption.value

	const slotStyles = {
		backgroundColor: bgColor,
		borderLeft: `5px solid ${associatedCalendar?.colorOption.value}`,
		borderRadius: '6px',
		height: `${slotHeight()}px`,
		marginRight: '10px',
		padding: '.1rem .5rem',
		top: `${topPosition()}px`,
		zIndex: 10000,
	};
	
	return (
		<div
			style={slotStyles}
			className='calendar-slot'
			onMouseOver={() => {
				Object.assign(slotStyles, { zIndex: 20000 });
			}}
			onMouseOut={() => {
				Object.assign(slotStyles, { zIndex: 10000 });
			}}
		>
			<p className='calendar-slot__title'>{props.title}</p>
			<p className='calendar-slot__hours'>{timeRange()}</p>
		</div>
	)
}