import React from 'react';

import { useCalendarConfig, useCalendarConfigUpdater } from '../../context/CalendarConfigContext';
import { CalendarUnits } from '../../context/CalendarConfigContext/index.model';

export default function CalendarUnitSelector() {
	const { selectedCalendarUnit } = useCalendarConfig();
	const { setSelectedCalendarUnit } = useCalendarConfigUpdater();

	const handleCalendarUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCalendarUnit(e.target.value as CalendarUnits);
	}

	return (
		<select
			className='header-input'
			value={selectedCalendarUnit}
			onChange={handleCalendarUnitChange}
		>
			<option value='day'>Day</option>
			<option value='week'>Week</option>
			<option value='fourDays'>4 Days</option>
		</select>
	)
}