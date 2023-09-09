
import { DateUnits } from '../../../contexts/CalendarConfigContext/index.model';
import { Schedule } from '../../../contexts/StoreContext/types/schedule';

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

export default function TimeRow(props: TimeRowProps) {
	const {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		time,
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
					filteredSchedulesByTime.map((schedule) => {
						return <Slot
							key={`slot-${schedule.id}`}
							stringifiedDate={convertDateUnitsToString(dateValues)}
							scheduleProps={schedule}
						/>
					})
				}
			</div>
		</div>
	)
}