import { LabelListProps } from './index.model';
import CalendarItem from './CalendarItem';
import { Calendar } from '../../context/StoreContext/types/calendar';

export const CalendarItemList = (props: LabelListProps): JSX.Element => {
	const { calendarList } = props;
	return <>{calendarList.map((calendarLbl: Calendar, index: number) => {
		return <CalendarItem
			key={`calendar-item-${index}`}
			calendarProps={calendarLbl}
			globalContextProps={props} />
	})}</>
}

export default CalendarItemList;