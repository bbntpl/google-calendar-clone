
import { DateUnits } from '../../../contexts/CalendarConfigContext/index.model';
import { Schedule, Task, Event } from '../../../contexts/StoreContext/types/schedule';

import '../styles.scss';

import { convertDateUnitsToString } from '../../../util/calendar-arrangement';
import Slot from '../Slot/Slot';
import { useCalendarConfigUpdater } from '../../../contexts/CalendarConfigContext/index';
import { useAppConfigUpdater } from '../../../contexts/AppConfigContext';
import useScheduleLayout from '../../../hooks/useScheduleLayout';

interface TimeRowProps {
	dayIndex: number,
	time?: string,
	hourIndex?: number,
	dateValues: DateUnits
	filteredSchedulesByTime: Schedule[] | [],
	numOfDays: number
}

type SlotAdjustmentProps = {
	width: number | string;
	left: number | string;
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
	const {
		adjustSlotPositions,
	} = useScheduleLayout();

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