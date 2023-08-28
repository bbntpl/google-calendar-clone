import { MouseEvent, useContext, useState } from 'react';

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
	scheduleProps: ScheduleTypes
	stringifiedDate: string
	scheduleViewPosition?: DialogProps['stylePosition']
}

type SlotTitleProps = {
	scheduleProps: ScheduleTypes
	title: string
	isHovered: boolean
}

function SlotTitle({ scheduleProps, title, isHovered }: SlotTitleProps) {
	const placeholder = title || '(No title)';
	if ('completed' in scheduleProps && scheduleProps.completed) {
		return <s>{placeholder}</s>
	}
	return isHovered ? <b>{placeholder}</b> : <>{placeholder}</>;
}

export default function Slot(props: SlotProps) {
	const {
		scheduleProps,
		stringifiedDate,
		// Bookmarked: make use of this property later
		// scheduleViewPosition = 'fixed' as const,
	} = props;
	const { calendarId, title, type } = scheduleProps;
	const { time, date: scheduleDate } = scheduleProps.dateTime;
	const { start, end } = time;
	const {
		calendarList,
		recordPos,
	} = useContext(GlobalContext) as GlobalContextInterface;
	const [zIndex, setZIndex] = useState(1000);
	const [isHovered, setIsHovered] = useState(false);
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
	const formattedTimeRange = () => {
		if (end < 0 && start < 0) return '';
		const endTime = timeOptions[end].time || '';
		const startTime = timeOptions[start].time || '';
		if (type === 'task') {
			return endTime;
		} else {
			return `${startTime}-${endTime}`;
		}
	}

	const calculateSlotHeight = () => {
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

	const calculateTopPosition = () => {
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
		height: `${calculateSlotHeight()}px`,
		top: `${calculateTopPosition()}px`,
		zIndex,
	};

	const handleMouseOut = () => {
		setZIndex(1000);
		setIsHovered(false);
	}

	const handleMouseOver = () => {
		setZIndex(2000);
		setIsHovered(true);
	}

	const handleClick = (event: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
		recordPos(event);
		setIsScheduleViewVisible(visible => !visible)
	}

	return (
		<>
			<button
				style={slotStyles}
				className='calendar-slot'
				onMouseOver={handleMouseOver}
				onMouseOut={handleMouseOut}
				onClick={handleClick}
				ref={linkRef}
			>
				<div className='calendar-slot__text'>
					<SlotTitle scheduleProps={scheduleProps} title={title} isHovered={isHovered} />
					{` ${formattedTimeRange()}`}
				</div>
			</button >
			<Dialog ref={scheduleViewRef} {...scheduleViewProps} />
		</>
	)
}