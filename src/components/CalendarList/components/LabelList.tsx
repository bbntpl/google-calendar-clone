import { CalendarLabelType } from '../../../context/global/index.model';
import { LabelListProps } from '../index.model';
import Label from './Label';

export const LabelList = (props: LabelListProps): JSX.Element => {
	const { calendarList } = props;
	return <>{calendarList.map((calendarLbl: CalendarLabelType, index: number) => {
		return <Label
			key={`label-${index}`}
			calendarProps={calendarLbl}
			globalContextProps={props} />
	})}</>
}

export default LabelList;