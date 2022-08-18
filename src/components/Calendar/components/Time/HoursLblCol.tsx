import React from 'react';
import { getScheduleTimeOptions } from '../../../../util/calendar-arrangement';
import TimeLabel from './TimeLabel';

export function HoursLblCol() {
	return <>
		{
			getScheduleTimeOptions().map(({ time }, index) => {
				if(index % 4 !== 0) return;  
				return <TimeLabel key={`${time}-${index}`} time={time} />
			})
		}
	</>
}