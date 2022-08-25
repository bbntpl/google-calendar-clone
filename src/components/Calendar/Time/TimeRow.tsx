import { useContext } from 'react';
import GlobalContext from '../../../context/global/GlobalContext';
import GlobalContextInterface, { SelectedDate } from '../../../context/global/index.model';
import { stringifiedDate } from '../../../util/calendar-arrangement';
import '../styles.scss';

interface TimeRowProps {
	dayIndex: number,
	time?: string,
	hourIndex?: number,
	dateValues: SelectedDate
}

export default function TimeRow(props: TimeRowProps) {
	const { time, hourIndex = -1, dayIndex, dateValues } = props;
	const {
		setIsScheduleDialogVisible,
		setDefaultDateTime,
		recordPos,
	} = useContext(GlobalContext) as GlobalContextInterface;

	return (
		<div className='calendar-time__row'>
			{
				!dayIndex && <div className='calendar-time__block-side' />
			}
			<div
				className='calendar-time__block'
				onClick={(e) => {
					recordPos(e);
					setDefaultDateTime({
						date: stringifiedDate(dateValues),
						time: { 
							start: hourIndex, 
							end: (hourIndex + 1),
						 },
					});
					setIsScheduleDialogVisible(true);
				}}
			>
			</div>
		</div>
	)
}