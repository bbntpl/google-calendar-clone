import React from 'react';
import TimeRow from './TimeRow'
import { getDateValues, getDayTime } from '../../../../util/calendar-arrangement';
import { Dayjs } from 'dayjs';

interface HoursBlockColProps {
	dayIndex: number,
	dateObj: Dayjs
}

export function HoursBlockCol(props: HoursBlockColProps) {
	const { dayIndex, dateObj } = props;
	return <>
		{
			getDayTime().map((hour, hourIndex) => {
				return <TimeRow
					key={`${hour}-${hourIndex}`}
					dateValues={getDateValues(dateObj)}
					hour={hour}
					hourIndex={hourIndex}
					dayIndex={dayIndex}
				/>
			})
		}
	</>
}