import './styles.scss';

import CalendarDays from './Type/CalendarDays';
import { CalendarUnits } from '../../contexts/CalendarConfigContext/index.model';
import { useCalendarConfig } from '../../contexts/CalendarConfigContext';

function CalendarByType({ calendarType }: { calendarType: CalendarUnits }) {
	switch (calendarType) {
		case 'day':
			return <CalendarDays numOfDays={1}/>
		case 'week':
			return <CalendarDays numOfDays={7} />
		case 'fourDays':
			return <CalendarDays numOfDays={4}/>
		default:
			return <div>default</div>
	}
}

export default function Calendar() {
	const { selectedCalendarUnit } = useCalendarConfig();
	return (
		<div className='calendar-wrapper'>
			<CalendarByType calendarType={selectedCalendarUnit} />
		</div>
	)
}