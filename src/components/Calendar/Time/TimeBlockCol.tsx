import TimeRow from './TimeRow'
import {
	dayjsObjByDay,
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
		filteredSchedules,
	} = useContext(GlobalContext) as GlobalContextInterface;

	const defaultDateFormat = {
		yearFormat: 'YYYY',
		monthFormat: 'MM',
		dayFormat: 'DD',
	}
	const stringifiedDate = stringifyDate(getDateValues(dateObj, defaultDateFormat));
	// filter the available schedules by day index
	const filteredSchedulesByDay = filteredSchedules.filter(sch => {
		const { start, end } = sch.dateTime.time;
		const stringifiedPrevDate = stringifyDate(getDateValues(dayjsObjByDay({
			date: getDateValues(dateObj, defaultDateFormat),
			calendarType: 'day',
			index: -1,
		}), defaultDateFormat));
		const matchedDate = sch.dateTime.date === stringifiedDate;
		const prevDateIncludesNextDay = (
			sch.dateTime.date === stringifiedPrevDate
			&& (start > end)
			&& sch.type === 'event')
		return (matchedDate || prevDateIncludesNextDay);
	});

	return <>
		{
			getScheduleTimeOptions().map(({ timeWithoutMinutes }, hourIndex) => {
				if (hourIndex % 4 !== 0) return;

				// filter the available schedules by hour index
				const filteredSchedulesByTime = filteredSchedulesByDay.filter(sch => {
					const { type } = sch;
					const { start, end } = sch.dateTime.time;
					const timeIndex = type === 'task' ? end : start;
					const isScheduleSetFromPrevDay = sch.dateTime.date
					!== stringifyDate(getDateValues(dateObj, defaultDateFormat));
					const isIndexZero = hourIndex === 0;
					const matchedHourRange =
						!isScheduleSetFromPrevDay
						&& timeIndex >= Math.floor(hourIndex)
						&& timeIndex < Math.floor(hourIndex + 4);

					// scheduled event set from previous day that includes hour range 
					// from next day
					return (isScheduleSetFromPrevDay && isIndexZero) || matchedHourRange;
				});

				return <TimeRow
					key={`time-row-${hourIndex /4}`}
					dateValues={getDateValues(dateObj, dateFormats)}
					time={timeWithoutMinutes}
					hourIndex={hourIndex}
					dayIndex={dayIndex}
					filteredSchedulesByTime={filteredSchedulesByTime}
				/>
			})
		}
	</>
}