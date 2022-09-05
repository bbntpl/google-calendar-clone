import TimeRow from './TimeRow'
import {
	dayjsObj,
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

	// filter the available schedules by day index
	const filteredSchedulesByDay = filteredSchedules.filter(sch => {
		const prevDayButEndsNextDay = stringifyDate(getDateValues(dayjsObjByDay({
			date: 
		}), {
			yearFormat: 'YYYY',
			monthFormat: 'MM',
			dayFormat: 'DD',
		}));
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

				// filter the available schedules by hour index
				const filteredSchedulesByTime = filteredSchedulesByDay.filter(sch => {
					const { start, end } = sch.dateTime.time;
					const timeIndex = !start ? end : start;
					return timeIndex >= Math.floor(hourIndex)
						&& timeIndex < Math.floor(hourIndex + 4);
				});

				return <TimeRow
					key={`${hour}-${hourIndex}`}
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