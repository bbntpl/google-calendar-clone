import TimeRow from './TimeRow'
import {
	getDateValues,
	getScheduleTimeOptions,
} from '../../../util/calendar-arrangement';
import { Dayjs } from 'dayjs';

interface TimeBlockColProps {
	dayIndex: number,
	dateObj: Dayjs
}

export default function TimeBlockCol(props: TimeBlockColProps) {
	const { dayIndex, dateObj } = props;
	return <>
		{
			getScheduleTimeOptions().map(({ hour, timeWithoutMinutes }, hourIndex) => {
				if (hourIndex % 4 !== 0) return;
				return <TimeRow
					key={`${hour}-${hourIndex}`}
					dateValues={getDateValues(dateObj)}
					time={timeWithoutMinutes}
					hourIndex={hourIndex}
					dayIndex={dayIndex}
				/>
			})
		}
	</>
}