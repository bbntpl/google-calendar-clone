import { useContext } from 'react';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface, {
	DateUnits, ScheduleTypes,
} from '../../../context/global/index.model';
import { convertDateUnitsToString } from '../../../util/calendar-arrangement';
import '../styles.scss';
import Slot from '../Slot/Slot';

interface TimeRowProps {
	dayIndex: number,
	time?: string,
	hourIndex?: number,
	dateValues: DateUnits
	filteredSchedulesByTime: ScheduleTypes[] | []
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
		setSelectedDate,
		setIsScheduleDialogVisible,
		setDefaultDateTime,
		recordPos,
	} = useContext(GlobalContext) as GlobalContextInterface;

	return (
		<div className='calendar-time__row'>
			{
				!dayIndex && <div className='calendar-time__block-side' />
			}
			<div
				className='calendar-time__block'
				onClick={(e) => {
					if (e.target !== e.currentTarget) return;
					recordPos(e);
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