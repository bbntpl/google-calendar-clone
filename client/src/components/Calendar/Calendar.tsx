import { useContext } from 'react';
import GlobalContextInterface, { 
	CalendarUnits, 
} from '../../context/global/index.model';
import GlobalContext from '../../context/global/GlobalContext';
import './styles.scss';

import CalendarDays from './Type/CalendarDays';

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
	const { selectedCalendarUnit } = useContext(GlobalContext) as GlobalContextInterface;
	return (
		<div className='calendar-wrapper'>
			<CalendarByType calendarType={selectedCalendarUnit} />
		</div>
	)
}