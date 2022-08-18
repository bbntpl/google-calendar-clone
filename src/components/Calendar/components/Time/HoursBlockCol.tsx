import React from 'react';
import TimeRow from './TimeRow'
import {
	getDateValues,
	getScheduleTimeOptions,
} from '../../../../util/calendar-arrangement';
import { Dayjs } from 'dayjs';

interface HoursBlockColProps {
	dayIndex: number,
	dateObj: Dayjs
}

export function HoursBlockCol(props: HoursBlockColProps) {
	const { dayIndex, dateObj } = props;
	return <>
		{
			getScheduleTimeOptions().map(({ hour, time }, hourIndex) => {
				return <TimeRow
					key={`${hour}-${hourIndex}`}
					dateValues={getDateValues(dateObj)}
					time={time}
					hourIndex={hourIndex}
					dayIndex={dayIndex}
				/>
			})
		}
	</>
}