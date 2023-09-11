
import { DateUnits } from '../../../contexts/CalendarConfigContext/index.model';
import { Schedule, Task, Event } from '../../../contexts/StoreContext/types/schedule';

import '../styles.scss';

import { convertDateUnitsToString } from '../../../util/calendar-arrangement';
import Slot from '../Slot/Slot';
import { useCalendarConfigUpdater } from '../../../contexts/CalendarConfigContext/index';
import { useAppConfigUpdater } from '../../../contexts/AppConfigContext';

interface TimeRowProps {
	dayIndex: number,
	time?: string,
	hourIndex?: number,
	dateValues: DateUnits
	filteredSchedulesByTime: Schedule[] | []
}

type SlotAdjustmentProps = {
	width: number;
	left: number;
}

type AdjustedEvent = Event & SlotAdjustmentProps
type AdjustedTask = Task & SlotAdjustmentProps
export type AdjustedSchedule = AdjustedEvent | AdjustedTask;

export default function TimeRow(props: TimeRowProps) {
	const {
		hourIndex = -1,
		dayIndex,
		dateValues,
		filteredSchedulesByTime,
	} = props;

	const {
		recordPosition,
	} = useAppConfigUpdater();

	const {
		setSelectedDate,
		setIsScheduleDialogVisible,
		setDefaultDateTime,
	} = useCalendarConfigUpdater();

	const adjustSlotPositions = (schedules: Schedule[]): AdjustedSchedule[] => {
		// Ascendingly sort schedules by start time then end time
		const sortedSchedules = [...schedules].sort((a, b) => {
			if (a.dateTime.time.start !== b.dateTime.time.start) {
				return a.dateTime.time.start - b.dateTime.time.start;
			}
			return a.dateTime.time.end - b.dateTime.time.end;
		});

		const baseWidth = 98;
		// const overlapReduction = 3;

		const adjustedSchedules: AdjustedSchedule[]
			= sortedSchedules.map(schedule => ({
				...schedule,
				width: baseWidth,
				left: 0,
			}));


		for (let currentIndex = 0; currentIndex < adjustedSchedules.length; currentIndex++) {
			const currentSchedule = adjustedSchedules[currentIndex];
			const overlappingSchedules: AdjustedSchedule[] = [currentSchedule];

			for (let comparedIndex = 0; comparedIndex < adjustedSchedules.length; comparedIndex++) {
				const comparedSchedule = adjustedSchedules[comparedIndex];
				const isScheduleNotCurrent = comparedSchedule !== currentSchedule;
				const isComparedScheduleOverlapping =
					comparedSchedule.dateTime.time.start < currentSchedule.dateTime.time.end &&
					comparedSchedule.dateTime.time.end > currentSchedule.dateTime.time.start

				if (isScheduleNotCurrent && isComparedScheduleOverlapping) {
					overlappingSchedules.push(comparedSchedule);
				}
			}

			const width = baseWidth / overlappingSchedules.length;
			// const numberOfOverlaps = overlappingSchedules.length - 1;
			// const widthReduction = overlapReduction * numberOfOverlaps;
			// const reducedWidth = baseWidth - widthReduction;

			overlappingSchedules.forEach((schedule, index) => {
				schedule.width = width;
				schedule.left = index * width;
			});
		}

		return adjustedSchedules;
	}


	const adjustedSchedules = adjustSlotPositions(filteredSchedulesByTime);
	return (
		<div className='calendar-time__row'>
			{
				!dayIndex && <div className='calendar-time__block-side' />
			}
			<div
				className='calendar-time__block'
				onClick={(e) => {
					if (e.target !== e.currentTarget) return;
					recordPosition(e);
					setSelectedDate(dateValues);
					setDefaultDateTime({
						date: convertDateUnitsToString(dateValues),
						time: {
							start: hourIndex,
							end: (hourIndex + 1),
						},
					});
					setIsScheduleDialogVisible(true);
				}}
			>
				{
					adjustedSchedules.map((schedule) => {
						return <Slot
							key={`slot-${schedule.id}`}
							stringifiedDate={convertDateUnitsToString(dateValues)}
							schedule={schedule}
						/>
					})
				}
			</div>
		</div>
	)
}