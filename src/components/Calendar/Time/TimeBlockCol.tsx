import TimeRow from './TimeRow'
import {
	dayjsObj,
	getDateValues,
	getScheduleTimeOptions,
} from '../../../util/calendar-arrangement';
import { Dayjs } from 'dayjs';
import { useContext } from 'react';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface from '../../../context/global/index.model';
import { stringifyDate } from '../../../util/calendar-arrangement';

interface TimeBlockColProps {
	dayIndex: number,
	dateObj: Dayjs
}

const dateFormats = {
	yearFormat: 'YYYY', 
	monthFormat: 'M', 
	dayFormat: 'D',
}

export default function TimeBlockCol(props: TimeBlockColProps) {
	const { dayIndex, dateObj } = props;
	const { 
		savedSchedules,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const filteredSchedulesByDay = savedSchedules.filter(sch => {
		return sch.dateTime.date === stringifyDate(getDateValues(dateObj, {
			yearFormat: 'YYYY',
			monthFormat: 'MM',
			dayFormat: 'DD',
		}));
	});

	return <>
		{
			getScheduleTimeOptions().map(({ hour, timeWithoutMinutes }, hourIndex) => {
				if (hourIndex % 4 !== 0) return;
				const filteredSchedulesByTime = filteredSchedulesByDay.filter(sch => {
					return (sch.dateTime.time.end || sch.dateTime.time.start) === hourIndex;
				});
				return <TimeRow
					key={`${hour}-${hourIndex}`}
					dateValues={getDateValues(dateObj, dateFormats)}
					time={timeWithoutMinutes}
					hourIndex={hourIndex}
					dayIndex={dayIndex}
					filteredSchedules={filteredSchedulesByTime}
				/>
			})
		}
	</>
}