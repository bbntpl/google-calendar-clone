import React from 'react';
import { getDayHours } from '../../../../util/calendar-arrangement';
import TimeLabel from './TimeLabel';

export function HoursLblCol() {
	return <>
		{
			getDayHours().map((time, index) => {
				return <TimeLabel key={`${time}-${index}`}time={time} />
			})
		}
	</>
}