import { CalendarLabelType } from '../../context/global/index.model';
import { LabelListProps } from './index.model';
import CalendarItem from './CalendarItem';

export const CalendarItemList = (props: LabelListProps): JSX.Element => {
	const { calendarList } = props;
	return <>{calendarList.map((calendarLbl: CalendarLabelType, index: number) => {
		return <CalendarItem
			key={`calendar-item-${index}`}
			calendarProps={calendarLbl}
			globalContextProps={props} />
	})}</>
}

export default CalendarItemList;