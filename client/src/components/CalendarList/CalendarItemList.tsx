import { CalendarItem as CalendarItemType } from '../../context/global/index.model';
import { LabelListProps } from './index.model';
import CalendarItem from './CalendarItem';

export const CalendarItemList = (props: LabelListProps): JSX.Element => {
	const { calendarList } = props;
	return <>{calendarList.map((calendarLbl: CalendarItemType, index: number) => {
		return <CalendarItem
			key={`calendar-item-${index}`}
			calendarProps={calendarLbl}
			globalContextProps={props} />
	})}</>
}

export default CalendarItemList;