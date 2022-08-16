import React from 'react';
import TimeRow from './TimeRow'
import { getDayTime } from '../../../../util/calendar-arrangement';

export function HoursBlockCol({ dayIndex }: { dayIndex: number }) {
	return <>
		{
			getDayTime().map((time, index) => {
				return <TimeRow key={`${time}-${index}`}time={time} dayIndex={dayIndex} />
			})
		}
	</>
}