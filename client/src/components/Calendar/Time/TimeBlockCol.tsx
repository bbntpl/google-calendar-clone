import { useContext } from 'react';
import { Dayjs } from 'dayjs';

import {
	dayjsObjByDay,
	getDateValues,
	getScheduleTimeOptions,
} from '../../../util/calendar-arrangement';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface from '../../../context/global/index.model';
import { convertDateUnitsToString } from '../../../util/calendar-arrangement';

import TimeRow from './TimeRow'

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
	const { filteredSchedules } = useContext(GlobalContext) as GlobalContextInterface;

	const defaultDateFormat = {
		yearFormat: 'YYYY',
		monthFormat: 'MM',
		dayFormat: 'DD',
	}
	const stringifiedDate = convertDateUnitsToString(getDateValues(dateObj, defaultDateFormat));
	// Filter the available schedules by day index
	const filteredSchedulesByDay = filteredSchedules.filter(schedule => {
		const { start, end } = schedule.dateTime.time;
		const stringifiedPrevDate = convertDateUnitsToString(getDateValues(dayjsObjByDay({
			date: getDateValues(dateObj, defaultDateFormat),
			calendarUnit: 'day',
			index: -1,
		}), defaultDateFormat));
		const matchedDate = schedule.dateTime.date === stringifiedDate;
		const prevDateIncludesNextDay = (
			schedule.dateTime.date === stringifiedPrevDate
			&& (start > end)
			&& schedule.type === 'event')
		return (matchedDate || prevDateIncludesNextDay);
	});

	return <>
		{
			getScheduleTimeOptions().map(({ timeWithoutMinutes }, hourIndex) => {
				if (hourIndex % 4 !== 0) return;

				// Filter the available schedules by hour index
				const filteredSchedulesByTime = filteredSchedulesByDay.filter(schedule => {
					const { type } = schedule;
					const { start, end } = schedule.dateTime.time;
					const timeIndex = type === 'task' ? end : start;
					const isScheduleSetFromPrevDay = schedule.dateTime.date
					!== convertDateUnitsToString(getDateValues(dateObj, defaultDateFormat));
					const isIndexZero = hourIndex === 0;
					const matchedHourRange =
						!isScheduleSetFromPrevDay
						&& timeIndex >= Math.floor(hourIndex)
						&& timeIndex < Math.floor(hourIndex + 4);

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