import { useContext } from 'react';
import './styles.scss';
import GlobalContextInterface, { 
	CalendarType, 
} from '../../context/global/index.model';
import GlobalContext from '../../context/global/GlobalContext';
import CalendarDays from './components/Type/CalendarDays';

function CalendarByType({ calendarType }: { calendarType: CalendarType }) {
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
	const { calendarType } = useContext(GlobalContext) as GlobalContextInterface;
	return (
		<div className='calendar-wrapper'>
			<CalendarByType calendarType={calendarType} />
		</div>
	)
}