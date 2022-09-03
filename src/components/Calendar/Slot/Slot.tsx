import React, { useContext } from 'react';
import GlobalContextInterface, {
	ScheduleTypes,
} from '../../../context/global/index.model';
import GlobalContext from '../../../context/global/GlobalContext';
import { getScheduleTimeOptions } from '../../../util/calendar-arrangement';

export default function Slot(props: ScheduleTypes) {
	const { calendarId } = props;
	const { time } = props.dateTime;
	const { start, end } = time;
	const { calendarList }
		= useContext(GlobalContext) as GlobalContextInterface

	const timeOptions = getScheduleTimeOptions();

	const timeRange = () => {
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
		if (end > start) {
			const heightMultiplier = (calendarList.length - end);
			return heightMultiplier * defaultHeight;
		}
	}

	const associatedCalendar = calendarList.find(obj => obj.id === calendarId);
	const bgColor = 'colorOption' in props
		? props.colorOption.value || associatedCalendar?.colorOption.value
		: associatedCalendar?.colorOption.value

	const slotStyles = {
		backgroundColor: bgColor,
		borderLeft: `5px solid ${associatedCalendar?.colorOption.value}`,
		borderRadius: '10px',
		height: `${slotHeight}px`,
		marginRight: '20px',
		padding: '10px 5px',
		zIndex: 10000,
	};

	return (
		<div 
		style={slotStyles} 
		className='calendar-slot'
		onMouseOver={() => {
			Object.assign(slotStyles, {zIndex: 20000});
		}}
		onMouseOut={() => {
			Object.assign(slotStyles, {zIndex: 10000});
		}}
		>
			<p className='calendar-slot__title'>{props.title}</p>
			<p className='calendar-slot__hours'>{timeRange()}</p>
		</div>
	)
}