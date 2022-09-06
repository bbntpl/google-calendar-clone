import { useContext, useState } from 'react';
import GlobalContextInterface, {
	ScheduleTypes,
} from '../../../context/global/index.model';
import GlobalContext from '../../../context/global/GlobalContext';
import { getScheduleTimeOptions } from '../../../util/calendar-arrangement';
import useComponentVisible from '../../../hooks/useComponentVisible';

import { ScheduleView } from '../../Schedules/ScheduleView';
import Dialog from '../../../lib/Dialog';

type SlotProps =  {
	scheduleProps: ScheduleTypes;
	stringifiedDate: string;
}
	export default function Slot(props: SlotProps) {
		const { scheduleProps, stringifiedDate } = props;
	const { calendarId, title } = scheduleProps;
	const { time, date: scheduleDate } = scheduleProps.dateTime;
	const { start, end } = time;
	const { 
		calendarList,
		recordPos, 
	} = useContext(GlobalContext) as GlobalContextInterface
	const [zIndex, setZIndex] = useState(1000);
	const [
		scheduleViewRef,
		isScheduleViewVisible,
		setIsScheduleViewVisible,
		linkRef,
	] = useComponentVisible(false);

	const scheduleViewProps = {
		isDraggable: false,
		isSelfAdjustable: true,
		componentProps: {
			scheduleProps,
			setIsDialogVisible: setIsScheduleViewVisible,
		},
		Component: ScheduleView,
		hasInitTransition: true,
		isDialogVisible: isScheduleViewVisible,
		setIsDialogVisible: setIsScheduleViewVisible,
	}

	const timeOptions = getScheduleTimeOptions();

	const timeRange = () => {
		if (start < 0) return '';
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
		if (start < 0) {
			return defaultHeight * 3;
		} else if (stringifiedDate !== scheduleDate) {
			return end * defaultHeight;
		} else if (end > start) {
			return (end - start) * defaultHeight;
		} else if (start > end) {
			return (timeOptions.length - start) * defaultHeight;
		}
		return defaultHeight;
	}

	const topPosition = () => {
		const initTime = start || end;
		if (initTime < 0 || stringifiedDate !== scheduleDate) return 0;
		return (initTime % 4) * 13;
	}

	const associatedCalendar = calendarList.find(obj => obj.id === calendarId);
	const bgColor = 'colorOption' in scheduleProps
		? scheduleProps.colorOption.value || associatedCalendar?.colorOption.value
		: associatedCalendar?.colorOption.value

	const slotStyles = {
		backgroundColor: bgColor,
		borderLeft: `5px solid ${associatedCalendar?.colorOption.value}`,
		height: `${slotHeight()}px`,
		top: `${topPosition()}px`,
		zIndex,
	};

	return (
		<>
			<button
				style={slotStyles}
				className='calendar-slot'
				onMouseOver={() => setZIndex(2000)}
				onMouseOut={() => setZIndex(1000)}
				onClick={(e) => {
					recordPos(e);
					setIsScheduleViewVisible(visible => !visible)
				}}
				ref={linkRef}
			>
				<p className='calendar-slot__title'>{title}</p>
				<p className='calendar-slot__hours'>{timeRange()}</p>
			</button>
			<Dialog
				ref={scheduleViewRef}
				{...scheduleViewProps}
			/>
		</>
	)
}