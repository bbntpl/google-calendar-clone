import { CalendarItemsProps } from './index.model';
import CalendarItem from './CalendarItem';
import { Calendar } from '../../contexts/StoreContext/types/calendar';

export const CalendarItemList = (props: CalendarItemsProps): JSX.Element => {
	const { calendars } = props;
	return <>{calendars.map((calendarLbl: Calendar, index: number) => {
		return <CalendarItem
			key={`calendar-item-${index}`}
			calendarProps={calendarLbl}
			globalContextProps={props} />
	})}</>
}

export default CalendarItemList;