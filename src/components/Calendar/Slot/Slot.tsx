import { useContext, useState } from 'react';
import GlobalContextInterface, {
	ScheduleTypes,
} from '../../../context/global/index.model';
import GlobalContext from '../../../context/global/GlobalContext';
import { getScheduleTimeOptions } from '../../../util/calendar-arrangement';
import useComponentVisible from '../../../hooks/useComponentVisible';

import { ScheduleView } from '../../Schedules/View/ScheduleView';
import Dialog from '../../../lib/Dialog';
import { DialogProps } from '../../../lib/Dialog/index.model';

type SlotProps = {
	scheduleProps: ScheduleTypes;
	stringifiedDate: string;
	scheduleViewPosition?: DialogProps['stylePosition'];
}

export default function Slot(props: SlotProps) {
	const {
		scheduleProps,
		stringifiedDate,
		scheduleViewPosition = 'fixed' as const,
	} = props;
	const { calendarId, title, type } = scheduleProps;
	const { time, date: scheduleDate } = scheduleProps.dateTime;
	const { start, end } = time;
	const {
		calendarList,
		recordPos,
	} = useContext(GlobalContext) as GlobalContextInterface;
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
			setIsScheduleViewVisible,
		},
		positionOffset: { x: 0, y: 0 },
		Component: ScheduleView,
		hasInitTransition: true,
		isDialogVisible: isScheduleViewVisible,
		setIsDialogVisible: setIsScheduleViewVisible,
		stylePosition: 'absolute' as const,
	}

	const timeOptions = getScheduleTimeOptions();
	const timeRange = () => {
		if (end < 0 && start < 0) return '';
		const endTime = timeOptions[end].time || '';
		const startTime = timeOptions[start].time || '';
		if (type === 'task') {
			return endTime;
		} else {
			return `${startTime}-${endTime}`;
		}
	}

	const slotHeight = () => {
		const defaultHeight = 13;
		if (scheduleProps.type === 'task') {
			return defaultHeight * 2;
		} else if (start < 0) {
			return defaultHeight * 3;
		} else if (stringifiedDate !== scheduleDate) {
			return end * defaultHeight;
		} else if (end > start) {
			return (end - start) * defaultHeight;
		} else if (start > end) {
			return (timeOptions.length - start) * defaultHeight;
		}
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

	function slotTitle() {
		const placeholder = title || '(No title)';
		if ('completed' in scheduleProps) {
			if (scheduleProps.completed) {
				return <s>{placeholder}</s>
			}
		}
		return placeholder;
	}

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
				{
					scheduleProps.type === 'event'
						? <>
							<div className='calendar-slot__text'>{slotTitle()}</div>
							<div className='calendar-slot__text'>{timeRange()}</div>
						</>
						: <div className='calendar-slot__text'>
							{`${slotTitle()}, ${timeRange()}`}
						</div>
				}

			</button>
			<Dialog ref={scheduleViewRef} {...scheduleViewProps} />
		</>
	)
}