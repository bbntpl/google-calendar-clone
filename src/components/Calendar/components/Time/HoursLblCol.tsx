import React from 'react';
import { getDayTime } from '../../../../util/calendar-arrangement';
import TimeLabel from './TimeLabel';

export function HoursLblCol() {
	return <>
		{
			getDayTime().map((time, index) => {
				return <TimeLabel key={`${time}-${index}`}time={time} />
			})
		}
	</>
}