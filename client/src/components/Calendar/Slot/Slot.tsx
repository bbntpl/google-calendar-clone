import {
	MouseEvent,
	useState,
} from 'react';
import { createPortal } from 'react-dom';

import { getScheduleTimeOptions } from '../../../util/calendar-arrangement';
import useComponentVisible from '../../../hooks/useComponentVisible';

import { ScheduleView } from '../../Schedules/View/ScheduleView';
import Dialog from '../../../lib/Dialog';
import { DialogProps } from '../../../lib/Dialog/index.model';
import { useStore } from '../../../contexts/StoreContext';
import { useAppConfigUpdater } from '../../../contexts/AppConfigContext';
import { AdjustedSchedule } from '../Time/TimeRow';
import { Schedule } from '../../../contexts/StoreContext/types/schedule';

type SlotProps = {
	schedule: AdjustedSchedule | Schedule;
	stringifiedDate: string
	scheduleViewPosition?: DialogProps['stylePosition']
}

type SlotTitleProps = {
	schedule: AdjustedSchedule | Schedule
	title: string
	isHovered: boolean
}

function SlotTitle({ schedule, title, isHovered }: SlotTitleProps) {
	const placeholder = title || '(No title)';
	if ('completed' in schedule && schedule.completed) {
		return <s>{placeholder}</s>
	}
	return isHovered ? <b>{placeholder}</b> : <>{placeholder}</>;
}

export default function Slot(props: SlotProps) {
	const {
		schedule,
		stringifiedDate,
	} = props;
	const { calendarId, title, type } = schedule;
	const { time, date: scheduleDate } = schedule.dateTime;
	const { start, end } = time;
	const { calendars } = useStore();
	const { recordPosition } = useAppConfigUpdater();
	const [isHovered, setIsHovered] = useState(false);
	const [
		scheduleViewRef,
		isScheduleViewVisible,
		setIsScheduleViewVisible,
		linkRef,
	] = useComponentVisible();
	const scheduleViewProps = {
		isDraggable: false,
		isSelfAdjustable: true,
		componentProps: {
			scheduleProps: schedule,
			setIsScheduleViewVisible,
		},
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
		if (schedule.type === 'task') {
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

	const associatedCalendar = calendars.find((obj) => obj.id === calendarId);
	const bgColor = 'colorOption' in schedule
		? schedule.colorOption.value || associatedCalendar?.colorOption.value
		: associatedCalendar?.colorOption.value

	const calculateSlotStyles = (schedule: AdjustedSchedule | Schedule) => {
		const adjustmentStyles: { width?: string | number, left?: string | number } = {};
		if ('width' in schedule && 'left' in schedule) {
			adjustmentStyles.left = schedule.left;
			adjustmentStyles.width = schedule.width;
		}

		return {
			backgroundColor: bgColor,
			borderLeft: `5px solid ${associatedCalendar?.colorOption.value}`,
			height: `${calculateSlotHeight()}px`,
			top: `${calculateTopPosition()}px`,
			zIndex: 800,
			...adjustmentStyles,
		}
	};

	const handleMouseOut = () => {
		setIsHovered(false);
	}

	const handleMouseOver = () => {
		setIsHovered(true);
	}

	const handleClick = (event: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
		recordPosition(event);
		setIsScheduleViewVisible(visible => !visible)
	}

	console.log(calculateSlotStyles(schedule));
	return (
		<>
			<button
				style={calculateSlotStyles(schedule)}
				className='calendar-slot'
				onMouseOver={handleMouseOver}
				onMouseOut={handleMouseOut}
				onClick={handleClick}
				ref={linkRef}
			>
				<div className='calendar-slot__text'>
					<SlotTitle
						schedule={schedule}
						title={title}
						isHovered={isHovered}
					/>
					{` ${formattedTimeRange()}`}
				</div>
			</button>
			{
				createPortal(
					<Dialog ref={scheduleViewRef} {...scheduleViewProps} />,
					document.body,
				)
			}
		</>
	)
}