
import { convertDateUnitsToString } from '../../../util/calendar-arrangement';
import useComponentVisible from '../../../hooks/useComponentVisible';

import '../styles.scss';

import Slot from '../Slot/Slot';
import Dialog from '../../../lib/Dialog';
import { DateUnits } from '../../../contexts/CalendarConfigContext/index.model';
import { Schedule } from '../../../contexts/StoreContext/types/schedule';
import { useCalendarConfigUpdater } from '../../../contexts/CalendarConfigContext';
import { useAppConfigUpdater } from '../../../contexts/AppConfigContext';

interface SlotListProps {
	dateValues: DateUnits;
	filteredSchedulesByTime: Schedule[] | [];
}

interface TimeRowProps extends SlotListProps {
	dayIndex: number;
	time?: string;
	hourIndex?: number;
}

function SlotList(props: SlotListProps) {
	const { filteredSchedulesByTime, dateValues } = props;
	return (
		<div className='slot-list'>
			{
				filteredSchedulesByTime.map((schedule, index) => {
					if (index === 0) return;
					return <Slot
						key={`slot-list-item-${index}`}
						stringifiedDate={convertDateUnitsToString(dateValues)}
						schedule={schedule}
						scheduleViewPosition='absolute'
					/>
				})}
		</div>
	)
}

export default function TimeRowUnset(props: TimeRowProps) {
	const {
		dayIndex,
		dateValues,
		filteredSchedulesByTime,
	} = props;

	const totalHolidayEvents = filteredSchedulesByTime
		.slice(0, filteredSchedulesByTime.length - 1)
		.filter(event => event.calendarType == 'holiday').length;
	const totalDefaultSchedules
		= filteredSchedulesByTime.length - 1 - totalHolidayEvents;

	const {
		setSelectedDate,
		setIsScheduleDialogVisible,
		setDefaultDateTime,
	} = useCalendarConfigUpdater();

	const {
		recordPosition,
	} = useAppConfigUpdater();

	const [
		slotListRef,
		isSlotListVisible,
		setIsSlotListVisible,
		linkRef,
	] = useComponentVisible();

	const slotListProps = {
		isDraggable: false,
		componentProps: {
			filteredSchedulesByTime,
			dateValues,
		},
		delta: { x: 0, y: 20 },
		Component: SlotList,
		isDialogVisible: isSlotListVisible,
		setIsDialogVisible: setIsSlotListVisible,
		stylePosition: 'absolute' as const,
	}

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
						time: { start: -1, end: -1 },
					});
					setIsScheduleDialogVisible(true);
				}}
			>
				{
					filteredSchedulesByTime.map((schedule, index) => {
						if (index !== 0) return;
						return <Slot
							key={`slot-${schedule.id}`}
							stringifiedDate={convertDateUnitsToString(dateValues)}
							schedule={schedule}
						/>
					})
				}
				{
					filteredSchedulesByTime.length > 1 &&
					<button
						ref={linkRef}
						className='schedule-tasks-counter'
						onClick={() => setIsSlotListVisible(visible => !visible)}
					>
						{totalHolidayEvents ? `${totalHolidayEvents} more holiday events` : ''}
						{totalHolidayEvents && totalDefaultSchedules ? ' - ' : ''}
						{totalDefaultSchedules ? `${totalDefaultSchedules} more schedules` : ''}
					</button>
				}
				<Dialog ref={slotListRef} {...slotListProps} />
			</div>
		</div>
	)
}