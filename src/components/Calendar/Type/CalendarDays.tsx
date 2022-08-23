import { useContext } from 'react';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface from '../../../context/global/index.model';
import { dayjsObjByDay } from '../../../util/calendar-arrangement';
import '../styles.scss';

import { DayHeader } from '../Day';
import { TimeBlockCol, TimeLabelCol, TimeLabel } from '../Time';

dayjs.extend(utc);
dayjs.extend(timezone);
const timezoneGMT = dayjs().format('ZZ');

export default function CalendarDays({ numOfDays }: { numOfDays: number }) {
	const { selectedDate, calendarType } = useContext(GlobalContext) as GlobalContextInterface;

	const dateObj = (index: number) => {
		return dayjsObjByDay({
			date: selectedDate,
			calendarType,
			index,
		});
	}

	return (
		<>
			<div className='calendar-component-container'>
				<TimeLabel time={`GMT${timezoneGMT.slice(0, 3)}`} />
				<div className='calendar-grid'>
					{
						Array.from({ length: numOfDays }, (_, i) => {
							return <DayHeader
								key={`day-header-${i + 1}`}
								dateObj={dateObj(i)}
								dayIndex={i}
								isCentered={numOfDays !== 1}
							/>
						})
					}
				</div>
			</div>
			<div className='calendar-component-container'>
				<div className='calendar__date-cols'>
					<TimeLabelCol />
				</div>
				<div className='calendar-grid'>
					{
						Array.from({ length: numOfDays }, (_, dayIndex) => {
							return (
								<div
									key={`time-col-${dayIndex + 1}`}
									className='calendar__date-cols'>
									<TimeBlockCol
										dayIndex={dayIndex}
										dateObj={dateObj(dayIndex)}
									/>
								</div>
							)
						})
					}
				</div>
			</div>
		</>
	)
}